from common import *
R=ROOT
# ---------------- 셀프개통
css='''<style>
.top2{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px}
.hours{background:var(--pri);color:#fff;border-radius:22px;padding:30px 34px;display:flex;flex-wrap:wrap;align-items:center;gap:24px}
.hours h2{margin:0;font-size:22px;font-weight:900}
.hours .b{flex:1 1 200px;background:rgba(255,255,255,.14);border-radius:14px;padding:18px 22px;display:flex;flex-direction:column;gap:6px}
.hours .b span{font-size:14px;color:#E6F4FC}
.hours .b strong{font-size:26px;font-weight:900}
.chk{overflow:hidden}
.ck{display:flex;flex-wrap:wrap;align-items:center;gap:18px 20px;padding:26px 30px;border-top:1px solid #EEF4F9}
.ck:first-child{border-top:none}
.ck .no{flex:0 0 auto;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#fff}
.ck .bd{flex:1 1 340px;display:flex;flex-direction:column;gap:6px}
.ck h3{margin:0;font-size:19px;font-weight:900;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.ck p{margin:0;font-size:15px;line-height:1.6;color:#4B5563}
.tg{font-size:12px;font-weight:700;padding:3px 9px;border-radius:999px}
.cert{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.cert span{font-size:13px;font-weight:700;color:var(--deep);background:#F1F3F7;border:1px solid #E1E5EC;padding:5px 12px;border-radius:999px}
.ck .go{font-size:14px;font-weight:700;color:var(--pri);background:var(--tint2);padding:11px 16px;border-radius:10px;white-space:nowrap}
</style>
'''
def ck(no,color,tag,tagstyle,title,desc,link,href,extra=''):
    t=' target="_blank" rel="noopener"' if href.startswith('http') else ''
    return f'<div class="ck"><span class="no" style="background:{color}">{no}</span><div class="bd"><h3>{title}<span class="tg" style="{tagstyle}">{tag}</span></h3><p>{desc}</p>{extra}</div><a class="go" href="{href}"{t}>{link}</a></div>'
NEED='color:#256CAE;background:#EEF8FE'; WARN='color:#B42318;background:#FDECEA'; INFO='color:#4B5563;background:#F1F3F7'
body=f'''<main class="wrap narrow">
<section class="top2">
<div class="ptitle"><span class="eyebrow">개통 · 셀프개통</span><h1 class="h1">셀프개통 전에<br>이것만 확인해 주세요</h1><p class="lead">본인 명의 모바일 인증서만 있으면 집에서 바로 개통할 수 있어요.</p></div>
<div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn lg" href="{KT_OPEN}" target="_blank" rel="noopener">KT 개통하기</a><a class="btn lg pink" href="{LG_OPEN}" target="_blank" rel="noopener">LG 개통하기</a></div>
</section>
<section class="hours" aria-label="개통 가능 시간">
<h2>개통 가능 시간</h2>
<div style="display:flex;flex-wrap:wrap;gap:16px;flex:1 1 420px">
<div class="b"><span>신규 가입</span><strong>매일 08:00 ~ 21:50</strong></div>
<div class="b"><span>번호이동</span><strong>월~토 10:00 ~ 19:50</strong></div>
</div>
</section>
<section class="card chk" aria-label="신청 전 체크리스트">
{ck('01','#1E2630','안내',INFO,'유심 또는 eSIM','유심이 없어도 괜찮아요. 개통 신청하면서 유심도 같이 신청할 수 있고, eSIM 되는 폰이면 eSIM으로 바로 진행할 수 있어요.','eSIM 안내 보기','/esim')}
{ck('02','#256CAE','필수',NEED,'본인 명의 모바일 인증서','셀프개통은 비대면으로 진행돼서 모바일 인증서로 본인인증을 해야 해요. 아래 인증서 중 하나만 있으면 돼요.','방법 물어보기',KAKAO,'<div class="cert"><span>카카오</span><span>토스</span><span>PASS</span><span>신한</span><span>KB국민</span></div>')}
{ck('03','#B42318','막힘 주의',WARN,'명의도용 방지서비스(Msafer) 해제','Msafer에 가입돼 있으면 새 회선 개통이 막혀요. 신청 전에 잠깐 해제해 두세요.','Msafer 바로가기','https://msafer.or.kr/index.do')}
{ck('04','#B42318','비대면 불가',WARN,'만 19세 미만은 방문개통으로','미성년자는 비대면 개통이 안 돼요. 법정대리인 신분증과 가족관계증명서를 챙겨서 방문해 주세요.','방문 예약하기',KAKAO)}
</section>
<section class="band"><p><strong>막히는 부분이 있나요?</strong> 카카오톡 채널 '가토'로 보내주시면 바로 봐드려요.</p><a class="btn dark" style="border-radius:999px" href="{KAKAO}" target="_blank" rel="noopener">카톡으로 물어보기</a></section>
</main>
'''
open(R+'open-self.html','w',encoding='utf-8').write(page('셀프개통 안내 - 가토통신','KT·LG U+ 알뜰폰 셀프개통 전 확인할 것: 개통 가능 시간, 모바일 인증서, 명의도용 방지서비스 해제, 미성년자 개통 안내.','/open/self','개통',body,'',css))

