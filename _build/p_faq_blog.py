from common import *
import json, html as H
R=ROOT
faqs=json.load(open(HERE+'data/faqs.json',encoding='utf-8'))
ld={"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":f['q'],"acceptedAnswer":{"@type":"Answer","text":f['a'].replace('[2919174]','2919174')}} for f in faqs]}
CSS='''<style>
.fl{padding:6px 24px}
.fl details{border-top:1px solid #EEF4F9}
.fl details:first-child{border-top:none}
.fl summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:18px 0;cursor:pointer}
.fl summary::-webkit-details-marker{display:none}
.fl summary strong{font-size:16px}
.fl summary svg{flex:0 0 auto;transition:transform .25s}
.fl details[open] summary svg{transform:rotate(180deg)}
.fl .ans{display:flex;gap:8px;margin:0 0 18px;padding:14px 16px;background:var(--bg);border-radius:12px;font-size:15px;line-height:1.8;color:#374151}
.fl .ans b.a{color:var(--pri)}
</style>
<script type="application/ld+json">'''+json.dumps(ld,ensure_ascii=False)+'''</script>
'''
cats=['전체','가입','셀프개통','요금','변경','정지','로밍','부가서비스','기타']
items=''
for f in faqs:
    a=H.escape(f['a']).replace('[2919174]','<strong style="color:#E8590C;font-size:16px">2919174</strong>')
    items+=f'<details data-c="{f["cat"]}"><summary><span style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><span class="chip">{f["cat"]}</span><strong>Q. {H.escape(f["q"])}</strong></span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#256CAE" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg></summary><div class="ans"><b class="a">A.</b><span>{a}</span></div></details>\n'
body=f'''<main class="wrap" style="max-width:900px;gap:22px">
<section class="ptitle"><span class="eyebrow">고객지원 · FAQ</span><h1 class="h1">자주 묻는 질문</h1><p class="lead">유심 구매부터 셀프개통, 번호이동, 요금제까지 자주 받는 질문을 모았어요.</p></section>
<label class="search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F6577" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path></svg><span class="sr">질문 검색</span><input type="search" id="q" placeholder="궁금한 내용을 검색해 보세요"></label>
<div class="pills" id="cats">{''.join(f'<button type="button" class="pill{" on" if c=="전체" else ""}" data-c="{c}">{c}</button>' for c in cats)}</div>
<span id="cnt" style="font-size:14px;color:var(--m)">총 {len(faqs)}개의 답변이 있어요</span>
<section class="card fl" id="list" aria-label="질문 목록">
{items}</section>
<div class="card" id="empty" style="display:none;padding:40px;text-align:center;color:var(--m)">찾는 질문이 없어요. 아래 1:1 문의로 남겨주세요.</div>
<section class="band"><p><strong>원하는 답이 없나요?</strong> 직접 물어보시면 바로 알려드려요.</p><a class="btn" style="border-radius:999px" href="/support/contact">1:1 문의하기</a></section>
</main>
'''
js='''<script>
(function(){
  var cat='전체',q=document.getElementById('q'),list=document.getElementById('list'),cnt=document.getElementById('cnt'),empty=document.getElementById('empty');
  var all=[].slice.call(list.querySelectorAll('details'));
  function f(){var k=q.value.trim().toLowerCase(),n=0;all.forEach(function(d){var ok=(cat==='전체'||d.dataset.c===cat)&&(!k||d.textContent.toLowerCase().indexOf(k)>-1);d.style.display=ok?'':'none';if(ok)n++;});
    cnt.textContent=n?'총 '+n+'개의 답변이 있어요':'';list.style.display=n?'':'none';empty.style.display=n?'none':'';}
  q.oninput=f;
  document.getElementById('cats').onclick=function(e){var b=e.target.closest('button');if(!b)return;cat=b.dataset.c;[].forEach.call(this.children,function(x){x.classList.toggle('on',x===b);});f();};
})();
</script>
'''
open(R+'faq.html','w',encoding='utf-8').write(page('자주 묻는 질문 - 가토통신 FAQ','알뜰폰·선불폰 개통에 관한 자주 묻는 질문 모음. 유심 구매부터 셀프개통, 번호이동, 요금제 선택까지 가토통신이 답해드려요.','/faq','고객지원',body,js,CSS))

