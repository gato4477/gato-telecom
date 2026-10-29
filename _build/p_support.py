from common import *
import json
R=ROOT
# ---------------- contact
CSS='''<style>
.cn{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}
.cn a{display:flex;align-items:center;gap:14px;border-radius:18px;padding:22px 24px}
.cn strong{font-size:18px;font-weight:900;display:block}
.cn span.s{font-size:14px}
.fm{padding:28px 30px;display:flex;flex-direction:column;gap:18px}
.fm label.f{display:flex;flex-direction:column;gap:8px}
.fm label.f span{font-size:15px;font-weight:700}
.fm input[type=text],.fm textarea{border:1px solid var(--line2);border-radius:12px;padding:14px 16px;font-size:15px;outline:none}
.fm input[type=text]{height:52px;padding:0 16px}
.fm input:focus,.fm textarea:focus{border-color:var(--pri)}
.agree{font-size:13px;line-height:1.8;color:var(--m);background:var(--bg);border-radius:12px;padding:12px 16px}
.err{font-size:14px;color:var(--warn);min-height:20px}
.done{padding:40px 30px;display:none;flex-direction:column;align-items:center;gap:12px;text-align:center}
.hp{position:absolute;left:-9999px}
</style>
'''
body=f'''<main class="wrap xnarrow">
<section class="ptitle"><span class="eyebrow">고객지원 · 1:1 문의</span><h1 class="h1">무엇이든 물어보세요</h1><p class="lead">문의를 남겨주시면 들어온 순서대로 확인해서 최대한 빨리 연락드릴게요. 급하시면 카톡이나 전화로 바로 이야기해 주세요.</p></section>
<section class="cn" aria-label="바로 연결">
<a href="{KAKAO}" target="_blank" rel="noopener" style="background:#FEE500;color:#191919"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7L5.7 21l3.9-2.6c.8.1 1.6.2 2.4.2 5.5 0 10-3.6 10-8s-4.5-8-10-8z"></path></svg><span><strong>카카오톡 채널 연결</strong><span class="s">채널 '가토'로 바로 대화</span></span></a>
<a href="tel:01043164477" style="background:var(--pri);color:#fff"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"></path></svg><span><strong>전화하기</strong><span class="s" style="opacity:.9">010-4316-4477 · 365일 상담</span></span></a>
</section>
<form class="card fm" id="fm" novalidate>
<h2 style="margin:0;font-size:20px;font-weight:900" id="ftitle">문의 남기기</h2>
<label class="f"><span>연락받을 전화번호 또는 이메일</span><input type="text" id="contact" autocomplete="tel" placeholder="전화번호 또는 이메일 주소" maxlength="80"></label>
<label class="f"><span>문의 내용</span><textarea id="msg" rows="6" placeholder="궁금한 내용을 편하게 적어주세요" maxlength="2000"></textarea></label>
<input type="text" id="hp" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
<label style="display:flex;align-items:center;gap:10px;font-size:14px;font-weight:700"><input type="checkbox" id="agree" style="width:18px;height:18px">[필수] 문의 답변을 위한 개인정보 수집·이용에 동의합니다.</label>
<div class="agree">수집 항목: 전화번호 또는 이메일<br>이용 목적: 문의 답변 및 안내 연락<br>보유 기간: 답변 완료 후 30일 이내 파기<br>동의하지 않으면 문의 접수가 어려워요.</div>
<div class="err" id="err" role="alert"></div>
<button type="submit" class="btn lg" id="send">문의 남기기</button>
</form>
<section class="card done" id="done"><span style="width:56px;height:56px;border-radius:999px;background:var(--tint);display:flex;align-items:center;justify-content:center"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#256CAE" stroke-width="3" aria-hidden="true"><path d="M5 12l5 5 9-10"></path></svg></span><h2 style="margin:0;font-size:22px;font-weight:900">문의가 접수됐어요</h2><p class="lead">들어온 순서대로 확인하고 있어요. 남겨주신 연락처로 최대한 빨리 연락드릴게요.</p></section>
</main>
'''
js='''<script>
(function(){
  var $=function(i){return document.getElementById(i);},topic=new URLSearchParams(location.search).get('topic');
  if(topic==='partner'){$('ftitle').textContent='제휴 문의 남기기';$('msg').placeholder='지역, 운영 중인 매장 여부, 궁금한 점을 적어주세요';}
  $('fm').addEventListener('submit',function(e){
    e.preventDefault();
    var c=$('contact').value.trim(),m=$('msg').value.trim();
    if(!c)return $('err').textContent='연락받을 전화번호나 이메일을 적어주세요.';
    if(!m)return $('err').textContent='문의 내용을 적어주세요.';
    if(!$('agree').checked)return $('err').textContent='개인정보 수집·이용에 동의해 주세요.';
    $('err').textContent='';$('send').disabled=true;$('send').textContent='보내는 중…';
    fetch('/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contact:c,message:m,topic:topic==='partner'?'제휴문의':'1:1 문의',hp:$('hp').value,page:location.pathname})})
    .then(function(r){return r.json().then(function(j){if(!r.ok||!j.ok)throw new Error(j.error||'fail');});})
    .then(function(){$('fm').style.display='none';$('done').style.display='flex';if(window.gtag)gtag('event','inquiry_submit',{topic:topic||'general'});})
    .catch(function(e){var code=(e&&e.message)||'network';$('err').textContent='전송에 실패했어요. 카카오톡이나 전화로 연락 주세요. (오류: '+code+')';$('send').disabled=false;$('send').textContent='문의 남기기';});
  });
})();
</script>
'''
open(R+'contact.html','w',encoding='utf-8').write(page('1:1 문의 - 가토통신','알뜰폰·선불폰 개통, 요금제, 제휴 문의를 남겨주세요. 카카오톡 채널과 전화로도 바로 연결돼요.','/support/contact','고객지원',body,js,CSS))

