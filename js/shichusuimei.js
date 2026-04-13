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
  "甲":{t:["リーダー気質","向上心","正直"],d:"甲の人は大樹のようにまっすぐ上へと伸びていく力を持っています。強い向上心と正義感があり、周囲を引っ張るリーダーとして輝ける素質があります。曲がったことが嫌いで、一度決めたことを最後まで貫き通す芯の強さが人としての魅力です。困難な状況でも諦めずに前を向く姿が、多くの人から尊敬と信頼を集めるでしょう。自分の信念を大切にしながら、周囲への配慮も忘れないことが人生を豊かにする鍵です。"},
  "乙":{t:["柔軟性","協調性","粘り強さ"],d:"乙の人は草花のように柔軟にしなやかに生きる力を持っています。どんな環境にも適応できる柔軟性と、周囲との調和を大切にする協調性が最大の強みです。表面は穏やかでも内側には強い粘り強さを秘めており、一見控えめに見えても実はどんな困難も乗り越えていく底力を持っています。人の感情を敏感に察する共感力の高さが、多くの人から愛される理由です。"},
  "丙":{t:["明るさ","情熱","社交性"],d:"丙の人は太陽のように周囲を明るく照らす存在です。生まれながらの社交性と情熱で人を惹きつけ、その場を活気づける天性の才能を持っています。正直でオープンな性格が多くの人から愛される理由であり、どんな場所でも自然と中心的な存在になります。情熱的に物事に取り組む姿勢が周囲に活力を与え、一緒にいるだけで元気をもらえると感じさせる稀有な人物です。"},
  "丁":{t:["繊細","直感力","芸術性"],d:"丁の人はローソクの炎のように温かく繊細な感受性を持っています。直感力が鋭く、他の人が気づかない物事の本質を瞬時に見抜く洞察力に優れています。芸術的な才能に恵まれており、美しいものへの感受性が高く、創造的な分野で卓越した能力を発揮します。人の心の痛みに寄り添う深い共感力で、困っている人の心をそっと照らす存在です。"},
  "戊":{t:["包容力","安定感","誠実"],d:"戊の人は大山のようにどっしりと構えた安定感と包容力を持っています。誠実で信頼できる性格が周囲から慕われ、困ったときに真っ先に頼りにされる存在です。変化よりも着実な積み重ねを好み、長期的な視点で物事を進める力があります。広い心で人を受け入れる包容力は、周囲の人たちに安心感と安らぎを与え、自然と人が集まってくる大きな魅力となっています。"},
  "己":{t:["現実的","細やか","努力家"],d:"己の人は豊かな大地のように周囲を育て支える力を持っています。現実的な判断力と細やかな気配りができ、コツコツと努力を積み重ねることで確かな結果を出し続けます。縁の下の力持ちとして組織を支える才能があり、地道な積み重ねが最終的に大きな成果につながります。人の細かな変化に気づける観察眼と、そっと手を差し伸べる優しさが周囲から厚く信頼される理由です。"},
  "庚":{t:["決断力","正義感","行動力"],d:"庚の人は研ぎ澄まされた刃のように鋭い決断力と正義感を持っています。白黒はっきりさせたい性格で、曖昧な状況を好まず常にクリアな方向性を求めます。強い行動力で目標に向かって突き進む力があり、困難な状況でもひるまない精神的な強さが持ち味です。ぶれない信念と素早い判断力が、周囲から頼りにされるリーダーシップにつながっています。"},
  "辛":{t:["完璧主義","美意識","知性"],d:"辛の人は磨かれた宝石のように美しい知性と洗練された美意識を持っています。完璧主義な一面があり、細部にまでこだわる質の高さが仕事や創造活動における強みです。高い審美眼と知的な魅力で周囲を引きつけ、センスの良さと聡明さが自然と人を魅了します。理想を高く持ち続けることで自己成長を続け、周囲からの評価も自然と高まっていくでしょう。"},
  "壬":{t:["柔軟性","知恵","冒険心"],d:"壬の人は大海のように広大な懐と深い知恵を持っています。柔軟な思考力で状況に応じた最善策を見つけ出す能力があり、どんな困難も知恵で乗り越えていきます。冒険心旺盛で新しいことへのチャレンジを恐れないスケールの大きさが魅力です。固定観念にとらわれず自由な発想で物事を見る力が、周囲が思いつかないような革新的なアイデアを生み出す源になっています。"},
  "癸":{t:["感受性","思いやり","忍耐力"],d:"癸の人は静かに大地を潤す雨のように深い感受性と豊かな思いやりを持っています。人の痛みを自分のことのように感じられる共感力の高さが最大の魅力であり、困っている人の心に自然と寄り添える稀有な存在です。忍耐強く困難な状況でも諦めずに前進する力があり、その粘り強さが最終的に大きな実りをもたらします。静かに積み重ねてきたものが、やがて大きな花を咲かせるでしょう。"}
};