# ---------------- blog list
CSS='''<style>
.bg3{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px}
.bk{display:flex;flex-direction:column;background:#fff;border:1px solid var(--line);border-radius:18px;overflow:hidden;color:var(--t);transition:transform .15s,box-shadow .15s}
.bk:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(30,38,48,.1);color:var(--t)}
.bk .th{aspect-ratio:16/9;background:linear-gradient(135deg,#D7ECF9,#C9E8FA);display:flex;align-items:center;justify-content:center;color:var(--pri);font-weight:900;font-size:18px;overflow:hidden}
.bk .th img{width:100%;height:100%;object-fit:cover}
.bk .bd{display:flex;flex-direction:column;gap:8px;padding:18px 20px 22px}
.bk strong{font-size:17px;line-height:1.5}
.bk p{margin:0;font-size:14px;line-height:1.6;color:var(--m);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
</style>
'''
body='''<main class="wrap">
<section class="ptitle"><span class="eyebrow">GATO BLOG</span><h1 class="h1">가토통신 블로그</h1><p class="lead">알뜰폰, 선불폰에 관한 유용한 정보를 전해드려요</p></section>
<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between"><div class="pills" id="cats"></div><label class="search" style="flex:0 1 380px;width:100%"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F6577" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path></svg><span class="sr">블로그 검색</span><input type="search" id="q" placeholder="글 제목으로 검색해 보세요"></label></div>
<div class="bg3" id="grid"><p class="note">글을 불러오는 중이에요…</p></div>
</main>
'''
js='''<script src="/assets/fs.js?v=1"></script>
<script>
(function(){
  var E=gatoEsc,grid=document.getElementById('grid'),q=document.getElementById('q'),catsEl=document.getElementById('cats'),posts=[],cat='전체';
  function strip(h){return String(h||'').replace(/<style[\\s\\S]*?<\\/style>/gi,'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/\\s+/g,' ').trim();}
  function draw(){
    var k=q.value.trim().toLowerCase();
    var list=posts.filter(function(p){return (cat==='전체'||p.category===cat)&&(!k||(p.title||'').toLowerCase().indexOf(k)>-1);});
    grid.innerHTML=list.length?list.map(function(p){
      var ex=p.description||'';
      return '<a class="bk" href="/blog/'+encodeURIComponent(gatoSlug(p.title))+'"><div class="th">'+(p.thumbnail?'<img src="'+E(p.thumbnail)+'" alt="" loading="lazy">':E(p.category||'가토 블로그'))+'</div><div class="bd"><span style="display:flex;gap:8px;align-items:center;font-size:13px;color:var(--m)">'+(p.category?'<span class="chip">'+E(p.category)+'</span>':'')+gatoDate(p.createdAt)+'</span><strong>'+E(p.title)+'</strong>'+(ex?'<p>'+E(ex)+'</p>':'')+'</div></a>';
    }).join(''):'<p class="note">검색된 글이 없어요.</p>';
  }
  q.oninput=draw;
  catsEl.onclick=function(e){var b=e.target.closest('button');if(!b)return;cat=b.dataset.c;[].forEach.call(catsEl.children,function(x){x.classList.toggle('on',x===b);});draw();};
  gatoQuery('blog',{select:['title','category','createdAt','thumbnail','description','draft'],orderBy:'createdAt',desc:true,limit:300}).then(function(rows){
    posts=rows.filter(function(p){return p.title&&p.draft!==true;});
    var cs=['전체'];posts.forEach(function(p){if(p.category&&cs.indexOf(p.category)<0)cs.push(p.category);});
    catsEl.innerHTML=cs.length>1?cs.map(function(c){return '<button type="button" class="pill'+(c==='전체'?' on':'')+'" data-c="'+E(c)+'">'+E(c)+'</button>';}).join(''):'';
    draw();
  }).catch(function(){grid.innerHTML='<p class="note">글을 불러오지 못했어요. 잠시 후 다시 열어주세요.</p>';});
})();
</script>
'''
open(R+'blog.html','w',encoding='utf-8').write(page('가토통신 블로그 - 알뜰폰·선불폰 개통 정보 모음','알뜰폰·선불폰 개통 방법부터 요금제 비교, 유심 구매 팁까지. 상황별 개통 가이드를 가토통신 블로그에서 확인하세요.','/blog','블로그',body,js,CSS))
print('faq/blog ok')