# ---------------- center
o=json.load(open(HERE+'data/center-map.json',encoding='utf-8'))
W,Hh=o['W'],o['H']
CSS='''<style>
.cw{display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start}
.map{flex:1 1 380px;min-width:0;padding:18px}
.mapin{position:relative;width:100%;max-width:460px;margin:0 auto;aspect-ratio:'''+f'{W} / {Hh}'+'''}
.mapin svg{position:absolute;inset:0;width:100%;height:100%}
.dot{position:absolute;width:10px;height:10px;margin:-5px 0 0 -5px;padding:0;border-radius:999px;border:2px solid #fff;box-shadow:0 1px 3px rgba(30,38,48,.35);background:var(--pri);z-index:2}
.dot.off{background:#8CB8D6;opacity:.45;z-index:1}
.dot.sel{width:18px;height:18px;margin:-9px 0 0 -9px;background:#E8590C;z-index:3}
.tip{position:absolute;z-index:4;transform:translate(-50%,calc(-100% - 14px));background:var(--pri);color:#fff;padding:8px 12px;border-radius:10px;white-space:nowrap;box-shadow:0 4px 12px rgba(30,38,48,.3);font-size:12px;pointer-events:none}
.tip b{display:block;font-size:13px}
.lst{flex:999 1 460px;min-width:0;display:flex;flex-direction:column;gap:14px}
.box{max-height:540px;overflow-y:auto}
.it{width:100%;display:flex;align-items:center;gap:14px;padding:16px 20px;border:none;border-top:1px solid #EEF4F9;background:#fff;text-align:left}
.it:first-child{border-top:none}
.it.on{background:var(--tint2)}
.it i{flex:0 0 auto;width:10px;height:10px;border-radius:999px;background:var(--pri)}
.it.on i{background:#E8590C}
.it strong{font-size:15px;color:var(--t)}
.it span.a{font-size:14px;color:var(--m)}
</style>
'''
body=f'''<main class="wrap">
<section class="ptitle"><span class="eyebrow">고객지원 · 센터 안내</span><h1 class="h1">전국 앤텔레콤 센터 <span id="tot">{len(o["rows"])}</span>곳</h1><p class="lead">방문 개통이 필요할 때 가까운 센터를 찾아보세요. 지역을 누르면 지도에 표시돼요.</p></section>
<div class="cw">
<section class="card map" aria-label="센터 지도"><div class="mapin" id="map"><svg viewBox="0 0 {W} {Hh}" aria-hidden="true"><path d="{o["d"]}" fill="#D7ECF9" stroke="#A9D9F5" stroke-width="1.2" stroke-linejoin="round"></path></svg></div></section>
<section class="lst" aria-label="센터 목록"><div class="pills" id="tabs"></div><div class="card box" id="list"></div></section>
</div>
<section class="band"><p><strong>모든 센터는 예약제로 운영돼요.</strong> 방문 전에 담당자에게 연락 주시면 센터 주소와 예약 시간을 안내해 드려요.</p><span style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn kakao" style="border-radius:999px" href="{KAKAO}" target="_blank" rel="noopener">카카오톡 채널</a><a class="btn" style="border-radius:999px" href="tel:01043164477">전화하기</a></span></section>
</main>
'''
js='''<script>
(function(){
  var C='''+json.dumps(o['rows'],ensure_ascii=False)+''';
  var G=[['전체',null],['서울',['서울']],['경기',['경기']],['인천',['인천']],['강원',['강원']],['대전·충청',['대전','충남','충북']],['광주·전라',['광주','전남','전북']],['대구·경북',['대구','경북']],['부산·울산·경남',['부산','울산','경남']],['제주',['제주']]];
  var g='전체',sel=-1,map=document.getElementById('map'),list=document.getElementById('list'),tabs=document.getElementById('tabs');
  var inG=function(c,n){var m=G.filter(function(x){return x[0]===n;})[0][1];return !m||m.indexOf(c.r)>-1;};
  C.forEach(function(c,i){c.i=i;c.area=c.r+' '+c.a;var b=document.createElement('button');b.type='button';b.className='dot';b.style.left=c.x+'%';b.style.top=c.y+'%';b.setAttribute('aria-label',c.n+', '+c.area);b.onclick=function(){sel=sel===i?-1:i;if(!inG(c,g))g='전체';draw();};map.appendChild(b);c.el=b;});
  var tip=document.createElement('div');tip.className='tip';tip.style.display='none';map.appendChild(tip);
  function draw(){
    tabs.innerHTML=G.map(function(x){return '<button type="button" class="pill'+(x[0]===g?' on':'')+'" data-g="'+x[0]+'">'+x[0]+' '+C.filter(function(c){return inG(c,x[0]);}).length+'</button>';}).join('');
    C.forEach(function(c){c.el.className='dot'+(c.i===sel?' sel':inG(c,g)?'':' off');});
    list.innerHTML=C.filter(function(c){return inG(c,g);}).map(function(c){return '<button type="button" class="it'+(c.i===sel?' on':'')+'" data-i="'+c.i+'"><i></i><span style="display:flex;flex-direction:column;gap:2px"><span style="display:flex;align-items:center;gap:6px;flex-wrap:wrap"><strong>'+c.n+'</strong>'+(c.p?'<span class="chip" style="font-size:11px;padding:2px 7px">제휴판매점</span>':'')+'</span><span class="a">'+c.area+'</span></span></button>';}).join('');
    var s=C[sel];if(s){tip.style.display='';tip.style.left=Math.min(Math.max(s.x,18),82)+'%';tip.style.top=s.y+'%';tip.innerHTML='<b>'+s.n+'</b>'+s.area;}else tip.style.display='none';
  }
  tabs.onclick=function(e){var b=e.target.closest('button');if(!b)return;g=b.dataset.g;sel=-1;draw();};
  list.onclick=function(e){var b=e.target.closest('button');if(!b)return;var i=+b.dataset.i;sel=sel===i?-1:i;draw();};
  draw();
})();
</script>
'''
open(R+'center.html','w',encoding='utf-8').write(page('센터 안내 - 가토통신','전국 앤텔레콤 센터 위치 안내. 서울·경기·부산·대구 등 지역별 센터를 지도에서 확인하세요.','/support/center','고객지원',body,js,CSS))
print('support ok')
