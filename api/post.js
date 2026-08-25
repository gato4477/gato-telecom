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
  const s = (raw || '').trim();
  const isFullDoc = /^<!doctype/i.test(s) || /^<html/i.test(s);
  if (!isFullDoc) return { styles: '', body: s };
  const styles = (s.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [])
    .map(x => x.replace(/<\/?style[^>]*>/gi, '')).join('\n');
  const m = s.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let body = m ? m[1] : s;
  body = body.replace(/<script[\s\S]*?<\/script>/gi, '');
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

  const post = posts.find(p => slugify(p.title) === slug) || posts.find(p => p.id === slug);

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
  const summary = makeSummary(body);
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
<link rel="canonical" href="${esc(url)}">
<meta name="google-site-verification" content="yLwtQOQErWNIXvJmKw1kyLiD2Ziu1ZuJN_QYxwgAYUA">
<meta name="naver-site-verification" content="f23fe941fa9c2d49aa4082228a56eeedf35ce1ce">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet">
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-LEJJMRTQBC"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-LEJJMRTQBC');
</script>
<style>
:root{--sky:#4DBDE8;--skyd:#2899c4;--skyb:#e8f7fd;--org:#FF6B35;--t:#1a1a1a;--m:#6b7280;}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:"Noto Sans KR",sans-serif;background:#f8fbff;color:var(--t);font-size:16px;}

/* NAV - blog.html 과 동일 */
.nav{position:sticky;top:0;z-index:100;background:#fff;border-bottom:1px solid #f0f0f0;box-shadow:0 2px 16px rgba(0,0,0,.06);}
.nav-in{max-width:1200px;margin:0 auto;display:flex;align-items:center;padding:0 32px;gap:4px;}
.logo{font-size:24px;font-weight:900;color:var(--sky);letter-spacing:-1px;padding:15px 0;margin-right:20px;text-decoration:none;display:flex;flex-direction:column;align-items:flex-end;line-height:1;white-space:nowrap;}
.logo span{font-size:9px;font-weight:500;color:#9ca3af;letter-spacing:0.5px;margin-top:1px;}
.nt{padding:17px 17px;font-size:16px;font-weight:600;color:var(--m);text-decoration:none;border-bottom:3px solid transparent;white-space:nowrap;transition:color .2s;display:inline-block;}
.nt:hover{color:var(--sky);}
.nt.on{color:var(--sky);border-bottom-color:var(--sky);}

/* 본문 - 목록 페이지와 동일한 폭 */
.wrap{width:100%;max-width:780px;margin:0 auto;padding:32px 24px 80px;}
.back{display:inline-block;margin-bottom:20px;color:var(--sky);font-weight:700;font-size:14px;text-decoration:none;}
.post-head{margin-bottom:26px;padding-bottom:20px;border-bottom:1.5px solid #e5e9f5;}
.post-head h1{font-size:27px;font-weight:900;letter-spacing:-.5px;line-height:1.4;margin-bottom:10px;}
.post-date{font-size:13px;color:var(--m);}
.post-body{line-height:1.8;}
.post-body img{max-width:100%;height:auto;}
.post-body h2{font-size:21px;font-weight:800;margin:34px 0 12px;letter-spacing:-.3px;}
.post-body h3{font-size:18px;font-weight:700;margin:26px 0 10px;}
.post-body p{margin-bottom:16px;}
.post-body ul,.post-body ol{margin:0 0 16px 20px;}
.post-body table{width:100%;border-collapse:collapse;margin:18px 0;font-size:15px;}
.post-body th,.post-body td{border:1px solid #e5e9f5;padding:10px 12px;text-align:left;}
.post-body th{background:#f0f8fd;font-weight:700;}

.cta{margin-top:44px;padding:26px;background:#fff;border-radius:16px;border:1.5px solid #f0f0f0;text-align:center;}
.cta a{display:inline-block;margin-top:12px;background:var(--org);color:#fff;font-weight:800;padding:13px 28px;border-radius:9px;text-decoration:none;}

footer{background:#1a3a4a;color:#8bb8c8;text-align:center;padding:30px 20px;font-size:14px;line-height:2.3;}
footer strong{color:#fff;}

@media(max-width:768px){
  .nav-in{padding:0 12px;gap:0;flex-wrap:wrap;}
  .logo{font-size:18px;padding:12px 0;margin-right:8px;}
  .nt{padding:12px 8px;font-size:13px;}
  .post-head h1{font-size:22px;}
}

/* 아래는 글마다 들어있는 스타일 (본문 안으로 한정됨) */
${styles}
</style>
</head>
<body>
<nav class="nav">
  <div class="nav-in">
    <a href="/" class="logo">가토통신<span>\u00d7앤텔레콤</span></a>
    <a href="/" class="nt">홈</a>
    <a href="/#self" class="nt">셀프개통</a>
    <a href="/#usim" class="nt">유심구매</a>
    <a href="/faq" class="nt">FAQ</a>
    <a href="/blog" class="nt on">블로그</a>
    <a href="/#startup" class="nt">창업문의</a>
  </div>
</nav>

<main class="wrap">
  <a href="/blog" class="back">← 목록으로</a>
  <article>
    <header class="post-head">
      <h1>${esc(post.title)}</h1>
      <div class="post-date">${esc(dateText)}</div>
    </header>
    <div class="post-body">
${body}
    </div>
  </article>

  <div class="cta">
    <strong style="font-size:17px">선불폰·알뜰폰 개통이 필요하세요?</strong>
    <p style="font-size:14px;color:#6b7280;margin-top:6px">신규 개통 매일 08:00~21:50</p>
    <a href="http://pf.kakao.com/_espRn/chat">카카오톡 채널 가토</a>
  </div>
</main>

<footer>
  <strong>GATO MOBILE</strong><br>
  상호명: 가토통신 | 대표자: 하주연 | 사업자번호: 702-73-00624<br>
  주소: 경기도 부천시 원미구 원미로 57번길46-1<br>
  연락처: 010-4316-4477 | Email: greeny89@naver.com<br>
  <span style="font-size:12px;opacity:.6">\u00a9 2025 가토통신. All rights reserved.</span>
</footer>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  return res.status(200).send(html);
};
