// /blog/글주소 요청을 받아 크롤러가 읽을 수 있는 완전한 HTML을 만들어 보냅니다.
const PROJECT = 'gato-mobile';
const API_KEY = 'AIzaSyDXed9i1ju0Nr8DXqGJZ4WMW8dcnIMP4i8';
const SITE = 'https://gatomobile.kr';

// 제목 -> 주소 (blog.html 과 동일한 규칙)
function slugify(t) {
  return (t || '')
    .trim()
    .replace(/[^\uAC00-\uD7A3a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .slice(0, 80);
}

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Firestore REST 응답을 평범한 객체로
function unwrap(fields) {
  const o = {};
  for (const k in fields) {
    const v = fields[k];
    if ('stringValue' in v) o[k] = v.stringValue;
    else if ('booleanValue' in v) o[k] = v.booleanValue;
    else if ('timestampValue' in v) o[k] = v.timestampValue;
    else if ('integerValue' in v) o[k] = Number(v.integerValue);
  }
  return o;
}

async function fetchPosts() {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/blog?pageSize=300&key=${API_KEY}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('firestore ' + r.status);
  const j = await r.json();
  return (j.documents || []).map(d => ({
    id: d.name.split('/').pop(),
    ...unwrap(d.fields)
  }));
}

// 본문에서 스타일과 body만 뽑아냅니다 (관리자가 통째 HTML을 붙여넣는 경우 대응)
// 글에 들어있는 스타일이 페이지 전체(메뉴/푸터)로 새지 않게 본문 안에만 가둡니다.
function scopeStyles(css) {
  if (!css) return '';
  return css.replace(/(^|\}|\{)\s*([^@{}]+)\{/g, (m, brace, sel) => {
    const scoped = sel.split(',').map(one => {
      const t = one.trim();
      if (!t) return t;
      if (/^(html|body)$/i.test(t)) return '.post-body';
      if (/^(html|body)\b/i.test(t)) return '.post-body ' + t.replace(/^(html|body)\s*/i, '');
      if (/^(from|to|\d+%)$/i.test(t)) return t;
      if (t.startsWith('.post-body')) return t;
      return '.post-body ' + t;
    }).join(', ');
    return brace + '\n' + scoped + '{';
  });
}

function splitContent(raw) {
  let s = (raw || '').trim();

  // 통째 HTML 문서면 body 안쪽만 사용
  if (/^<!doctype/i.test(s) || /^<html/i.test(s)) {
    const m = s.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (m) {
      const head = s.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
      s = (head ? head[1] : '') + m[1];
    }
  }

  // 문서 형태와 무관하게 style 태그를 모두 뽑아냅니다
  const styles = (s.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [])
    .map(x => x.replace(/<\/?style[^>]*>/gi, '')).join('\n');

  let body = s
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<\/?(html|head|body|meta|title|link)[^>]*>/gi, '');

  return { styles: scopeStyles(styles), body };
}

// 첫 문단을 요약으로 (meta description + 스키마용)
function makeSummary(body) {
  const text = (body || '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.slice(0, 155);
}

module.exports = async (req, res) => {
  const slug = decodeURIComponent(req.query.slug || '');

  let posts;
  try {
    posts = await fetchPosts();
  } catch (e) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(500).send('<!doctype html><meta charset="utf-8"><p>일시적으로 글을 불러오지 못했어요.</p>');
  }

  const live = posts.filter(p => p.draft !== true);
  const post = live.find(p => slugify(p.title) === slug) || live.find(p => p.id === slug);

  if (!post) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(404).send(
      `<!doctype html><html lang="ko"><meta charset="utf-8"><title>글을 찾을 수 없어요 - 가토통신</title>
       <meta name="robots" content="noindex">
       <body style="font-family:sans-serif;text-align:center;padding:80px 20px">
       <p>글을 찾을 수 없어요.</p><a href="/blog">블로그 목록으로</a></body></html>`
    );
  }

  const { styles, body } = splitContent(post.content);
  const summary = (post.description || '').trim().slice(0, 155) || makeSummary(body);
  const url = `${SITE}/blog/${encodeURIComponent(slugify(post.title))}`;
  const published = post.createdAt || new Date().toISOString();
  const dateText = new Date(published).toLocaleDateString('ko-KR');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: summary,
    datePublished: published,
    dateModified: published,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: '가토통신' },
    publisher: {
      '@type': 'Organization',
      name: '가토통신',
      url: SITE
    },
    inLanguage: 'ko-KR'
  };

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(post.title)} - 가토통신</title>
<meta name="description" content="${esc(summary)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(post.title)}">
<meta property="og:description" content="${esc(summary)}">
<meta property="og:url" content="${esc(url)}">
${post.thumbnail && /^https?:/.test(post.thumbnail) ? `<meta property="og:image" content="${esc(post.thumbnail)}">` : ''}
<link rel="canonical" href="${esc(url)}">
<meta name="google-site-verification" content="yLwtQOQErWNIXvJmKw1kyLiD2Ziu1ZuJN_QYxwgAYUA">
<meta name="naver-site-verification" content="f23fe941fa9c2d49aa4082228a56eeedf35ce1ce">
<link rel="icon" href="/favicon.ico">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v=1">
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-LEJJMRTQBC"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-LEJJMRTQBC');</script>
<style>
.pw{max-width:800px;margin:0 auto;padding:32px 20px 80px}
.back{display:inline-block;margin-bottom:20px;font-weight:700;font-size:14px}
.post-head{margin-bottom:26px;padding-bottom:20px;border-bottom:1.5px solid #D7ECF9;display:flex;flex-direction:column;gap:10px}
.post-head h1{margin:0;font-size:30px;font-weight:900;letter-spacing:-.5px;line-height:1.4}
.post-meta{font-size:13px;color:#4F6577;display:flex;gap:8px;align-items:center}
.post-thumb{width:100%;border-radius:16px;margin-bottom:24px;display:block}
.post-body{line-height:1.85;font-size:16px;background:#fff;border:1px solid #D7ECF9;border-radius:20px;padding:32px}
.post-body img{max-width:100%;height:auto}
.post-body h2{font-size:22px;font-weight:800;margin:36px 0 12px;letter-spacing:-.3px}
.post-body h3{font-size:18px;font-weight:700;margin:26px 0 10px}
.post-body p{margin:0 0 16px}
.post-body ul,.post-body ol{margin:0 0 16px 20px}
.post-body table{width:100%;border-collapse:collapse;margin:18px 0;font-size:15px;display:block;overflow-x:auto}
.post-body th,.post-body td{border:1px solid #D7ECF9;padding:10px 12px;text-align:left}
.post-body th{background:#EEF8FE;font-weight:700}
.cta{margin-top:36px;padding:26px;background:#E6F4FC;border-radius:18px;text-align:center}
.cta p{margin:6px 0 14px;font-size:14px;color:#4F6577}
@media(max-width:700px){.post-head h1{font-size:23px}.post-body{padding:20px 16px;border-radius:16px}}

/* 아래는 글마다 들어있는 스타일 (본문 안으로 한정됨) */
${styles}

/* 안전장치 - 글 스타일이 새더라도 메뉴/푸터는 지킵니다 */
html,body{max-width:none !important;width:auto !important;margin:0 !important;padding:0 !important;}
.hd,.ft{max-width:none !important;width:auto !important;}
</style>
</head>
<body>
<header class="hd">
<div class="hd-in">
<a href="/" class="logo" aria-label="가토통신 홈"><b>가토통신</b><span>× 앤텔레콤</span></a>
<nav class="gnb" aria-label="주 메뉴"><div class="gm"><a href="/open/self" class="gm-top">개통</a><div class="gm-sub"><a href="/open/self">셀프개통</a><a href="https://xn--h49a23sumlf7l.kr" target="_blank" rel="noopener">선불폰 개통</a></div></div><div class="gm"><a href="/plans/kt" class="gm-top">요금제</a><div class="gm-sub"><a href="/plans/kt">KT 알뜰폰</a><a href="/plans/lg">LG 알뜰폰</a><a href="/plans/prepaid">선불요금제</a></div></div><div class="gm"><a href="/usim" class="gm-top">유심</a><div class="gm-sub"><a href="/usim">유심구매</a><a href="/esim">eSIM</a></div></div><div class="gm"><a href="/blog" class="gm-top on">블로그</a></div><div class="gm"><a href="/faq" class="gm-top">고객지원</a><div class="gm-sub"><a href="/faq">자주 묻는 질문</a><a href="/support/contact">1:1 문의</a><a href="/support/center">센터 안내</a></div></div></nav>
<a href="https://xn--h49a23sumlf7l.kr" target="_blank" rel="noopener" class="hd-pre">선불폰</a>
<button type="button" class="mbtn" aria-label="메뉴 열기" aria-expanded="false" aria-controls="mnav"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg></button>
</div>
<nav class="mnav" id="mnav" aria-label="모바일 메뉴"><h3>개통</h3><a href="/open/self">셀프개통</a><a href="https://xn--h49a23sumlf7l.kr" target="_blank" rel="noopener">선불폰 개통</a><h3>요금제</h3><a href="/plans/kt">KT 알뜰폰</a><a href="/plans/lg">LG 알뜰폰</a><a href="/plans/prepaid">선불요금제</a><h3>유심</h3><a href="/usim">유심구매</a><a href="/esim">eSIM</a><h3>블로그</h3><a href="/blog">블로그</a><h3>고객지원</h3><a href="/faq">자주 묻는 질문</a><a href="/support/contact">1:1 문의</a><a href="/support/center">센터 안내</a><h3>가토선불폰</h3><a href="https://xn--h49a23sumlf7l.kr" target="_blank" rel="noopener">선불폰 사이트 바로가기</a></nav>
</header>
<main class="pw">
  <a href="/blog" class="back">← 블로그 목록</a>
  <article>
    <header class="post-head">
      ${post.category ? `<span class="chip" style="align-self:flex-start">${esc(post.category)}</span>` : ''}
      <h1>${esc(post.title)}</h1>
      <div class="post-meta">${esc(dateText)} · 가토통신</div>
    </header>
    ${post.thumbnail ? `<img class="post-thumb" src="${esc(post.thumbnail)}" alt="">` : ''}
    <div class="post-body">
${body}
    </div>
  </article>
  <div class="cta">
    <strong style="font-size:18px">알뜰폰·선불폰 개통이 필요하세요?</strong>
    <p>신규 개통 매일 08:00~21:50 · 셀프개통으로 집에서 바로 가능해요</p>
    <span style="display:inline-flex;gap:8px;flex-wrap:wrap;justify-content:center"><a class="btn" href="/open/self">셀프개통 안내</a><a class="btn kakao" href="https://pf.kakao.com/_espRn/chat" target="_blank" rel="noopener">카카오톡 채널 가토</a></span>
  </div>
</main>
<footer class="ft">
<div class="ft-in">
<nav class="ft-links" aria-label="하단 링크">
<a href="https://www.n-telecom.co.kr/view/terms/terms.aspx?type=01" target="_blank" rel="noopener">이용약관</a>
<a class="b" href="https://www.n-telecom.co.kr/gatomobile/view/terms/terms.aspx?type=03" target="_blank" rel="noopener">개인정보처리방침</a>
<a href="https://msafer.or.kr/index.do" target="_blank" rel="noopener">명의도용방지서비스</a>
<a href="https://spam.kisa.or.kr/spam/main.do" target="_blank" rel="noopener">불법스팸대응센터</a>
<a href="https://xn--h49a23sumlf7l.kr" target="_blank" rel="noopener">가토선불폰</a>
<a href="/support/contact?topic=partner">제휴문의</a>
</nav>
<div class="ft-cols">
<div class="ft-col"><span class="k">고객센터</span><strong>1899-7700 <small style="font-size:12px;font-weight:500;color:#6B7280">(유료)</small></strong><span>[모바일] 휴대폰 + 114 (무료)</span><span>평일 09:30~18:00 · 토/일/공휴일 휴무</span></div>
<div class="ft-col"><span class="k">가토통신</span><strong class="p">010-4316-4477</strong><span>월~토 연중무휴 상담 가능</span><span>개통 매일 08:00~21:50</span></div>
<div class="ft-col" style="flex-grow:1.4"><span class="k">사업자 정보</span><span>상호명: 가토통신 | 대표자: 이철용</span><span>주소: 경기도 부천시 원미구 부천로 39번길 8 동아빌딩 6층</span><span>연락처: 010-4316-4477 | Email: 4477gato@gmail.com</span></div>
</div>
<span class="ft-copy">© 2026 가토통신. All rights reserved.</span>
</div>
</footer>
<script src="/assets/site.js?v=1" defer></script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  return res.status(200).send(html);
};