# ---------------- 유심
css='''<style>
.ui{display:flex;flex-wrap:wrap;align-items:center;gap:24px 40px;padding:28px 32px}
.ui .im{flex:0 0 200px;height:220px;border-radius:16px;display:flex;align-items:center;justify-content:center;padding:12px}
.ui .im img{max-height:100%;object-fit:contain}
.ui .in{flex:1 1 280px;min-width:0;display:flex;flex-direction:column;gap:10px}
.ui h2{margin:0;font-size:24px;font-weight:900}
.ui p{margin:0;font-size:15px;line-height:1.6;color:#4B5563}
.ui .pr{flex:0 1 300px;display:flex;flex-direction:column;gap:14px;padding-left:32px;border-left:1px solid #EEF4F9}
.ui .pr strong{font-size:30px;font-weight:900;color:var(--deep)}
.st{display:flex;gap:6px;flex-wrap:wrap}
.st span{font-size:14px;font-weight:700;background:var(--bg);border:1px solid #E1E5EC;padding:7px 14px;border-radius:999px}
.net{font-size:12px;font-weight:900;color:#fff;padding:4px 10px;border-radius:6px}
.lk{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}
.lk a{display:flex;align-items:center;gap:16px;border-radius:18px;padding:24px 26px}
.lk .ic{width:48px;height:48px;flex:0 0 auto;border-radius:14px;display:flex;align-items:center;justify-content:center}
.lk .t{display:flex;flex-direction:column;gap:3px}
.lk strong{font-size:18px;font-weight:900}
.lk .t span{font-size:13px}
@media (max-width:700px){.ui{padding:22px}.ui .pr{padding-left:0;border-left:none}.ui .im{flex-basis:100%}}
</style>
'''
def usim(net,netbg,name,price,img,alt,imbg,nfc,desc,stores,code=''):
    c=f'<span style="align-self:flex-start;font-size:14px;color:var(--deep);background:#FFF4D6;padding:6px 12px;border-radius:8px">매장에서 <strong>품번 {code}</strong>으로 찾으면 빨라요</span>' if code else ''
    n='<span class="chip" style="background:#F1F3F7;color:#374151;border-radius:6px">NFC</span>' if nfc else ''
    return f'''<article class="card ui"><div class="im" style="background:{imbg}"><img src="/img/{img}" alt="{alt}" loading="lazy"></div>
<div class="in"><div style="display:flex;gap:6px"><span class="net" style="background:{netbg}">{net}</span>{n}</div><h2>{name}</h2><p>{desc}</p>{c}</div>
<div class="pr"><div style="display:flex;flex-direction:column;gap:2px"><span style="font-size:13px;color:var(--m2)">판매가</span><strong>{price}<small style="font-size:18px">원</small></strong></div>
<div style="display:flex;flex-direction:column;gap:8px"><span style="font-size:13px;color:var(--m2)">오프라인 구입처</span><div class="st">{''.join(f'<span>{s}</span>' for s in stores)}</div></div></div></article>'''
body=f'''<main class="wrap" style="max-width:1100px">
<section class="ptitle"><span class="eyebrow">유심</span><h1 class="h1">가까운 편의점에서 유심 사기</h1><p class="lead">통신망에 맞는 유심을 사서 셀프개통하면 바로 쓸 수 있어요.</p></section>
<section style="display:flex;flex-direction:column;gap:16px" aria-label="유심 상품">
{usim('KT','#256CAE','바로유심 (NFC)','8,800','usim-kt.webp','KT 바로유심 패키지','#E6F5F3',True,'KT 알뜰폰 요금제를 개통할 수 있는 유심이에요. KT망 요금제를 고르셨다면 이 유심을 사시면 돼요.',['이마트24','CU','GS25','세븐일레븐'])}
{usim('LG U+','#E0286F','모두의 유심 원칩 (NFC)','8,800','usim-lg.webp','LG U+ 원칩 유심 패키지','#FDEAF2',True,'U+ 알뜰폰 요금제를 개통할 수 있는 공용 유심이에요. LG망 요금제를 고르셨다면 이 유심을 사시면 돼요.',['이마트24','배민B마트'])}
{usim('LG U+','#E0286F','다이소 유심','5,000','usim-daiso.webp','다이소 유심 패키지','#FDECEC',False,'다이소에서 살 수 있는 LG U+망 유심이에요. 가격이 저렴해서 LG망 개통할 때 많이 찾으세요.',['다이소'],'1019600')}
</section>
<section class="lk" aria-label="유심 관련 바로가기">
<a href="https://www.n-telecom.co.kr/gatomobile/view/buyusim/buyusim_step1.aspx" target="_blank" rel="noopener" style="background:#256CAE;color:#fff"><span class="ic" style="background:rgba(255,255,255,.18)"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6h15l-1.5 9h-12z"></path><path d="M6 6L5 3H2"></path><circle cx="9" cy="20" r="1.5"></circle><circle cx="18" cy="20" r="1.5"></circle></svg></span><span class="t"><strong>온라인 유심 구매하기</strong><span style="opacity:.9">빠르면 2시간 안에 받아요</span></span></a>
<a href="/esim" style="background:var(--pri);color:#fff"><span class="ic" style="background:rgba(255,255,255,.12)"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2"></rect><path d="M10 7h4v4h-4z"></path><path d="M11 18h2"></path></svg></span><span class="t"><strong>eSIM 사용 설명서</strong><span style="opacity:.85">유심 없이 폰에서 바로 개통</span></span></a>
<a href="https://www.n-telecom.co.kr/gatomobile/view/service/noticeboard_detail.aspx" target="_blank" rel="noopener" style="background:#fff;color:var(--deep);border:1.5px solid var(--deep)"><span class="ic" style="background:var(--tint2)"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3h10l4 4v14H5z"></path><path d="M9 12h6M9 16h6M9 8h3"></path></svg></span><span class="t"><strong>개통유심 사용 안내</strong><span style="color:#4B5563">개통 먼저, 유심은 나중에 받아요</span></span></a>
</section>
</main>
'''
open(R+'usim.html','w',encoding='utf-8').write(page('유심 구매 - 가토통신','KT 바로유심, LG U+ 원칩, 다이소 유심 가격과 구입처. 편의점에서 사서 셀프개통하세요.','/usim','유심',body,'',css))
print('pages1 ok')
