// 四柱推命メインJS - GitHub/jsDelivr経由で読み込む
var scG=0;

var KAN=["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
var SHI=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
var KG=["木","木","火","火","土","土","金","金","水","水"];
var SG=["水","土","木","木","土","火","火","土","金","金","土","水"];
var KY=[1,0,1,0,1,0,1,0,1,0];
var GC={"木":"gogyo-wood","火":"gogyo-fire","土":"gogyo-earth","金":"gogyo-metal","水":"gogyo-water"};
var GB={"木":"#4CAF50","火":"#FF7043","土":"#FFC107","金":"#AB47BC","水":"#42A5F5"};
var GE={"木":"🌿","火":"🔥","土":"🌍","金":"⚡","水":"💧"};
var SD=[[6,5],[6,4],[4,19],[5,6],[6,6],[7,7],[7,23],[8,8],[9,8],[10,8],[11,7],[12,7]];
var BD=new Date(1900,0,1);

function scSetGender(g){
  scG=g;
  document.getElementById("scGenderM").className="sc-gender-btn"+(g===0?" active":"");
  document.getElementById("scGenderF").className="sc-gender-btn"+(g===1?" active":"");
}

function scDD(d1,d2){return Math.floor((d2-d1)/86400000);}

function scGetDay(date){
  var diff=scDD(BD,date);
  var ki=(6+diff%10+10000)%10;
  var si=(0+diff%12+12000)%12;
  return {k:KAN[ki],s:SHI[si],ki:ki,si:si};
}

function scGetYear(y,m,d){
  var yr=y;if(m<2||(m===2&&d<4))yr--;
  var ki=((yr-4)%10+10)%10;var si=((yr-4)%12+12)%12;
  return {k:KAN[ki],s:SHI[si],ki:ki,si:si};
}

function scGetMonth(y,m,d){
  var sd=SD[m-1][1];var mn=m-1;if(d<sd)mn--;if(mn<0)mn+=12;
  var yk=scGetYear(y,m,d).ki;var bk=(yk%5)*2;var ki=(bk+mn)%10;
  return {k:KAN[ki],s:SHI[(mn+2)%12],ki:ki,si:(mn+2)%12};
}

function scGetTime(h,dk){
  var si=Math.floor(h/2)%12;var ki=((dk%5)*2+si)%10;
  return {k:KAN[ki],s:SHI[si],ki:ki,si:si};
}

function scCalcDaiun(bd,yk,g){
  var isYang=KY[yk.ki]===1;var fwd=(g===0&&isYang)||(g===1&&!isYang);
  var bm=bd.getMonth()+1,bday=bd.getDate(),by=bd.getFullYear();
  var sd2;
  if(fwd){var nm=bm%12+1,ny=nm===1?by+1:by;sd2=new Date(ny,nm-1,SD[nm-1][1]);}
  else{sd2=new Date(by,bm-1,SD[bm-1][1]);if(sd2>=bd){var pm=bm-2<0?11:bm-2,py=pm===11?by-1:by;sd2=new Date(py,pm,SD[pm][1]);}}
  var dd2=Math.abs(scDD(bd,sd2));var sa=Math.round(dd2/3);
  var mk2=scGetMonth(by,bm,bday);var res=[];
  for(var i=0;i<9;i++){
    var a=sa+i*10,ki2,si2;
    if(fwd){ki2=(mk2.ki+i+1)%10;si2=(mk2.si+i+1)%12;}
    else{ki2=((mk2.ki-i-1)%10+10)%10;si2=((mk2.si-i-1)%12+12)%12;}
    res.push({age:a,k:KAN[ki2],s:SHI[si2],ki:ki2,si:si2});
  }
  return {sa:sa,list:res};
}

function scCountG(ps){
  var c={"木":0,"火":0,"土":0,"金":0,"水":0};
  ps.forEach(function(p){if(p){c[KG[p.ki]]++;c[SG[p.si]]++;}});
  return c;
}

function scDjb2(s){var h=5381;for(var i=0;i<s.length;i++)h=(h*33)^s.charCodeAt(i);return h>>>0;}
function scRand(seed){var s=seed;return function(){s^=s<<13;s^=s>>17;s^=s<<5;return s>>>0;};}

var KSK={
  "甲":{t:["リーダー気質","向上心","正直"],d:"甲の人は大樹のようにまっすぐ上へと伸びていく力を持っています。強い向上心と正義感があり、周囲を引っ張るリーダーとして輝ける素質があります。"},
  "乙":{t:["柔軟性","協調性","粘り強さ"],d:"乙の人は草花のように柔軟にしなやかに生きる力を持っています。表面は穏やかでも内側には強い粘り強さを秘めています。"},
  "丙":{t:["明るさ","情熱","社交性"],d:"丙の人は太陽のように周囲を明るく照らす存在です。生まれながらの社交性と情熱で人を惹きつけます。"},
  "丁":{t:["繊細","直感力","芸術性"],d:"丁の人はローソクの炎のように温かく繊細な感受性を持っています。直感力が鋭く、芸術的な才能に恵まれた方が多いです。"},
  "戊":{t:["包容力","安定感","誠実"],d:"戊の人は大山のようにどっしりと構えた安定感と包容力を持っています。誠実で信頼できる性格が周囲から慕われます。"},
  "己":{t:["現実的","細やか","努力家"],d:"己の人は豊かな大地のように周囲を育てる力を持っています。現実的で細やかな気配りができ、努力を積み重ねます。"},
  "庚":{t:["決断力","正義感","行動力"],d:"庚の人は刃のように鋭い決断力と正義感を持っています。強い行動力で目標に向かって突き進む力があります。"},
  "辛":{t:["完璧主義","美意識","知性"],d:"辛の人は磨かれた宝石のように美しい知性と美意識を持っています。高い審美眼と知的な魅力で周囲を引きつけます。"},
  "壬":{t:["柔軟性","知恵","冒険心"],d:"壬の人は大海のように広大な懐と知恵を持っています。柔軟な思考力で最善策を見つけ出す能力があります。"},
  "癸":{t:["感受性","思いやり","忍耐力"],d:"癸の人は静かに大地を潤す雨のように深い感受性と思いやりを持っています。忍耐強く前進する力があります。"}
};

var SSK={
  "子":{t:["知性","行動力","好奇心"],d:"子（ね）の人は頭の回転が速く好奇心旺盛です。行動力があり新しい挑戦を恐れません。"},
  "丑":{t:["粘り強さ","誠実","堅実"],d:"丑（うし）の人は粘り強く誠実です。着実に積み上げる堅実さで長期的な成功をつかみます。"},
  "寅":{t:["勇気","リーダーシップ","情熱"],d:"寅（とら）の人は勇気とリーダーシップに優れています。情熱的に目標に向かって突き進む力があります。"},
  "卯":{t:["穏やか","社交性","センス"],d:"卯（う）の人は穏やかで社交的です。優れたセンスと人を和ませる力で周囲から愛されます。"},
  "辰":{t:["カリスマ","向上心","独創性"],d:"辰（たつ）の人は天性のカリスマと強い向上心を持っています。独創的な発想で周囲を驚かせます。"},
  "巳":{t:["知恵","洞察力","粘り強さ"],d:"巳（み）の人は深い知恵と洞察力を持っています。粘り強く目標を追い続ける忍耐力があります。"},
  "午":{t:["明るさ","情熱","行動力"],d:"午（うま）の人は明るく情熱的です。素早い行動力と天性のポジティブさで周囲を活気づけます。"},
  "未":{t:["温かさ","芸術性","協調性"],d:"未（ひつじ）の人は温かく芸術的な感性を持っています。協調性があり調和しながら進みます。"},
  "申":{t:["機転","多才","社交性"],d:"申（さる）の人は機転が利き多才です。高い社交性で人脈を築き活躍できます。"},
  "酉":{t:["完璧主義","美意識","誠実"],d:"酉（とり）の人は美意識が高く誠実です。完璧を追求する姿勢が高い評価につながります。"},
  "戌":{t:["忠実","正義感","誠実"],d:"戌（いぬ）の人は忠実で正義感が強いです。信頼できる誠実さで周囲から頼りにされます。"},
  "亥":{t:["粘り強さ","直感力","誠実"],d:"亥（い）の人は強い粘り強さと優れた直感力を持っています。誠実な姿勢で夢を実現します。"}
};

var GU={
  "木":{l:4,w:3,m:3,d:"木の気が強い年。成長と発展の運気です。新しい出発や学びに最適な時期です。"},
  "火":{l:5,w:4,m:3,d:"火の気が強い年。情熱と活力があふれます。恋愛運が特に高まります。"},
  "土":{l:3,w:4,m:5,d:"土の気が強い年。安定と着実さの運気です。金運が高まり堅実な努力が実を結びます。"},
  "金":{l:3,w:5,m:4,d:"金の気が強い年。決断と収穫の運気です。仕事運が絶好調な時期です。"},
  "水":{l:4,w:3,m:4,d:"水の気が強い年。知恵と柔軟性の運気です。直感力が高まり新しいアイデアが生まれやすい時期です。"}
};

var DD={
  "木":"成長と発展の10年。新しいことを始めるのに最適な時期。積極的な挑戦で大きな実りを得られます。",
  "火":"情熱と活力の10年。人間関係が広がり恋愛や人生の転機が訪れやすい時期です。",
  "土":"安定と充実の10年。これまでの努力が実を結び着実な成果を得られる時期です。",
  "金":"決断と収穫の10年。正しい選択が大きな成功につながります。",
  "水":"変化と流動の10年。直感に従うことで道が開けます。"
};

var LC=[
  {n:"ローズクォーツ",h:"#F4A7B9"},{n:"シャンパンゴールド",h:"#DDBB73"},
  {n:"ラベンダー",h:"#B39DDB"},{n:"ミントグリーン",h:"#80CBC4"},
  {n:"スカイブルー",h:"#81D4FA"},{n:"テラコッタ",h:"#C67C5A"},
  {n:"パールホワイト",h:"#F0E8DC"},{n:"コーラルピンク",h:"#F48B7B"},
  {n:"フォレストグリーン",h:"#66BB6A"},{n:"インディゴ",h:"#5C6BC0"}
];

function scPillar(p){
  if(!p)return "<td><div class=\"meishiki-kan\" style=\"color:#ccc\">&#8212;</div><div class=\"meishiki-shi\" style=\"color:#ccc\">&#8212;</div></td>";
  var kg=KG[p.ki],sg=SG[p.si];
  return "<td><div class=\"meishiki-kan\">"+p.k+"</div><div class=\"meishiki-shi\">"+p.s+"</div>"
    +"<div><span class=\"meishiki-gogyo "+GC[kg]+"\">"+kg+"</span></div>"
    +"<div style=\"margin-top:2px\"><span class=\"meishiki-gogyo "+GC[sg]+"\">"+sg+"</span></div></td>";
}

function scDiagnose(){
  var bv=document.getElementById("scBirthday").value;
  var tv=document.getElementById("scBirthTime").value;
  if(!bv){alert("生年月日を入力してください");return;}
  var res=document.getElementById("sc-result");
  res.style.display="block";
  res.innerHTML="<div class=\"sc-loading\">鑑定中</div>";
  setTimeout(function(){
    var ps=bv.split("-");
    var y=parseInt(ps[0]),m=parseInt(ps[1]),d=parseInt(ps[2]);
    var bd=new Date(y,m-1,d);
    var td=new Date();
    var age=td.getFullYear()-y-((td.getMonth()+1<m||(td.getMonth()+1===m&&td.getDate()<d))?1:0);
    var nc=scGetYear(y,m,d);
    var mc=scGetMonth(y,m,d);
    var dc=scGetDay(bd);
    var tc=null;
    if(tv){var h=parseInt(tv.split(":")[0]);tc=scGetTime(h,dc.ki);}
    var ps2=[nc,mc,dc,tc];
    var gc=scCountG(ps2);
    var gv=Object.values(gc);
    var mg=Math.max.apply(null,gv);
    var tg=gv.reduce(function(a,b){return a+b;},0);
    var dr=scCalcDaiun(bd,nc,scG);
    var sa=dr.sa,dl=dr.list,ci=0;
    for(var di=0;di<dl.length;di++){if(age>=dl[di].age&&(di===dl.length-1||age<dl[di+1].age)){ci=di;break;}}
    var ty=td.getFullYear();
    var rl=[ty,ty+1,ty+2].map(function(yr){var k=scGetYear(yr,3,1);return {k:k.k,s:k.s,ki:k.ki,si:k.si,y:yr};});
    var seed=scDjb2(bv+String(scG));
    var rf=scRand(seed);
    var lc1=LC[Math.abs(rf())%LC.length];
    var lc2=LC[(Math.abs(rf())+3)%LC.length];
    var ln1=(Math.abs(rf())%9)+1,ln2=(Math.abs(rf())%9)+1;
    var mk=KSK[dc.k],ms=SSK[dc.s];
    var dg=Object.keys(gc).reduce(function(a,b){return gc[a]>=gc[b]?a:b;});
    var rs=rl.map(function(r){var g=KG[r.ki];var b=GU[g];return {l:b.l,w:b.w,m:b.m,d:b.d,g:g,k:r.k,s:r.s,y:r.y};});
    function st(n){return "★".repeat(n)+"☆".repeat(5-n);}
    function bw(n){return (n/5*100)+"%";}
    var gbh="";
    ["木","火","土","金","水"].forEach(function(g){
      var cnt=gc[g];
      gbh+="<div class=\"gogyo-bar-row\"><div class=\"gogyo-bar-label\">"+GE[g]+" "+g+"</div>"
        +"<div class=\"gogyo-bar-wrap\"><div class=\"gogyo-bar-fill\" style=\"width:"+(tg?cnt/mg*100:0)+"%;background:"+GB[g]+";\"></div></div>"
        +"<div class=\"gogyo-bar-count\">"+cnt+"</div></div>";
    });
    var dh="";
    dl.forEach(function(dd,i){
      var g=KG[dd.ki],ic=i===ci;
      dh+="<div class=\"daiu-item"+(ic?" daiu-current":"")+"\"><div class=\"daiu-age\">"+dd.age+"〜"+(dd.age+9)+"歳"+(ic?"<br><strong style=\"color:var(--accent)\">▶ 現在</strong>":"")+"</div>"
        +"<div class=\"daiu-kan\"><span class=\"meishiki-gogyo "+GC[g]+"\" style=\"font-size:0.7rem;\">"+g+"</span><br>"+dd.k+dd.s+"</div>"
        +"<div class=\"daiu-desc\">"+DD[g]+"</div></div>";
    });
    var rch="";
    rs.forEach(function(r,i){
      rch+="<div class=\"ryunen-card"+(i===0?" ryunen-current":"")+"\"><div class=\"ryunen-year\">"+r.y+"年"+(i===0?"（今年）":i===1?"（来年）":"（再来年）")+"</div>"
        +"<div class=\"ryunen-kan\">"+r.k+r.s+"</div>"
        +"<div style=\"margin-top:4px\"><span class=\"meishiki-gogyo "+GC[r.g]+"\" style=\"font-size:0.68rem;\">"+r.g+"</span></div></div>";
    });
    var rdh="";
    rs.forEach(function(r,i){
      rdh+="<div class=\"sc-section\"><h3>"+r.y+"年（"+(i===0?"今年":i===1?"来年":"再来年")+"）"+r.k+r.s+"年の運勢</h3>"
        +"<p class=\"sc-desc\" style=\"margin-bottom:12px;\">"+r.d+"</p>"
        +"<div class=\"ryunen-detail\">"
        +"<div class=\"ryunen-row\"><span class=\"ryunen-label\">❤️ 恋愛運</span><div class=\"ryunen-bar-wrap\"><div class=\"ryunen-bar\" style=\"width:"+bw(r.l)+"\"></div></div><span class=\"ryunen-stars\">"+st(r.l)+"</span></div>"
        +"<div class=\"ryunen-row\"><span class=\"ryunen-label\">💼 仕事運</span><div class=\"ryunen-bar-wrap\"><div class=\"ryunen-bar\" style=\"width:"+bw(r.w)+"\"></div></div><span class=\"ryunen-stars\">"+st(r.w)+"</span></div>"
        +"<div class=\"ryunen-row\"><span class=\"ryunen-label\">💰 金　運</span><div class=\"ryunen-bar-wrap\"><div class=\"ryunen-bar\" style=\"width:"+bw(r.m)+"\"></div></div><span class=\"ryunen-stars\">"+st(r.m)+"</span></div>"
        +"</div></div>";
    });
    res.innerHTML="<div class=\"sc-title-block\"><div class=\"sc-name\">"+y+"年"+m+"月"+d+"日生まれ</div>"
      +"<div class=\"sc-sub\">"+(scG===0?"男性":"女性")+"・"+age+"歳の命式鑑定</div></div>"
      +"<div class=\"sc-section\"><h3>✦ 命式（四柱） ✦</h3>"
      +"<table class=\"meishiki-table\"><tr><th>年柱</th><th>月柱</th><th>日柱</th><th>時柱</th></tr>"
      +"<tr>"+scPillar(nc)+scPillar(mc)+scPillar(dc)+scPillar(tc)+"</tr></table>"
      +(!tc?"<p style=\"font-size:0.75rem;color:var(--text-sub);text-align:center;margin-top:10px;\">出生時刻で時柱も鑑定できます</p>":"")
      +"</div>"
      +"<div class=\"sc-section\"><h3>✦ 五行バランス ✦</h3><div class=\"gogyo-bars\">"+gbh+"</div>"
      +"<p class=\"sc-desc\" style=\"margin-top:12px;\">"+GE[dg]+dg+"の気が最も強く、人生が展開します。</p></div>"
      +"<div class=\"sc-section\"><h3>✦ 基本性格・才能（日干："+dc.k+"） ✦</h3>"
      +"<div class=\"sc-tag-wrap\">"+mk.t.map(function(t){return "<span class=\"sc-tag\">"+t+"</span>";}).join("")+"</div>"
      +"<p class=\"sc-desc\">"+mk.d+"</p></div>"
      +"<div class=\"sc-section\"><h3>✦ 日支（"+dc.s+"）からみる気質 ✦</h3>"
      +"<div class=\"sc-tag-wrap\">"+ms.t.map(function(t){return "<span class=\"sc-tag\">"+t+"</span>";}).join("")+"</div>"
      +"<p class=\"sc-desc\">"+ms.d+"</p></div>"
      +"<div class=\"sc-section\"><h3>✦ 大運（10年サイクル） ✦</h3>"
      +"<p class=\"sc-desc\" style=\"margin-bottom:12px;\">"+sa+"歳から大運が始まります。</p>"
      +"<div class=\"daiu-list\">"+dh+"</div></div>"
      +"<div class=\"sc-section\"><h3>✦ 流年（年ごとの運気） ✦</h3><div class=\"ryunen-grid\">"+rch+"</div></div>"+rdh
      +"<div class=\"sc-section\"><h3>✦ ラッキーカラー・ラッキーナンバー ✦</h3>"
      +"<div class=\"lucky-grid\">"
      +"<div class=\"lucky-card\"><div class=\"lc-label\">ラッキーカラー①</div><div class=\"lc-value\"><span class=\"lucky-color-dot\" style=\"background:"+lc1.h+"\"></span>"+lc1.n+"</div></div>"
      +"<div class=\"lucky-card\"><div class=\"lc-label\">ラッキーカラー②</div><div class=\"lc-value\"><span class=\"lucky-color-dot\" style=\"background:"+lc2.h+"\"></span>"+lc2.n+"</div></div>"
      +"<div class=\"lucky-card\"><div class=\"lc-label\">ラッキーナンバー①</div><div class=\"lc-value\">"+ln1+"</div></div>"
      +"<div class=\"lucky-card\"><div class=\"lc-label\">ラッキーナンバー②</div><div class=\"lc-value\">"+ln2+"</div></div>"
      +"</div></div>"
      +"<button class=\"sc-share-btn\" id=\"scShareBtn\">"
      +"<svg viewBox=\"0 0 24 24\"><path d=\"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z\"/></svg>"
      +"Xでシェアする</button>"
      +"<button class=\"sc-retry-btn\" onclick=\"scRetry()\">別の生年月日で鑑定する</button>";
    var sb=document.getElementById("scShareBtn");
    if(sb){
      sb.setAttribute("data-y",y);sb.setAttribute("data-m",m);sb.setAttribute("data-d",d);
      sb.setAttribute("data-ks",dc.k+dc.s);
      sb.addEventListener("click",function(){
        scShare(parseInt(this.getAttribute("data-y")),parseInt(this.getAttribute("data-m")),
          parseInt(this.getAttribute("data-d")),this.getAttribute("data-ks"));
      });
    }
  },600);
}

function scShare(y,m,d,ks){
  var t="【四柱推命】\n"+y+"年"+m+"月"+d+"日生まれの命式\n\n日干："+ks+"\n\n生年月日から運命・才能・大運を無料鑑定✦\nhttps://www.spec-shindan.com/shichusuimei/";
  window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent(t),"_blank");
}

function scRetry(){
  document.getElementById("sc-result").style.display="none";
  document.getElementById("scBirthday").value="";
  document.getElementById("scBirthTime").value="";
  window.scrollTo({top:0,behavior:"smooth"});
}
