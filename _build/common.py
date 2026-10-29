import os
HERE=os.path.dirname(os.path.abspath(__file__))+'/'
ROOT=os.path.dirname(HERE.rstrip('/'))+'/'
import html as H
SITE='https://gatomobile.kr'
KAKAO='https://pf.kakao.com/_espRn/chat'
PREPAID='https://xn--h49a23sumlf7l.kr'
KT_OPEN='https://www.n-telecom.co.kr/gatomobile/view/open/kt/face_auth.aspx'
LG_OPEN='https://www.n-telecom.co.kr/gatomobile/view/open/lg/face_auth.aspx'
FB_CONFIG='''{apiKey:"AIzaSyDXed9i1ju0Nr8DXqGJZ4WMW8dcnIMP4i8",authDomain:"gato-mobile.firebaseapp.com",projectId:"gato-mobile",storageBucket:"gato-mobile.firebasestorage.app",messagingSenderId:"831742761635",appId:"1:831742761635:web:229a96a262b5b3bd9a3d16"}'''

MENU=[('개통','/open/self',[('셀프개통','/open/self'),('선불폰 개통',PREPAID)]),
      ('요금제','/plans/kt',[('KT 알뜰폰','/plans/kt'),('LG 알뜰폰','/plans/lg'),('선불요금제','/plans/prepaid')]),
      ('유심','/usim',[('유심구매','/usim'),('eSIM','/esim')]),
      ('블로그','/blog',[]),
      ('고객지원','/faq',[('자주 묻는 질문','/faq'),('1:1 문의','/support/contact'),('센터 안내','/support/center')])]

def ext(u): return ' target="_blank" rel="noopener"' if u.startswith('http') else ''

def head(title,desc,path,extra='',noindex=False):
    t=H.escape(title); d=H.escape(desc)
    rob='<meta name="robots" content="noindex,nofollow">\n' if noindex else ''
    return f'''<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{t}</title>
<meta name="description" content="{d}">
{rob}<link rel="canonical" href="{SITE}{path}">
<meta property="og:type" content="website">
<meta property="og:title" content="{t}">
<meta property="og:description" content="{d}">
<meta property="og:url" content="{SITE}{path}">
<meta name="google-site-verification" content="yLwtQOQErWNIXvJmKw1kyLiD2Ziu1ZuJN_QYxwgAYUA">
<meta name="naver-site-verification" content="f23fe941fa9c2d49aa4082228a56eeedf35ce1ce">
<link rel="icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v=1">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-LEJJMRTQBC"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-LEJJMRTQBC');</script>
{extra}</head>
<body>
'''

def header(active):
    items=[]; mitems=[]
    for name,href,subs in MENU:
        on=' on' if name==active else ''
        sub=''
        if subs:
            sub='<div class="gm-sub">'+''.join(f'<a href="{u}"{ext(u)}>{n}</a>' for n,u in subs)+'</div>'
        items.append(f'<div class="gm"><a href="{href}" class="gm-top{on}">{name}</a>{sub}</div>')
        mitems.append(f'<h3>{name}</h3>'+''.join(f'<a href="{u}"{ext(u)}>{n}</a>' for n,u in (subs or [(name,href)])))
    return f'''<header class="hd">
<div class="hd-in">
<a href="/" class="logo" aria-label="가토통신 홈"><b>가토통신</b><span>× 앤텔레콤</span></a>
<nav class="gnb" aria-label="주 메뉴">{''.join(items)}</nav>
<a href="{PREPAID}" target="_blank" rel="noopener" class="hd-pre">선불폰</a>
<button type="button" class="mbtn" aria-label="메뉴 열기" aria-expanded="false" aria-controls="mnav"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg></button>
</div>
<nav class="mnav" id="mnav" aria-label="모바일 메뉴">{''.join(mitems)}<h3>가토선불폰</h3><a href="{PREPAID}" target="_blank" rel="noopener">선불폰 사이트 바로가기</a></nav>
</header>
'''

FOOTER=f'''<footer class="ft">
<div class="ft-in">
<nav class="ft-links" aria-label="하단 링크">
<a href="https://www.n-telecom.co.kr/view/terms/terms.aspx?type=01" target="_blank" rel="noopener">이용약관</a>
<a class="b" href="https://www.n-telecom.co.kr/gatomobile/view/terms/terms.aspx?type=03" target="_blank" rel="noopener">개인정보처리방침</a>
<a href="https://msafer.or.kr/index.do" target="_blank" rel="noopener">명의도용방지서비스</a>
<a href="https://spam.kisa.or.kr/spam/main.do" target="_blank" rel="noopener">불법스팸대응센터</a>
<a href="{PREPAID}" target="_blank" rel="noopener">가토선불폰</a>
<a href="/support/contact?topic=partner">제휴문의</a>
</nav>
<div class="ft-cols">
<div class="ft-col"><span class="k">고객센터</span><strong>1899-7700 <small style="font-size:12px;font-weight:500;color:#6B7280">(유료)</small></strong><span>[모바일] 휴대폰 + 114 (무료)</span><span>평일 09:30~18:00 · 토/일/공휴일 휴무</span></div>
<div class="ft-col"><span class="k">가토통신</span><strong class="p">010-4316-4477</strong><span>365일 상담 가능</span></div>
<div class="ft-col" style="flex-grow:1.4"><span class="k">사업자 정보</span><span>상호명: 가토통신 | 대표자: 이철용</span><span>주소: 경기도 부천시 원미구 부천로 39번길 8 동아빌딩 6층</span><span>연락처: 010-4316-4477 | Email: 4477gato@gmail.com</span></div>
</div>
<span class="ft-copy">© 2026 가토통신. All rights reserved.</span>
</div>
</footer>
<script src="/assets/site.js?v=1" defer></script>
'''

def page(title,desc,path,active,body,scripts='',extra_head='',noindex=False,footer=True):
    return head(title,desc,path,extra_head,noindex)+header(active)+body+(FOOTER if footer else '')+scripts+'\n</body>\n</html>\n'
