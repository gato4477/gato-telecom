from common import *
R=ROOT
CSS='''<style>
.ptab{display:flex;border-bottom:2px solid #E5E8EF;flex-wrap:wrap}
.ptab a{margin-bottom:-2px;padding:14px 22px;font-size:17px;font-weight:700;color:var(--m2);border-bottom:3px solid transparent}
.ptab a.on{color:var(--pri);border-bottom-color:var(--pri)}
.prebar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;background:var(--pri);color:#fff;border-radius:16px;padding:18px 24px}
.prebar span{font-size:15px}
.ben{display:flex;flex-wrap:wrap;align-items:center;gap:6px 16px;padding:16px 22px;border-radius:16px;color:#fff}
.tools{display:flex;align-items:center;justify-content:space-between;gap:12px;position:relative;z-index:5}
.sortb{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:700;color:var(--t);background:#fff;border:1px solid #DDE2EA;border-radius:12px;padding:10px 16px}
.sortm{position:absolute;right:0;top:50px;width:220px;background:#fff;border-radius:16px;box-shadow:0 12px 32px rgba(30,38,48,.16);padding:8px;display:none;flex-direction:column}
.sortm.open{display:flex}
.sortm button{display:flex;align-items:center;gap:8px;text-align:left;background:none;border:none;border-radius:10px;padding:12px 14px;font-size:15px;color:var(--t)}
.sortm button.on{color:var(--pri);font-weight:700}
.sortm button:hover{background:var(--tint2)}
.pr{background:#fff;border:1px solid #E5E8EF;border-radius:18px;padding:22px 28px;display:flex;flex-wrap:wrap;align-items:center;gap:18px 32px}
.pr .a{flex:1 1 260px;min-width:0;display:flex;flex-direction:column;gap:8px}
.pr .a .bg{display:flex;gap:6px;flex-wrap:wrap}
.pr h3{margin:0;font-size:18px;font-weight:900}
.pr .ds{flex:0 0 150px;display:flex;flex-direction:column;gap:2px}
.pr .ds strong{font-size:22px;font-weight:900;color:var(--deep)}
.pr .ds span{font-size:13px;color:var(--m2)}
.pr .sp{flex:1 1 240px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;background:#F7F9FC;border-radius:12px;padding:12px 16px}
.pr .sp div{display:flex;flex-direction:column;gap:2px}
.pr .sp span{font-size:12px;color:var(--m2)}
.pr .sp strong{font-size:14px}
.pr .pz{flex:0 0 140px;text-align:right}
.badge{font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px;color:#fff}
@media (max-width:700px){.pr{padding:20px}.pr .pz{text-align:left;flex-basis:auto}.ptab a{padding:12px 14px;font-size:15px}}
</style>
'''
def build(tab,title,desc,h1,sub):
    tabs=''.join(f'<a href="/plans/{k}"{" style=color:#E0286F;border-bottom-color:#E0286F" if (k==tab and k=="lg") else ""} class="{"on" if k==tab else ""}"{" aria-current=page" if k==tab else ""}>{n}</a>' for k,n in [('kt','KT 알뜰폰'),('lg','LG 알뜰폰'),('prepaid','선불요금제')])
    pre=f'<div class="prebar"><span><strong>약정·위약금 없이</strong> 충전해서 쓰는 선불폰이에요. 개통은 가토선불폰에서 진행돼요.</span><a class="btn sm" style="background:#fff;color:var(--deep);border-radius:999px" href="{PREPAID}" target="_blank" rel="noopener">가토선불폰 바로가기</a></div>' if tab=='prepaid' else ''
    body=f'''<main class="wrap">
<section style="display:flex;flex-direction:column;gap:22px"><div class="ptitle"><span class="eyebrow">요금제</span><h1 class="h1">{h1}</h1><p class="lead">{sub}</p></div><nav class="ptab" aria-label="요금제 종류">{tabs}</nav></section>
{pre}
<div class="pills" id="filters"></div>
<div id="benefit"></div>
<div class="tools"><span style="font-size:14px;color:var(--m2)">요금제 <strong id="cnt" style="color:var(--t)"></strong>개</span>
<div style="position:relative"><button type="button" class="sortb" id="sortb" aria-haspopup="listbox" aria-expanded="false"><span id="sortl">추천 순</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg></button><div class="sortm" id="sortm" role="listbox" aria-label="정렬"></div></div></div>
<div id="rows" style="display:flex;flex-direction:column;gap:12px"></div>
</main>
'''
    js='''<script src="/assets/plans.js?v=1"></script>
<script>
(function(){
  var TAB='%s', P=GATO_PLANS, E=function(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');};
  var st={partner:'all',pnet:'kt',sort:'rec'};
  var REC=['11GB+일2GB','15GB','100GB','10GB','7GB','300분+15GB','100분+15GB'], REC_LG=[1,4,0,2,3], REC_PRE=[3,4,6,0,1,5,2];
  var num=function(p){return Number(p.replace(/,/g,''));};
  var SORTS=[['rec','추천 순',function(a,b){return a.rank-b.rank;}],['low','낮은 가격 순',function(a,b){return num(a.price)-num(b.price);}],['high','높은 가격 순',function(a,b){return num(b.price)-num(a.price);}],['data','데이터 많은 순',function(a,b){return b.gb-a.gb||num(a.price)-num(b.price);}],['promo','프로모션 먼저',function(a,b){return (b.promo?1:0)-(a.promo?1:0)||num(a.price)-num(b.price);}]];
  var ALL={id:'all',label:'전체',color:'#1E2630'};
  function rows(){
    if(TAB==='prepaid') return P.PRE[st.pnet].map(function(x,i){return Object.assign({},x,{rank:REC_PRE.indexOf(i),net:st.pnet==='kt'?'KT 선불':'LG U+ 선불',url:P.PREPAID});});
    if(TAB==='lg') return P.LG.map(function(x,i){return Object.assign({},x,{rank:REC_LG.indexOf(i),net:'LG U+망',url:P.LG_OPEN});});
    var cur=st.partner==='all'?P.PARTNERS:P.PARTNERS.filter(function(p){return p.id===st.partner;});
    var out=[];cur.forEach(function(pt,pi){pt.list.forEach(function(r){var s=P.SPEC[r[0]];out.push(Object.assign({},s,{name:'K망 '+r[0],price:r[1],net:'KT망',partner:pt.label,pcolor:pt.color,benefit:pt.benefit,url:P.KT_OPEN,rank:REC.indexOf(r[0])*4+((pi*5+REC.indexOf(r[0])*3)%%6)*3+pi*0.1}));});});
    return out;
  }
  function draw(){
    var f=document.getElementById('filters'), b=document.getElementById('benefit');
    if(TAB==='kt'){f.innerHTML=[ALL].concat(P.PARTNERS).map(function(p){var on=p.id===st.partner;return '<button type="button" class="pill" aria-pressed="'+on+'" data-p="'+p.id+'" style="'+(on?'background:'+p.color+';color:#fff;border-color:'+p.color:'')+'">'+E(p.label)+'</button>';}).join('');
      var cp=P.PARTNERS.filter(function(p){return p.id===st.partner;})[0];
      b.innerHTML=cp?'<div class="ben" style="background:'+cp.color+'"><span style="font-size:14px;font-weight:700;opacity:.9">'+E(cp.label)+' 제휴 혜택</span><strong style="font-size:20px;font-weight:900">'+E(cp.benefit)+'</strong></div>':'';}
    else if(TAB==='prepaid'){f.innerHTML=[['kt','KT 선불'],['lg','LG U+ 선불']].map(function(x){var on=x[0]===st.pnet;return '<button type="button" class="pill'+(on?' on':'')+'" aria-pressed="'+on+'" data-n="'+x[0]+'"'+(on&&x[0]==='lg'?' style="background:#E0286F;border-color:#E0286F"':'')+'>'+x[1]+'</button>';}).join('');b.innerHTML='';}
    else{f.innerHTML='';b.innerHTML='';}
    var sort=SORTS.filter(function(s){return s[0]===st.sort;})[0];
    var list=rows().sort(sort[2]);
    document.getElementById('cnt').textContent=list.length;
    document.getElementById('sortl').textContent=sort[1];
    document.getElementById('sortm').innerHTML=SORTS.map(function(s){var on=s[0]===st.sort;return '<button type="button" role="option" aria-selected="'+on+'" class="'+(on?'on':'')+'" data-s="'+s[0]+'">'+s[1]+(on?' <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M5 12l5 5 9-10"></path></svg>':'')+'</button>';}).join('');
    document.getElementById('rows').innerHTML=list.map(function(p){
      var q=p.qos==='-'?'속도제어 없음':'소진 후 '+p.qos;
      return '<article class="pr"><div class="a"><div class="bg"><span class="chip'+(/LG/.test(p.net)?' pink':'')+'">'+E(p.net)+'</span>'+(p.partner?'<span class="badge" style="background:'+p.pcolor+'">'+E(p.partner)+'</span>':'')+(p.best?'<span class="badge" style="background:#D97706;font-weight:900">BEST</span>':'')+(p.promo?'<span class="chip warn">+10GB 프로모션</span>':'')+'</div><h3>'+E(p.name)+'</h3>'+(p.benefit?'<span style="font-size:13px;color:#4B5563">'+E(p.benefit)+'</span>':'')+'</div>'+
      '<div class="ds"><strong>'+E(p.data)+'</strong><span>'+q+'</span></div>'+
      '<div class="sp"><div><span>통화</span><strong>'+E(p.call)+'</strong></div><div><span>부가·영상</span><strong>'+E(p.extra)+'</strong></div><div><span>문자</span><strong>'+E(p.sms)+'</strong></div></div>'+
      '<span class="price pz"'+(/LG/.test(p.net)?' style="color:var(--lg)"':'')+'>월 <strong>'+E(p.price)+'</strong>원</span>'+
      '<a class="btn sm '+(/LG/.test(p.net)?'pink':'')+'" href="'+p.url+'" target="_blank" rel="noopener">가입하기</a></article>';
    }).join('');
  }
  document.getElementById('filters').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.dataset.p)st.partner=b.dataset.p;if(b.dataset.n)st.pnet=b.dataset.n;draw();});
  var sb=document.getElementById('sortb'), sm=document.getElementById('sortm');
  sb.onclick=function(){var o=sm.classList.toggle('open');sb.setAttribute('aria-expanded',o);};
  sm.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;st.sort=b.dataset.s;sm.classList.remove('open');sb.setAttribute('aria-expanded','false');draw();});
  document.addEventListener('click',function(e){if(!e.target.closest('.tools'))sm.classList.remove('open');});
  draw();
})();
</script>
''' % tab
    open(R+f'plans-{tab}.html','w',encoding='utf-8').write(page(title,desc,f'/plans/{tab}','요금제',body,js,CSS))
build('kt','KT 알뜰폰 요금제 - 가토통신','KT망 알뜰폰 요금제 비교. 다이소·올리브영·밀리의 서재·CU·쿠팡·네이버페이 제휴 혜택 요금제를 한눈에.','KT 알뜰폰 요금제','요금제 하나로 통신비 아끼고 제휴 혜택까지 받아요')
build('lg','LG 알뜰폰 요금제 - 가토통신','LG U+망 알뜰폰 요금제 비교. 7GB부터 매일 5GB까지 요금과 제공량을 확인하세요.','LG 알뜰폰 요금제','LG U+망 그대로, 통신비만 가볍게')
build('prepaid','선불요금제 - 가토통신','KT·LG U+ 선불폰 요금제 가격표. 약정·위약금 없이 충전해서 쓰는 선불폰 요금제를 비교하세요.','선불요금제','충전해서 쓰는 선불폰 요금제예요')
print('plans ok')