var SSK={
  "子":{t:["知性","行動力","好奇心"],d:"子（ね）の人は頭の回転が速く、好奇心旺盛で何事にも積極的に取り組む活力があります。行動力があり新しいことへの挑戦を恐れない柔軟な精神が、次々と新しい可能性を切り開いていきます。知識を吸収するスピードが速く、様々な分野で幅広い才能を発揮します。頭の良さと行動力を兼ね備えた、バランスの取れた魅力的な人物です。"},
  "丑":{t:["粘り強さ","誠実","堅実"],d:"丑（うし）の人は牛のように粘り強く誠実に物事を積み重ねる力を持っています。着実に一歩一歩進む堅実さが最大の強みであり、長期的な視野で努力を続けることで確かな成功を手にします。誠実さと信頼感が周囲から厚く評価され、時間をかけて築いた人間関係が人生の大きな財産になるでしょう。"},
  "寅":{t:["勇気","リーダーシップ","情熱"],d:"寅（とら）の人は虎のように勇気あふれるリーダーシップを持っています。情熱的に目標に向かって突き進む力があり、その行動力と決断力が周囲を自然と引っ張っていきます。困難な状況でも逃げずに立ち向かう勇気が、多くの人から尊敬を集める最大の魅力です。大きな夢を持ち、それを実現するための行動を惜しまない姿勢が輝いています。"},
  "卯":{t:["穏やか","社交性","センス"],d:"卯（う）の人は兎のように穏やかで社交的な魅力があります。優れた感性とセンスで周囲を和ませる天性の才能を持っており、自然と人が集まってくる温かな人柄が魅力です。争いを好まず調和を大切にする姿勢が、幅広い人間関係を築く力となります。繊細な感受性と柔らかな雰囲気が、多くの人から愛される理由です。"},
  "辰":{t:["カリスマ","向上心","独創性"],d:"辰（たつ）の人は龍のように天性のカリスマ性と強い向上心を持っています。独創的な発想と大胆な行動力で周囲を驚かせ、常に新しい価値を生み出していきます。高い目標を掲げ、それに向かって情熱的に突き進む姿が周囲に感動と刺激を与えます。スケールの大きな夢を描き、その実現に向けて力強く歩み続ける存在感が圧倒的な魅力です。"},
  "巳":{t:["知恵","洞察力","粘り強さ"],d:"巳（み）の人は蛇のように深い知恵と鋭い洞察力を持っています。物事の本質を静かに見極める力があり、表面だけでなく深いところまで理解する知性が強みです。粘り強く目標を追い続ける忍耐力があり、諦めないことで最終的に必ず結果を手にします。慎重に状況を分析しながら最善のタイミングで動く判断力が、人生のあらゆる場面で活きてきます。"},
  "午":{t:["明るさ","情熱","行動力"],d:"午（うま）の人は馬のように明るく情熱的なエネルギーが溢れています。素早い行動力と天性のポジティブさで周囲を活気づけ、その場の雰囲気を一変させる力があります。新しいことへの挑戦を楽しめる前向きな姿勢が、次々と新しいチャンスを引き寄せます。自由を愛し、広い世界に飛び出していく冒険心と行動力が人生を豊かに彩ります。"},
  "未":{t:["温かさ","芸術性","協調性"],d:"未（ひつじ）の人は羊のように温かく芸術的な感性が豊かです。協調性があり周囲と調和しながら物事を進める力が、チームの中で重要な役割を果たします。美しいものへの感受性が高く、芸術や創造的な分野での才能を持っています。人の気持ちに寄り添える優しさと、場の空気を和ませる温かさが多くの人から愛される最大の魅力です。"},
  "申":{t:["機転","多才","社交性"],d:"申（さる）の人は猿のように機転が利き多才で、高い社交性を持っています。様々な分野で才能を発揮できる柔軟性があり、新しい状況にも素早く適応する力が強みです。幅広い人脈を築く社交性と、その場に応じた機転の良さが、ビジネスでも私生活でも大きなアドバンテージになります。好奇心旺盛で常に学び続ける姿勢が、多才さをさらに磨いていくでしょう。"},
  "酉":{t:["完璧主義","美意識","誠実"],d:"酉（とり）の人は美意識が高く誠実さが際立つ完璧主義者です。細部にまでこだわる精緻さと、高い基準を持って物事に取り組む姿勢が周囲から高く評価されます。誠実な人柄と一度決めたことをやり遂げる責任感の強さが、長期的な信頼関係を築く力となります。美しいものや洗練されたものへの感性が鋭く、その審美眼が生活や仕事を豊かに彩ります。"},
  "戌":{t:["忠実","正義感","誠実"],d:"戌（いぬ）の人は犬のように忠実で正義感が強く、誠実さが際立ちます。一度信頼を置いた人に対して揺るぎない誠実さで接し、その信頼に応え続ける責任感の強さが最大の魅力です。正しいことに対しては妥協しない強い正義感があり、その公平さと誠実さで周囲から深く頼りにされます。友情と人間関係を何よりも大切にする温かな心が、生涯の絆を育みます。"},
  "亥":{t:["粘り強さ","直感力","誠実"],d:"亥（い）の人は猪のように強い粘り強さと優れた直感力を持っています。一度決めたことを最後まで諦めない不屈の精神が、どんな困難も乗り越える力の源です。誠実な姿勢で人と向き合い、その真摯さが周囲から深い信頼を獲得します。鋭い直感力で物事の本質を捉える力があり、その判断を信じて行動することで正しい方向へ進むことができます。"}
};

