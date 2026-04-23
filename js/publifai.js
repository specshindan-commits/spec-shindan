(function(){

/* カウントダウン */
function cdTick(){
  var now=new Date(), dead=new Date();
  dead.setDate(dead.getDate()+7); dead.setHours(23,59,59,0);
  var diff=Math.max(0,dead-now);
  var d=Math.floor(diff/86400000);
  var h=Math.floor((diff%86400000)/3600000);
  var m=Math.floor((diff%3600000)/60000);
  var s=Math.floor((diff%60000)/1000);
  function p(n){return String(n).padStart(2,'0');}
  ['cd-days','cd-hours','cd-minutes','cd-seconds'].forEach(function(id,i){
    var el=document.getElementById(id); if(el) el.textContent=p([d,h,m,s][i]);
  });
  ['cd-days2','cd-hours2','cd-minutes2','cd-seconds2'].forEach(function(id,i){
    var el=document.getElementById(id); if(el) el.textContent=p([d,h,m,s][i]);
  });
}
cdTick(); setInterval(cdTick,1000);

/* ハンバーガー */
window.toggleMenu=function(){
  ['hamburger','drawer','drawerOverlay'].forEach(function(id){
    document.getElementById(id).classList.toggle('open');
  });
};
window.closeMenu=function(){
  ['hamburger','drawer','drawerOverlay'].forEach(function(id){
    document.getElementById(id).classList.remove('open');
  });
};

/* FAQ */
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click',function(){
      var ans=btn.closest('.faq-item').querySelector('.faq-a');
      var open=ans.classList.contains('open');
      document.querySelectorAll('.faq-a,.faq-q').forEach(function(x){x.classList.remove('open');});
      if(!open){ans.classList.add('open');btn.classList.add('open');}
    });
  });
});

/* キャッチコピー タイピング */
var HERO=[
  {id:'scramble1',txt:'2分で3万字'},
  {id:'scramble2',txt:'なのに、'},
  {id:'scramble3',txt:'SEOが強い。'}
];
var TSP=80, PSP=1500, DSP=40;

function tType(el,txt,i,cb){
  if(i<=txt.length){el.textContent=txt.slice(0,i); setTimeout(function(){tType(el,txt,i+1,cb);},TSP);}
  else{if(cb)cb();}
}
function tDel(el,txt,i,cb){
  if(i>=0){el.textContent=txt.slice(0,i); setTimeout(function(){tDel(el,txt,i-1,cb);},DSP);}
  else{if(cb)cb();}
}
function heroSeq(){
  HERO.forEach(function(l){var el=document.getElementById(l.id); if(el)el.textContent='';});
  function fwd(n){
    if(n>=HERO.length){setTimeout(function(){bwd(HERO.length-1);},PSP);return;}
    var el=document.getElementById(HERO[n].id);
    if(!el){fwd(n+1);return;}
    tType(el,HERO[n].txt,0,function(){fwd(n+1);});
  }
  function bwd(n){
    if(n<0){setTimeout(heroSeq,300);return;}
    var el=document.getElementById(HERO[n].id);
    if(!el){bwd(n-1);return;}
    tDel(el,HERO[n].txt,HERO[n].txt.length,function(){bwd(n-1);});
  }
  fwd(0);
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){setTimeout(heroSeq,300);});
}else{setTimeout(heroSeq,300);}

/* 見出しタイピング */
var HSP=50;
function buildH(el){
  var raw=el.getAttribute('data-lines')||'';
  var blue=el.getAttribute('data-blue')==='1';
  var lines=raw.split('|');
  el.innerHTML='';
  lines.forEach(function(line,i){
    var sp=document.createElement('span');
    sp.className='type-line';
    sp.setAttribute('data-text',line);
    var isB=blue&&i===lines.length-1&&lines.length>1;
    sp.setAttribute('data-isblue',isB?'1':'0');
    sp.textContent=line;
    sp.style.color=isB?'var(--blue)':'var(--navy)';
    el.appendChild(sp);
    if(i<lines.length-1)el.appendChild(document.createElement('br'));
  });
}
function typeH(el){
  var spans=el.querySelectorAll('.type-line');
  spans.forEach(function(s){s.textContent='';});
  var idx=0;
  function next(){
    if(idx>=spans.length)return;
    var sp=spans[idx];
    var txt=sp.getAttribute('data-text');
    var isB=sp.getAttribute('data-isblue')==='1';
    var ci=0;
    spans.forEach(function(s){s.style.borderRight='none';});
    sp.style.borderRight='2px solid var(--blue)';
    sp.style.color=isB?'var(--blue)':'var(--navy)';
    var tm=setInterval(function(){
      sp.textContent=txt.slice(0,ci+1); ci++;
      if(ci>=txt.length){
        clearInterval(tm);
        sp.style.borderRight='none';
        idx++; setTimeout(next,80);
      }
    },HSP);
  }
  next();
}
function initH(){
  var hs=document.querySelectorAll('.type-heading');
  hs.forEach(function(el){buildH(el);});
  if('IntersectionObserver' in window){
    var ob=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting&&!e.target.dataset.typed){
          e.target.dataset.typed='1'; typeH(e.target);
        }
      });
    },{threshold:0.1,rootMargin:'0px 0px -50px 0px'});
    hs.forEach(function(el){ob.observe(el);});
  }
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',initH);
}else{initH();}

}());