var GU={
  "木":{l:4,w:3,m:3,d:"木の気が強い年は、新しい芽が力強く伸びるような成長と発展の運気に包まれます。これまで温めてきたアイデアや夢を形にするのに絶好のタイミングです。学びへの意欲が自然と高まり、新しいスキルや知識の習得がその後の人生を大きく広げてくれるでしょう。人との出会いも豊かになる時期で、思いがけない縁が人生の転機をもたらすことがあります。"},
  "火":{l:5,w:4,m:3,d:"火の気が強い年は、まるで炎が勢いよく燃え上がるように情熱と活力があふれる時期です。特に恋愛運が高まり、新たな出会いや関係の深化が期待できます。自分の感情に正直に行動することで、望む未来が近づいてきます。社交的な活動が吉となるため、人と積極的に交わることで新しいチャンスが生まれやすい年です。"},
  "土":{l:3,w:4,m:5,d:"土の気が強い年は、大地が万物を育むように安定と着実さに満ちた運気が流れます。これまで蒔いてきた種が実を結ぶ収穫の時期であり、堅実な努力が確かな形となって現れてくるでしょう。金運が特に高まる年であり、財産の形成や資産管理において重要な決断をするのに適しています。焦らず自分のペースを守ることが、長期的な繁栄の鍵となります。"},
  "金":{l:3,w:5,m:4,d:"金の気が強い年は、鋭い刃のように決断力と行動力が研ぎ澄まされる時期です。仕事運が絶好調となり、これまでの努力が周囲に認められ、昇進や重要なプロジェクトへの抜擢など、キャリアの大きな転機が訪れやすい年です。重要な決断を迫られる場面が増えますが、その選択がその後の10年を決める分岐点となることも。信念を持って選んだ道が大きな成功へつながります。"},
  "水":{l:4,w:3,m:4,d:"水の気が強い年は、静かに深く流れる水のように知恵と柔軟性が増す時期です。直感力が格段に高まり、論理を超えたところで正しい選択ができるようになります。表面的には静かに見えても、内側では大きな変化が積み重なっている年です。新しいアイデアが次々と湧き出て、創造的な活動において優れた成果を発揮できます。流れに逆らわず、状況に柔軟に対応することが開運の秘訣です。"}
};

var DD={
  "木":"この10年は、若木が天へ向かって伸びるように成長と発展に満ちた充実の時期です。新しいことを始めるのに最適な10年であり、挑戦すればするほど実力と人脈が積み上がっていきます。学びへの意欲が自然と高まり、知識やスキルを磨くことで将来の大きな飛躍の土台が作られます。この時期に蒔いた種が、次の大運で大きく花開く可能性を秘めています。",
  "火":"この10年は、情熱の炎が燃え盛るように活力と行動力にあふれた輝きの時期です。人間関係が大きく広がり、恋愛や結婚、人生のパートナーとの出会いなど、感情に関わる重要な転機が訪れやすい10年です。積極的に人の輪に飛び込むことで、思いがけない幸運や生涯の友との縁が生まれます。情熱を持って行動し続けることが、この大運を最大限に活かす鍵です。",
  "土":"この10年は、豊かな大地が万物を包み込むように安定と充実に満ちた実りの時期です。これまでの努力と積み重ねがようやく確かな形となって現れてくる、収穫の10年です。焦らず着実に歩んできた姿勢が周囲の信頼を集め、社会的な地位や評価が自然と高まっていきます。土台を固めながら前進することで、長く続く安定した幸せと豊かさを手にできるでしょう。",
  "金":"この10年は、鋭く磨かれた金属のように決断力と行動力が最高潮に達する飛躍の時期です。人生において最も重要な決断を迫られることが多い10年ですが、それぞれの選択が将来の大きな成功へとつながっています。仕事や社会的な活動において実力が発揮されやすく、これまでの経験と知識が高く評価されるチャンスが訪れます。勇気を持って選んだ道を信じて進んでください。",
  "水":"この10年は、深く静かに流れる水のように知恵と柔軟性が増す変化と流動の時期です。外側からは穏やかに見えても、内側では大きな変化が着実に積み重なっています。直感力と洞察力が研ぎ澄まされ、物事の本質を見抜く力が高まります。変化を恐れず、流れに身を委ねながら柔軟に対応することで、思いがけない幸運と新しい可能性の扉が開かれていくでしょう。"
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
      var stars="";
      for(var si2=0;si2<cnt;si2++)stars+="★";
      for(var si3=cnt;si3<8;si3++)stars+="☆";
      gbh+="<div class=\"gogyo-bar-row\"><div class=\"gogyo-bar-label\">"+GE[g]+" "+g+"</div>"
        +"<div class=\"gogyo-bar-wrap\"><div class=\"gogyo-bar-fill\" style=\"width:"+(tg?cnt/mg*100:0)+"%;background:"+GB[g]+";\"></div></div>"
        +"<div class=\"gogyo-bar-stars\" style=\"font-size:0.75rem;color:"+GB[g]+";white-space:nowrap;flex-shrink:0;margin-left:6px;\">"+stars+"</div>"
        +"</div>";
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
