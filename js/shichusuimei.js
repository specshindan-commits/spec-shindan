// 四柱推命メインJS - GitHub/jsDelivr経由
var scG=0;
var KAN=["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
var SHI=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
var KG=["木","木","火","火","土","土","金","金","水","水"];
var SG=["水","土","木","木","土","火","火","土","金","金","土","水"];
var KY=[1,0,1,0,1,0,1,0,1,0]; // 1=陽 0=陰
var GC={"木":"gogyo-wood","火":"gogyo-fire","土":"gogyo-earth","金":"gogyo-metal","水":"gogyo-water"};
var GB={"木":"#4CAF50","火":"#FF7043","土":"#FFC107","金":"#AB47BC","水":"#42A5F5"};
var GE={"木":"🌿","火":"🔥","土":"🌍","金":"⚡","水":"💧"};
var SD=[[6,5],[6,4],[4,19],[5,6],[6,6],[7,7],[7,23],[8,8],[9,8],[10,8],[11,7],[12,7]];
var BD=new Date(1900,0,1);

// 五行相生相剋
var GSEIKO={"木":"火","火":"土","土":"金","金":"水","水":"木"}; // 相生
var GKOKU={"木":"土","土":"水","水":"火","火":"金","金":"木"};  // 相剋

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

// ===== 十神計算 =====
// 日干(nk)に対する他の干(ok)の十神を返す
function calcJussin(nkIdx, okIdx){
  var ng=KG[nkIdx], og=KG[okIdx];
  var nyin=KY[nkIdx], oyin=KY[okIdx];
  var sameName=(nyin===oyin);
  // 同五行
  if(ng===og) return sameName?"比肩":"劫財";
  // 日干が生む（相生：ng→og）
  if(GSEIKO[ng]===og) return sameName?"食神":"傷官";
  // 日干が剋す（相剋：ng→og）
  if(GKOKU[ng]===og) return sameName?"偏財":"正財";
  // 剋される（og→ng）
  if(GKOKU[og]===ng) return sameName?"偏官":"正官";
  // 生まれる（og→ng）
  if(GSEIKO[og]===ng) return sameName?"偏印":"印綬";
  return "不明";
}

function calcDaiun(bd,yk,g){
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


// ===== 十神コメント =====
var JSCOMMENT={
  "比肩":{
    nature:"強い独立心と自己主張を持ち、自分のペースで物事を進める力があります。負けず嫌いで競争心が旺盛なため、ライバルの存在がむしろエネルギーの源となります。自立心が強く、他人に頼ることを好まない面がありますが、それがあなたを自力で道を切り拓く力強さにつながっています。",
    work:"仕事では独立・起業・フリーランスなど、自分の裁量で動ける環境で最も輝きます。組織の中では縛られる感覚を覚えやすく、自由に動ける役職や立場になることで本来の能力が発揮されます。競合他社の存在や同僚との競争がモチベーションを高め、切磋琢磨できる環境が成長を加速させます。",
    love:"恋愛では対等な関係を重視し、依存し合うよりも互いが自立した上での絆を求めます。束縛されることを嫌うため、パートナーにも同様の自由を与える余裕が必要です。一度心を開いた相手には誠実で一途ですが、プライドが高いため素直に甘えられない場面も。",
    partner:"あなたの強い個性と自立心を尊重し、対等に渡り合える精神的にも自立した人が最良のパートナーです。依存的な関係よりも、互いの世界を持ちながら共に高め合えるような、精神的な自由度の高い関係が長続きします。",
    support:"同じ志を持ち、切磋琢磨できる同世代のライバルや仲間があなたの最大の支援者です。競い合いながらも互いを認め合える関係が、あなたの潜在能力を最大限に引き出してくれます。",
    mistake:"プライドの高さから他人の意見を素直に受け入れられず、孤立してしまうことがあります。「自分が正しい」という確信が強いため、周囲との協調を軽視してしまうリスクも。意識的に他者の視点を取り入れ、時には頼ることの大切さを学ぶことで、可能性が大きく広がります。",
    guidance:"あなたの強みは揺るぎない自立心と行動力です。しかし、孤軍奮闘するよりも信頼できる仲間と協力することで、一人では到達できない高みに達することができます。プライドを保ちながらも柔軟性を持ち、周囲の知恵を借りる謙虚さが運気をさらに高めます。",
    partnerType:"偏財",
    partnerDesc:"あなたの強い個性と自立心を受け止め、自由を与えてくれる偏財タイプが最良のパートナーです。行動的でビジネスセンスがあり、あなたの競争心を良い方向に引き出してくれる存在です。お互いの世界を尊重しながら共に高め合える、対等でエネルギッシュな関係が長続きします。",
    supportType:"偏官",
    supportDesc:"あなたの強い独立心と行動力を正当に評価し、重要な仕事を任せてくれる偏官タイプが力になります。厳しくも公正な評価基準を持ち、あなたの実力を本当の意味で試してくれる存在です。プレッシャーの中でこそ力を発揮するあなたの資質を見抜き、大きなチャンスを与えてくれるでしょう。"
  },
  "劫財":{
    nature:"情熱的で行動力があり、物事を推し進める力強さを持っています。負けることを極端に嫌い、一度火がついたら誰も止められないほどのエネルギーを発揮します。社交的で人を引き付ける魅力がある一方、感情の起伏が激しく、衝動的な面もあります。",
    work:"仕事では営業・販売・交渉など、人と直接関わりながら成果を出す分野で才能を発揮します。スピードと結果を重視するため、細かい作業より大きなビジョンを描き実行するポジションが向いています。チームを鼓舞するリーダーシップがありますが、独断専行になりやすい点に注意が必要です。",
    love:"恋愛では情熱的で、好きになった相手には全力で向き合います。しかし独占欲が強く、嫉妬心から関係がこじれることも。感情が先走りがちなため、冷静に相手の気持ちを確認する習慣が大切です。",
    partner:"あなたの情熱と行動力を包み込み、感情の起伏を温かく受け止めてくれる安定した人が最良です。あなたが走りすぎたとき、そっとブレーキをかけてくれる落ち着いた包容力のある人との縁が深いでしょう。",
    support:"あなたの情熱を理解し、背中を押してくれる年上の mentor 的存在が大きな力になります。経験豊富な先輩や、実績ある指導者からのアドバイスがあなたの可能性を正しい方向へ導きます。",
    mistake:"衝動的な決断と浪費癖がリスクです。興奮状態で下した判断が後悔につながることが多く、特に金銭面での無計画な出費には注意が必要です。大きな決断をする前に、信頼できる人に相談する習慣をつけることで多くのミスを防げます。",
    guidance:"あなたの情熱とエネルギーは最大の武器ですが、それを正しい方向に向けることが鍵です。感情に流されず、長期的な視点で物事を判断する訓練を積むことで、その力強さが確かな成果として実を結びます。",
    partnerType:"正財",
    partnerDesc:"あなたの情熱と衝動性をうまく受け止め、安定させてくれる正財タイプが最良のパートナーです。誠実で堅実な価値観を持ち、あなたが暴走しそうなときにそっとブレーキをかけてくれます。感情の波を穏やかに包み込む包容力のある相手が最高のパートナーとなります。",
    supportType:"印綬",
    supportDesc:"あなたの情熱と行動力を深く理解し、精神的な基盤を与えてくれる印綬タイプが支援者となります。豊かな知識と経験で方向性を示してくれるmentor的存在です。感情が先走るあなたに対して、冷静な視点と知恵を授けてくれる年上の指導者との縁が人生を大きく変えます。"
  },
  "食神":{
    nature:"温かく穏やかな雰囲気を持ち、周囲に安らぎをもたらす天性の才能があります。表現力が豊かで、食・芸術・エンターテインメントなど五感を通じた喜びを人生の中心に置きます。楽天的で争いを好まず、その場を和ませるユーモアのセンスが光ります。",
    work:"仕事では飲食業・芸術・エンターテインメント・教育・サービス業など、人に喜びを届ける分野で才能を発揮します。創造的な発想と表現力を活かせる環境が最も向いており、厳しい競争よりも協力し合えるチームワークを重視する職場で輝きます。",
    love:"恋愛では相手をリラックスさせる包容力と癒しの力が魅力です。束縛を嫌い、お互いが自由でいられる軽やかな関係を好みます。自然体で接することができるため、長期的な関係に発展しやすく、結婚後も穏やかで温かい家庭を築けます。",
    partner:"あなたの自由な感性を尊重し、一緒にいて自然体でいられる人が最良です。共に美味しいものを食べ、旅をし、日常の小さな幸せを分かち合える価値観の合うパートナーとの縁が深いでしょう。",
    support:"あなたの才能を認め、創造的な活動を応援してくれる理解者が力になります。同じ趣味や感性を持つ仲間や、あなたの表現を世に広める手助けをしてくれるプロデューサー的な存在が運気を高めます。",
    mistake:"楽天的すぎて計画性が欠けることがリスクです。今を楽しむことを優先するあまり、将来への備えが疎かになりがちです。定期的に長期的な目標を見直し、楽しみながらも着実に積み重ねる習慣をつけることが大切です。",
    guidance:"あなたの喜びを周囲と分かち合う力が、人生を豊かにする鍵です。好きなことを仕事にする勇気を持ち、自分の感性を信じて創造的な活動に取り組むことで、あなたにしかできない豊かな世界が広がります。",
    partnerType:"偏印",
    partnerDesc:"あなたの自由な表現と創造性を深いところで理解してくれる偏印タイプが最良のパートナーです。独自の感性と直感力を持ち、あなたのアイデアに知的な刺激を与えてくれます。創造的な世界観を共有し、共に独自の幸せを作り上げることができる相手です。",
    supportType:"正官",
    supportDesc:"あなたの創造的な才能を社会の中で正当に評価し、活躍の場を与えてくれる正官タイプが力になります。組織や社会の仕組みを理解した信頼ある人物があなたの才能を正しい場所に繋いでくれます。規律と誠実さを重んじる上司や権威ある人物との縁を大切にしましょう。"
  },
  "傷官":{
    nature:"鋭い感受性と独創的な才能を持ち、既存の枠にとらわれない自由な発想が特徴です。完璧主義的な面があり、妥協を許さない高い審美眼の持ち主です。権威や慣習に反抗する反骨精神があり、自分の信じる道を貫く強さがあります。",
    work:"仕事では芸術・音楽・文筆・デザイン・研究など、独創性を要する分野で卓越した才能を発揮します。規則や慣習に縛られた組織よりも、自由に発想を広げられる環境が向いています。技術職や専門職として深い知識を極めることで、他の追随を許さない域に達することができます。",
    love:"恋愛では理想が高く、妥協できない面があります。精神的な繋がりと知的な刺激を重視し、表面的な魅力よりも内面の深さに惹かれます。感情表現が独特なため、相手に真意が伝わりにくいことがありますが、一度心を開いた相手への愛情は深く純粋です。",
    partner:"あなたの独創性と反骨精神を面白いと感じ、知的に対等に語り合える人が最良です。批判せずにあなたの個性を丸ごと受け入れ、精神的な刺激を与え合えるような深い繋がりのある縁が幸せをもたらします。",
    support:"あなたの才能を見抜き、正しく評価してくれる目利きの人物が力になります。芸術的・専門的な分野での先輩や師匠、あなたの作品や能力を世に広めてくれるパトロン的な存在との縁を大切にしましょう。",
    mistake:"完璧主義と批判精神が強すぎて、周囲との摩擦を生みやすいことがリスクです。自分の基準を他者にも当てはめてしまい、関係がこじれることも。完璧でなくても前進することの大切さを受け入れることで、才能がより広く開花します。",
    guidance:"あなたの独創性は唯一無二の才能です。その才能を世に出す勇気を持ち、批判を恐れずに発表し続けることが重要です。完璧を目指しながらも、完成させることを優先する柔軟さを持つことで、あなたの作品は多くの人の心を動かします。",
    partnerType:"印綬",
    partnerDesc:"あなたの鋭い感性と完璧主義を温かく包み込む印綬タイプが最良のパートナーです。深い知性と包容力を持ち、あなたの批判精神を柔らかく受け止めてくれます。精神的な成長を互いに支え合い、学び合える知的な絆で結ばれた深い関係が幸せをもたらします。",
    supportType:"偏官",
    supportDesc:"あなたの鋭い才能と独創性を見抜き、挑戦の場を与えてくれる偏官タイプが運気を高めます。型破りなあなたの能力を恐れずに正面から評価し、実力が発揮できる環境を整えてくれます。強さと公正さを持つ人物との縁がキャリアの大きな転機をもたらすでしょう。"
  },
  "偏財":{
    nature:"行動力があり、ビジネス感覚に優れたバイタリティ溢れる性格です。社交的で人脈づくりが得意なため、多くの人との縁がチャンスをもたらします。お金と人の両方を動かすセンスがあり、大きなプロジェクトを推進する力があります。",
    work:"仕事では営業・貿易・不動産・投資・起業家など、広いフィールドで活動するビジネスに適性があります。デスクワークよりも外を駆け回るアクティブな仕事スタイルが向いており、人脈とチャンスを次々と引き寄せる嗅覚が強みです。",
    love:"恋愛では情熱的でアプローチも積極的ですが、移り気な面があり関係が長続きしにくいことも。本命の相手に対しては誠実に向き合う必要があります。仕事や趣味でも出会いが多く、異性から注目される機会が豊富です。",
    partner:"あなたの活発な行動力についてこられる、同じくエネルギッシュで行動的な人が良い相性です。一緒にビジネスや旅を楽しめるような、共通の目標や趣味を持てる活動的なパートナーとの縁が深いでしょう。",
    support:"あなたのビジネスセンスを認め、資金や機会を提供してくれる投資家・スポンサー・経営者との縁が力になります。お金と人脈を持つ実力者との交流が、あなたの夢を現実にする大きな後押しとなります。",
    mistake:"散財癖と計画性のなさがリスクです。チャンスを見つける嗅覚は鋭いですが、リスク管理が甘くなりがちです。大きな投資や決断の前には、財務的な計画を立て、専門家のアドバイスを求める習慣が大切です。",
    guidance:"あなたの行動力と人脈力は最強の武器です。ただし、量よりも質を意識し、本当に価値ある縁を育てることが長期的な成功につながります。財務管理を学び、稼いだお金を賢く運用することで、経済的な自由を手にすることができます。",
    partnerType:"食神",
    partnerDesc:"あなたの行動力と社交性に共鳴し、共に人生を楽しめる食神タイプが最良のパートナーです。表現力豊かで楽天的な性格があなたの冒険心を支え、共に新しい体験を積み重ねることができます。共通の趣味や目標を持ち、一緒に人生を謳歌できる相手が最高のパートナーです。",
    supportType:"比肩",
    supportDesc:"あなたのビジネスセンスを理解し、共に大きなビジョンを実現できる比肩タイプが最大の支援者です。対等な立場で切磋琢磨できる同世代のビジネスパートナーや仲間があなたの可能性を最大化します。互いの強みを認め合い、共に挑戦できる関係が運気を押し上げます。"
  },
  "正財":{
    nature:"誠実で責任感が強く、約束やルールを重んじる堅実な性格です。コツコツと積み上げる力があり、一攫千金よりも確かな積み重ねによる安定した豊かさを求めます。計画的で几帳面なため、財務管理や組織運営において高い能力を発揮します。",
    work:"仕事では経理・財務・法律・公務・管理職など、正確さと誠実さが求められる分野に適性があります。組織の中で信頼を積み重ねながら着実にキャリアアップするタイプで、長期的に見ると安定した地位と収入を得やすい運勢です。",
    love:"恋愛では慎重で一途な愛情を注ぐタイプです。軽いお付き合いよりも、将来を見据えた真剣な交際を好みます。誠実さが魅力であり、一度選んだ相手には深い愛情と責任感で向き合います。",
    partner:"誠実で家庭的な価値観を共有できる、信頼性の高い人が最良のパートナーです。派手さよりも安定と誠実さを重視する、あなたの価値観に共鳴できる堅実な人との縁が深く、温かい家庭を築けるでしょう。",
    support:"目上の人や組織の中の実力者からの評価と支援が力になります。上司や先輩に誠実に仕えることで、重要な場面での後ろ盾を得ることができます。地道な努力を認めてくれる理解者との縁を大切にしましょう。",
    mistake:"慎重すぎてチャンスを逃したり、変化を恐れて成長の機会を見送ることがリスクです。安全地帯に留まりすぎると、本来持っている可能性を活かしきれません。計算された上での思い切りある挑戦が、人生を大きく前進させます。",
    guidance:"あなたの誠実さと堅実さは、長い目で見ると最も確かな財産です。焦らず自分のペースで積み重ねることを大切にしながら、時には勇気を持って新しい一歩を踏み出すことで、安定と成長の両方を手にすることができます。",
    partnerType:"傷官",
    partnerDesc:"あなたの誠実さと堅実さを面白いと思い、新鮮な刺激を与えてくれる傷官タイプが最良のパートナーです。独創的な発想であなたの世界を広げ、堅実すぎるあなたに適度な変化をもたらしてくれます。安定の中に豊かな刺激を加えてくれる相手との縁が深く、人生を豊かに彩ります。",
    supportType:"偏官",
    supportDesc:"あなたの誠実さと堅実さを高く評価し、重要な役割を与えてくれる偏官タイプが力になります。実力主義で公正な評価をする上司や組織のリーダーとの縁が、あなたのキャリアを大きく前進させます。あなたの真摯な姿勢を正しく認めてくれる権限ある人物との関係を大切にしましょう。"
  },
  "偏官":{
    nature:"行動力と突破力があり、困難な状況でも怯まない強靭な精神の持ち主です。正義感が強く、不条理に対しては真っ向から立ち向かいます。リーダーシップがあり、危機的な状況で真価を発揮する強さがあります。",
    work:"仕事では軍・警察・医療・スポーツ・政治など、プレッシャーの中で力を発揮する分野に適性があります。困難なプロジェクトや危機管理など、他の人が尻込みするような状況でこそ真の能力が輝きます。強いリーダーシップで組織を牽引する力があります。",
    love:"恋愛では情熱的で刺激的な関係を求めます。穏やかすぎる関係よりも、互いに刺激し合えるダイナミックな恋愛を好みます。束縛を嫌い、自由を重視するため、パートナーにも同様の自立を求めます。",
    partner:"あなたの強さと情熱を受け止め、対等に向き合える精神的に強い人が良い相性です。あなたをコントロールしようとせず、自由を尊重しながらも心の芯がしっかりしたパートナーとの縁が幸せをもたらします。",
    support:"あなたの実力を正当に評価し、重要な仕事を任せてくれる力のある上司や組織が力になります。あなたの潜在能力を引き出してくれる、厳しくも公正な指導者との出会いが人生の転機となるでしょう。",
    mistake:"反骨精神が強すぎて、無用な争いを招くことがリスクです。正しいことでも伝え方を誤ると周囲との対立につながります。戦略的な思考を持ち、エネルギーを消耗する無駄な戦いを避けることで、本当に大切な目標に集中できます。",
    guidance:"あなたの強靭な精神力と行動力は、困難を乗り越えるための最大の武器です。その力を正しい目標に向け、戦略的に活かすことで、誰も達成できなかった偉業を成し遂げることができます。",
    partnerType:"比肩",
    partnerDesc:"あなたの強さと情熱を真正面から受け止め、対等に渡り合える比肩タイプが最良のパートナーです。同じ強さと信念を持ちながら、互いの自由を尊重できる精神的な強さがあります。ぶつかり合いながらも互いを高め合える、刺激的で深い絆の関係が幸せをもたらします。",
    supportType:"食神",
    supportDesc:"あなたの行動力と突破力を活かせる場を作り出してくれる食神タイプが支援者となります。クリエイティブな発想でチャンスを生み出し、あなたのエネルギーを最大限に活用できる環境を提供してくれます。楽天的で人脈豊富な人物との縁があなたに新しい世界の扉を開きます。"
  },
  "正官":{
    nature:"責任感が強く、ルールや秩序を重んじる誠実な性格です。組織の中で正しく評価され、社会的な地位を着実に築いていく力があります。礼儀正しく真面目な姿勢が周囲から信頼と尊敬を集めます。",
    work:"仕事では公務員・管理職・法律家・医師・教師など、社会的責任を担う職業に高い適性があります。組織の中でのルールを守り、着実にステップアップするタイプで、長期的には安定した地位と名声を得やすい運勢です。",
    love:"恋愛では真剣で責任ある関係を好みます。遊びの恋愛には興味がなく、将来を見据えた誠実な交際を求めます。社会的な評価や家柄を意識する傾向があり、パートナーの品格も重視します。",
    partner:"社会的にも人格的にも誠実で、礼儀をわきまえた品のある人が最良のパートナーです。互いの社会的な立場を尊重し合い、共に社会に貢献するような価値観を持てる相手との縁が深いでしょう。",
    support:"組織の上位者や社会的に影響力のある人物からの引き立てが力になります。あなたの誠実さと能力を評価してくれる権威ある人物との縁を大切にすることで、大きな機会が訪れます。",
    mistake:"完璧主義と責任感の強さから、自分にも他者にも厳しくなりすぎることがリスクです。失敗を許せない完璧主義が、チャレンジを萎縮させてしまうことも。完璧でなくても挑戦することの価値を認め、失敗から学ぶ姿勢が成長を加速させます。",
    guidance:"あなたの誠実さと責任感は社会における最大の財産です。その信頼性を活かして、より大きな責任を担う勇気を持つことで、社会的な影響力と満足感がさらに高まります。",
    partnerType:"劫財",
    partnerDesc:"あなたの規律と責任感を尊重しながら、情熱と行動力で活気を与えてくれる劫財タイプが最良のパートナーです。あなたが慎重になりすぎるときに背中を押してくれるエネルギッシュな相手です。社会的な責任を共に担いながら、互いの強みを活かし合える関係が理想です。",
    supportType:"印綬",
    supportDesc:"あなたの責任感と誠実さを深く評価し、重要な機会を与えてくれる印綬タイプが大きな力になります。豊かな学識と経験を持つ年長者や権威ある人物があなたの才能を社会の中で正しく位置づけてくれます。知識と品格を兼ね備えた指導者との縁が、あなたの社会的な地位を高めます。"
  },
  "偏印":{
    nature:"独創的な発想と鋭い直感を持ち、人とは異なる視点で世界を見る個性的な性格です。精神的な探求心が強く、スピリチュアルや哲学、学術など目に見えない世界への興味が深いです。マイペースで自分の世界を大切にします。",
    work:"仕事では研究・哲学・占術・芸術・教育・ITなど、独創性と深い思考を要する分野に適性があります。一つのことを徹底的に極める専門家として、他の追随を許さない域に達することができます。組織よりも独立した環境で真価を発揮します。",
    love:"恋愛では精神的な繋がりを最重視します。外見や条件よりも、魂レベルで共鳴できる相手を求めます。感情表現が内向きなため、想いが伝わりにくいことがありますが、深いところで繋がった相手との絆は非常に強固です。",
    partner:"あなたの独特な感性と深い内面世界を理解し、精神的に共鳴できる稀有な存在が最良のパートナーです。世間の常識よりも魂の声に従って相手を選ぶことで、本当に深い縁に出会えるでしょう。",
    support:"あなたの独創的な才能を見抜き、精神的・物質的に支えてくれる理解ある保護者的存在が力になります。親や恩師、あるいはスピリチュアルな師との深い縁が、あなたの才能を正しく育てる土壌となります。",
    mistake:"現実離れした思考や、気まぐれな行動が周囲との摩擦を生むことがリスクです。独自の世界に没入しすぎて、社会との接点を失うことも。定期的に現実の世界に意識を向け、地に足のついた行動と組み合わせることが大切です。",
    guidance:"あなたの独創的な発想力と直感は、時代を先取りする力を持っています。その才能を世の中に表現する方法を見つけ、継続的に発信し続けることで、多くの人の心に深い影響を与えることができます。",
    partnerType:"傷官",
    partnerDesc:"あなたの独創的な感性と深い内面世界を理解し、知的に対等に語り合える傷官タイプが最良のパートナーです。同じく独自の感性を持ち、お互いの世界観に刺激を与え合えます。精神的な共鳴と創造的なエネルギーを分かち合える、魂レベルで繋がった深い縁が幸せをもたらします。",
    supportType:"比肩",
    supportDesc:"あなたの独創的な世界観を理解し、同じ志で切磋琢磨できる比肩タイプが最大の支援者です。同じように独自の道を歩む同志との出会いが、孤独になりがちなあなたに勇気と方向性を与えます。互いの才能を認め合い、共に独自の世界を広げていける仲間との縁を大切にしましょう。"
  },
  "印綬":{
    nature:"学習能力が高く、知識を深めることに喜びを感じる知的な性格です。温厚で包容力があり、周囲から頼られる存在です。精神的な豊かさを大切にし、物質的な豊かさよりも心の充実を求めます。",
    work:"仕事では教育・学術・文筆・カウンセリング・宗教・医療など、人の精神面をサポートする分野に高い適性があります。深い知識と温かい人柄を活かして、多くの人の指導者・相談役として重宝される存在になります。",
    love:"恋愛では相手の内面的な成長を支援し、母性・父性的な愛情を注ぐ傾向があります。知的で精神的に豊かな相手に惹かれ、共に学び成長し合える関係を求めます。愛情深く、一度結んだ縁を大切に守り続けます。",
    partner:"あなたの知性と包容力を心から尊敬し、共に学び成長しようとする向上心のある人が最良のパートナーです。精神的な深みと誠実さを持ち、互いに人生の師となれるような関係が最も幸せをもたらします。",
    support:"学識ある人物や精神的な指導者、あるいは組織の中の実力者からの後ろ盾が力になります。あなたの知性と誠実さを高く評価してくれる目上の人との縁を大切にすることで、重要な場面での支援を受けられます。",
    mistake:"慎重すぎて行動が遅れることと、依存的になりすぎることがリスクです。完璧な準備が整うまで動けない傾向が機会損失につながることも。ある程度の準備ができたら行動に移す勇気と、自立した精神を保つことが大切です。",
    guidance:"あなたの深い知性と包容力は、多くの人の人生を豊かにする力を持っています。自分の学びを惜しみなく人と分かち合い、指導者・教育者としての才能を活かすことで、あなた自身も深い満足感と社会的な評価を得ることができます。",
    partnerType:"食神",
    partnerDesc:"あなたの深い知性と包容力を活かし、共に豊かな時間を楽しめる食神タイプが最良のパートナーです。楽天的で表現力豊かな相手があなたの世界に温かい彩りをもたらしてくれます。学びと楽しみを共有し、精神的にも感覚的にも満たされる豊かな関係が最高の幸せです。",
    supportType:"偏財",
    supportDesc:"あなたの知性と包容力を世に広め、実際の活動の場を与えてくれる偏財タイプが運気を高めます。広い人脈と行動力を持つ人物があなたの才能を必要としている人々へ繋いでくれます。ビジネスセンスと社交性を持つ人物との縁が、あなたの深い知恵を社会に届ける架け橋となります。"
  }
};


var GU={
  "木":{l:4,w:3,m:3,d:"木の気が強い年は、新しい芽が力強く伸びるような成長と発展の運気に包まれます。これまで温めてきたアイデアや夢を形にするのに絶好のタイミングです。学びへの意欲が自然と高まり、新しいスキルや知識の習得がその後の人生を大きく広げてくれるでしょう。人との出会いも豊かになる時期で、思いがけない縁が人生の転機をもたらすことがあります。積極的に外に出て、新しい環境に飛び込んでいくことが幸運を引き寄せる鍵です。"},
  "火":{l:5,w:4,m:3,d:"火の気が強い年は、まるで炎が勢いよく燃え上がるように情熱と活力があふれる時期です。特に恋愛運が高まり、新たな出会いや関係の深化が期待できます。自分の感情に正直に行動することで、望む未来が近づいてきます。社交的な活動が吉となるため、人と積極的に交わることで新しいチャンスが生まれやすい年です。情熱を持って行動したことが、予想以上の大きな結果をもたらすでしょう。"},
  "土":{l:3,w:4,m:5,d:"土の気が強い年は、大地が万物を育むように安定と着実さに満ちた運気が流れます。これまで蒔いてきた種が実を結ぶ収穫の時期であり、堅実な努力が確かな形となって現れてくるでしょう。金運が特に高まる年であり、財産の形成や資産管理において重要な決断をするのに適しています。焦らず自分のペースを守ることが、長期的な繁栄の鍵となります。"},
  "金":{l:3,w:5,m:4,d:"金の気が強い年は、鋭い刃のように決断力と行動力が研ぎ澄まされる時期です。仕事運が絶好調となり、これまでの努力が周囲に認められ、昇進や重要なプロジェクトへの抜擢など、キャリアの大きな転機が訪れやすい年です。重要な決断を迫られる場面が増えますが、その選択がその後の10年を決める分岐点となることも。信念を持って選んだ道が大きな成功へつながります。"},
  "水":{l:4,w:3,m:4,d:"水の気が強い年は、静かに深く流れる水のように知恵と柔軟性が増す時期です。直感力が格段に高まり、論理を超えたところで正しい選択ができるようになります。表面的には静かに見えても、内側では大きな変化が積み重なっている年です。新しいアイデアが次々と湧き出て、創造的な活動において優れた成果を発揮できます。流れに逆らわず、状況に柔軟に対応することが開運の秘訣です。"}
};

var DD={
  "木":"この10年は、若木が天へ向かって伸びるように成長と発展に満ちた充実の時期です。新しいことを始めるのに最適な10年であり、挑戦すればするほど実力と人脈が積み上がっていきます。学びへの意欲が自然と高まり、知識やスキルを磨くことで将来の大きな飛躍の土台が作られます。この時期に蒔いた種が、次の大運で大きく花開く可能性を秘めています。積極的に行動し、新しい縁を大切にすることで運気は最大化されます。",
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


var KSK={
  "甲":{t:["リーダー気質","向上心","正直"],d:"甲の人は大樹のようにまっすぐ上へと伸びていく力を持っています。強い向上心と正義感があり、周囲を引っ張るリーダーとして輝ける素質があります。曲がったことが嫌いで、一度決めたことを最後まで貫き通す芯の強さが人としての魅力です。困難な状況でも諦めずに前を向く姿が、多くの人から尊敬と信頼を集めるでしょう。自分の信念を大切にしながら、周囲への配慮も忘れないことが人生をさらに豊かにする鍵となります。何事にも真摯に取り組む姿勢と、高い目標を掲げ続ける向上心があなたの最大の武器です。"},
  "乙":{t:["柔軟性","協調性","粘り強さ"],d:"乙の人は草花のように柔軟にしなやかに生きる力を持っています。どんな環境にも適応できる柔軟性と、周囲との調和を大切にする協調性が最大の強みです。表面は穏やかでも内側には強い粘り強さを秘めており、一見控えめに見えてもどんな困難も乗り越えていく底力を持っています。人の感情を敏感に察する共感力の高さが、多くの人から愛される理由です。柔軟に状況に対応しながらも自分の軸をしっかり持ち続けることで、長期的に大きな成果を手にすることができます。"},
  "丙":{t:["明るさ","情熱","社交性"],d:"丙の人は太陽のように周囲を明るく照らす存在です。生まれながらの社交性と情熱で人を惹きつけ、その場を活気づける天性の才能を持っています。正直でオープンな性格が多くの人から愛される理由であり、どんな場所でも自然と中心的な存在になります。情熱的に物事に取り組む姿勢が周囲に活力を与え、一緒にいるだけで元気をもらえると感じさせる稀有な人物です。ネガティブな状況でも前向きさを失わない精神的な強さが、人生のあらゆる局面で大きな力となります。"},
  "丁":{t:["繊細","直感力","芸術性"],d:"丁の人はローソクの炎のように温かく繊細な感受性を持っています。直感力が鋭く、他の人が気づかない物事の本質を瞬時に見抜く洞察力に優れています。芸術的な才能に恵まれており、美しいものへの感受性が高く、創造的な分野で卓越した能力を発揮します。人の心の痛みに寄り添う深い共感力で、困っている人の心をそっと照らす存在です。繊細さがあるがゆえに傷つきやすい面もありますが、その感受性こそがあなたの最大の才能です。"},
  "戊":{t:["包容力","安定感","誠実"],d:"戊の人は大山のようにどっしりと構えた安定感と包容力を持っています。誠実で信頼できる性格が周囲から慕われ、困ったときに真っ先に頼りにされる存在です。変化よりも着実な積み重ねを好み、長期的な視点で物事を進める力があります。広い心で人を受け入れる包容力は、周囲の人たちに安心感と安らぎを与え、自然と人が集まってくる大きな魅力となっています。どんな状況でも揺るがない精神的な安定感が、周囲を支える大きな柱となっています。"},
  "己":{t:["現実的","細やか","努力家"],d:"己の人は豊かな大地のように周囲を育て支える力を持っています。現実的な判断力と細やかな気配りができ、コツコツと努力を積み重ねることで確かな結果を出し続けます。縁の下の力持ちとして組織を支える才能があり、地道な積み重ねが最終的に大きな成果につながります。人の細かな変化に気づける観察眼と、そっと手を差し伸べる優しさが周囲から厚く信頼される理由です。派手さはなくても着実に前進し続けるその姿勢が、長い目で見たときに最も大きな結果をもたらします。"},
  "庚":{t:["決断力","正義感","行動力"],d:"庚の人は研ぎ澄まされた刃のように鋭い決断力と正義感を持っています。白黒はっきりさせたい性格で、曖昧な状況を好まず常にクリアな方向性を求めます。強い行動力で目標に向かって突き進む力があり、困難な状況でもひるまない精神的な強さが持ち味です。ぶれない信念と素早い判断力が、周囲から頼りにされるリーダーシップにつながっています。正しいと思ったことを貫き通す強さが、あなたの最大の魅力です。"},
  "辛":{t:["完璧主義","美意識","知性"],d:"辛の人は磨かれた宝石のように美しい知性と洗練された美意識を持っています。完璧主義な一面があり、細部にまでこだわる質の高さが仕事や創造活動における強みです。高い審美眼と知的な魅力で周囲を引きつけ、センスの良さと聡明さが自然と人を魅了します。理想を高く持ち続けることで自己成長を続け、周囲からの評価も自然と高まっていくでしょう。完璧を求めるがゆえに自分を追い込みすぎることもありますが、その真摯な姿勢が最終的に輝かしい結果をもたらします。"},
  "壬":{t:["柔軟性","知恵","冒険心"],d:"壬の人は大海のように広大な懐と深い知恵を持っています。柔軟な思考力で状況に応じた最善策を見つけ出す能力があり、どんな困難も知恵で乗り越えていきます。冒険心旺盛で新しいことへのチャレンジを恐れないスケールの大きさが魅力です。固定観念にとらわれず自由な発想で物事を見る力が、周囲が思いつかないような革新的なアイデアを生み出す源になっています。大きな視野で物事を捉えることができるため、本質的な解決策を見出す力があります。"},
  "癸":{t:["感受性","思いやり","忍耐力"],d:"癸の人は静かに大地を潤す雨のように深い感受性と豊かな思いやりを持っています。人の痛みを自分のことのように感じられる共感力の高さが最大の魅力であり、困っている人の心に自然と寄り添える稀有な存在です。忍耐強く困難な状況でも諦めずに前進する力があり、その粘り強さが最終的に大きな実りをもたらします。静かに積み重ねてきたものが、やがて大きな花を咲かせるでしょう。深い感受性と思いやりが、出会う人すべての心を静かに癒していきます。"}
};

var SSK={
  "子":{t:["知性","行動力","好奇心"],d:"子（ね）の人は頭の回転が速く、好奇心旺盛で何事にも積極的に取り組む活力があります。行動力があり新しいことへの挑戦を恐れない柔軟な精神が、次々と新しい可能性を切り開いていきます。知識を吸収するスピードが速く、様々な分野で幅広い才能を発揮します。変化に素早く適応できるため、時代の変化にも柔軟に対応し、新しい波を上手に乗りこなすことができるでしょう。好奇心の赴くままに学び続けることが、あなたの可能性を無限に広げていきます。"},
  "丑":{t:["粘り強さ","誠実","堅実"],d:"丑（うし）の人は牛のように粘り強く誠実に物事を積み重ねる力を持っています。着実に一歩一歩進む堅実さが最大の強みであり、長期的な視野で努力を続けることで確かな成功を手にします。誠実さと信頼感が周囲から厚く評価され、時間をかけて築いた人間関係が人生の大きな財産になるでしょう。ゆっくりでも確実に前進することで、他の人が諦めてしまうような困難な目標も達成することができます。"},
  "寅":{t:["勇気","リーダーシップ","情熱"],d:"寅（とら）の人は虎のように勇気あふれるリーダーシップを持っています。情熱的に目標に向かって突き進む力があり、その行動力と決断力が周囲を自然と引っ張っていきます。困難な状況でも逃げずに立ち向かう勇気が、多くの人から尊敬を集める最大の魅力です。大きな夢を持ち、それを実現するための行動を惜しまない姿勢が輝いています。あなたの情熱と行動力に触発されて周囲も奮い立つことができます。"},
  "卯":{t:["穏やか","社交性","センス"],d:"卯（う）の人は兎のように穏やかで社交的な魅力があります。優れた感性とセンスで周囲を和ませる天性の才能を持っており、自然と人が集まってくる温かな人柄が魅力です。争いを好まず調和を大切にする姿勢が、幅広い人間関係を築く力となります。その穏やかな存在感が荒立った心を静め、周囲の人間関係を円滑にするバランサーとしての才能を持っています。"},
  "辰":{t:["カリスマ","向上心","独創性"],d:"辰（たつ）の人は龍のように天性のカリスマ性と強い向上心を持っています。独創的な発想と大胆な行動力で周囲を驚かせ、常に新しい価値を生み出していきます。高い目標を掲げ、それに向かって情熱的に突き進む姿が周囲に感動と刺激を与えます。スケールの大きな夢を描き、その実現に向けて力強く歩み続ける存在感が圧倒的な魅力です。"},
  "巳":{t:["知恵","洞察力","粘り強さ"],d:"巳（み）の人は蛇のように深い知恵と鋭い洞察力を持っています。物事の本質を静かに見極める力があり、表面だけでなく深いところまで理解する知性が強みです。粘り強く目標を追い続ける忍耐力があり、諦めないことで最終的に必ず結果を手にします。慎重に状況を分析しながら最善のタイミングで動く判断力が、人生のあらゆる場面で活きてきます。"},
  "午":{t:["明るさ","情熱","行動力"],d:"午（うま）の人は馬のように明るく情熱的なエネルギーが溢れています。素早い行動力と天性のポジティブさで周囲を活気づけ、その場の雰囲気を一変させる力があります。新しいことへの挑戦を楽しめる前向きな姿勢が、次々と新しいチャンスを引き寄せます。どんな困難な状況でも明るさを失わないポジティブさが、周囲の人々に勇気と希望をもたらします。"},
  "未":{t:["温かさ","芸術性","協調性"],d:"未（ひつじ）の人は羊のように温かく芸術的な感性が豊かです。協調性があり周囲と調和しながら物事を進める力が、チームの中で重要な役割を果たします。美しいものへの感受性が高く、芸術や創造的な分野での才能を持っています。その繊細な感性と温かな人柄が、周囲の人たちの心を癒し、人間関係に豊かな彩りをもたらします。"},
  "申":{t:["機転","多才","社交性"],d:"申（さる）の人は猿のように機転が利き多才で、高い社交性を持っています。様々な分野で才能を発揮できる柔軟性があり、新しい状況にも素早く適応する力が強みです。幅広い人脈を築く社交性と、その場に応じた機転の良さが、ビジネスでも私生活でも大きなアドバンテージになります。その場の空気を素早く読み、最適な言葉や行動を選べる洗練されたコミュニケーション力が魅力です。"},
  "酉":{t:["完璧主義","美意識","誠実"],d:"酉（とり）の人は美意識が高く誠実さが際立つ完璧主義者です。細部にまでこだわる精緻さと、高い基準を持って物事に取り組む姿勢が周囲から高く評価されます。誠実な人柄と一度決めたことをやり遂げる責任感の強さが、長期的な信頼関係を築く力となります。誠実さと美意識を兼ね備えたあなたの個性が、周囲に信頼と感動を与え続けます。"},
  "戌":{t:["忠実","正義感","誠実"],d:"戌（いぬ）の人は犬のように忠実で正義感が強く、誠実さが際立ちます。一度信頼を置いた人に対して揺るぎない誠実さで接し、その信頼に応え続ける責任感の強さが最大の魅力です。正しいことに対しては妥協しない強い正義感があり、その公平さと誠実さで周囲から深く頼りにされます。友情と人間関係を何よりも大切にする温かな心が、生涯の絆を育みます。"},
  "亥":{t:["粘り強さ","直感力","誠実"],d:"亥（い）の人は猪のように強い粘り強さと優れた直感力を持っています。一度決めたことを最後まで諦めない不屈の精神が、どんな困難も乗り越える力の源です。誠実な姿勢で人と向き合い、その真摯さが周囲から深い信頼を獲得します。鋭い直感力で物事の本質を捉える力があり、その判断を信じて行動することで正しい方向へ進むことができます。"}
};



// ===== 決済トークン管理 =====
var SC_GAS_URL = "https://script.google.com/macros/s/AKfycbxFjlFuVsLislzDc_qDcAuxuJ-BsQhExNYCx2Gz47EcdoN6S3Ymqcy4YI6u__2eETwY/exec";
var SC_STRIPE_URL = "https://buy.stripe.com/bJe8wJ4O12evf6ffKBes004";
var scPaid = false;

function scCheckToken() {
  var params = new URLSearchParams(window.location.search);
  var token = params.get("token_sc");
  if (!token) {
    // localStorageから復元
    token = localStorage.getItem("sc_token");
  }
  if (!token) return Promise.resolve(false);
  localStorage.setItem("sc_token", token);
  return new Promise(function(resolve) {
    var script = document.createElement("script");
    var cb = "scTokenCb_" + Date.now();
    window[cb] = function(res) {
      document.head.removeChild(script);
      delete window[cb];
      if (res && res.status === "ok") {
        scPaid = true;
        resolve(true);
      } else {
        resolve(false);
      }
    };
    script.src = SC_GAS_URL + "?sc_token=" + encodeURIComponent(token) + "&callback=" + cb;
    document.head.appendChild(script);
    setTimeout(function() { resolve(false); }, 5000);
  });
}

// ページ読み込み時にトークン確認・決済完了後は自動鑑定
scCheckToken().then(function(paid) {
  if (paid) {
    scPaid = true;
    // 決済完了後（URLにpaid_sc=1がある場合）は保存データで自動鑑定
    var params = new URLSearchParams(window.location.search);
    if(params.get("paid_sc") === "1"){
      var savedBv = localStorage.getItem("sc_last_birthday");
      var savedG = localStorage.getItem("sc_last_gender");
      if(savedBv){
        document.getElementById("scBirthday").value = savedBv;
        if(savedG !== null) scSetGender(parseInt(savedG));
        setTimeout(function(){ scDiagnose(); }, 500);
      }
    }
  }
});

function scGetPaywallHTML(nextYear, nextNextYear) {
  var y1 = nextYear || (new Date().getFullYear() + 1);
  var y2 = nextNextYear || (new Date().getFullYear() + 2);
  return "<div class=\"sc-paywall\">"
    + "<div class=\"sc-paywall-lock\">🔒</div>"
    + "<div class=\"sc-paywall-title\">続きを読むには購入が必要です</div>"
    + "<div class=\"sc-paywall-list\">"
    + "<div class=\"sc-paywall-item\">✦ 最良のパートナー像（詳細）</div>"
    + "<div class=\"sc-paywall-item\">✦ 大運（現在以降の全期間）</div>"
    + "<div class=\"sc-paywall-item\">✦ 流年の詳細運勢（"+y1+"年、"+y2+"年）</div>"
    + "</div>"
    + "<div class=\"sc-paywall-price\">¥500 <span>（税込）</span></div>"
    + "<a href=\"https://buy.stripe.com/bJe8wJ4O12evf6ffKBes004\" class=\"sc-paywall-btn\" target=\"_blank\">💳 500円で続きを読む</a>"
    + "<div class=\"sc-paywall-note\">※ クレジットカード決済（Stripe）｜安全・即時閲覧可能</div>"
    + "</div>";
}

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
  // 鑑定情報をlocalStorageに保存（決済後の自動復元用）
  localStorage.setItem("sc_last_birthday", bv);
  localStorage.setItem("sc_last_gender", String(scG));
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

    // 十神計算
    var jsNen=nc?calcJussin(dc.ki,nc.ki):null;
    var jsMon=mc?calcJussin(dc.ki,mc.ki):null;
    var jsJi=tc?calcJussin(dc.ki,tc.ki):null;
    // 月干が主要な十神（才能・社会性を示す）
    var mainJs=jsMon||jsNen||"比肩";
    var jsData=JSCOMMENT[mainJs]||JSCOMMENT["比肩"];

    var ps2=[nc,mc,dc,tc];
    var gc=scCountG(ps2);
    var gv=Object.values(gc);
    var mg=Math.max.apply(null,gv);
    var tg=gv.reduce(function(a,b){return a+b;},0);

    var dr=calcDaiun(bd,nc,scG);
    var sa=dr.sa,dl=dr.list,ci=0;
    for(var di=0;di<dl.length;di++){if(age>=dl[di].age&&(di===dl.length-1||age<dl[di+1].age)){ci=di;break;}}

    var ty=td.getFullYear();
    var rl=[ty,ty+1,ty+2].map(function(yr){var k=scGetYear(yr,3,1);return {k:k.k,s:k.s,ki:k.ki,si:k.si,y:yr};});


    var mk=KSK[dc.k],ms=SSK[dc.s];
    var dg=Object.keys(gc).reduce(function(a,b){return gc[a]>=gc[b]?a:b;});

    var rs=rl.map(function(r){var g=KG[r.ki];var b=GU[g];return {l:b.l,w:b.w,m:b.m,d:b.d,g:g,k:r.k,s:r.s,y:r.y};});

    function st(n){return "★".repeat(n)+"☆".repeat(5-n);}
    function bw(n){return (n/5*100)+"%";}

    // 五行バー（星表示）
    var gbh="";
    ["木","火","土","金","水"].forEach(function(g){
      var cnt=gc[g];
      var maxStar=6;
      var starCnt=mg>0 ? Math.round(cnt/mg*maxStar) : 0;
      var stars="";
      for(var si2=0;si2<starCnt;si2++)stars+="★";
      for(var si3=starCnt;si3<maxStar;si3++)stars+="☆";
      gbh+="<div class=\"gogyo-bar-row\">"
        +"<div class=\"gogyo-bar-label\">"+GE[g]+" "+g+"</div>"
        +"<div class=\"gogyo-bar-wrap\"><div class=\"gogyo-bar-fill\" style=\"width:"+(tg?cnt/mg*100:0)+"%;background:"+GB[g]+";\"></div></div>"
        +"<div style=\"font-size:0.8rem;color:"+GB[g]+";white-space:nowrap;flex-shrink:0;margin-left:6px;\">"+stars+"</div>"
        +"</div>";
    });

    // 大運HTML
    var dh="";
    var daiuPaywallShown=false;
    dl.forEach(function(dd,i){
      var g=KG[dd.ki],ic=i===ci;
      var isCurrentOrFuture=(i>=ci);
      if(isCurrentOrFuture && !scPaid){
        if(ic){
          // 現在の大運：ぼかし表示
          dh+="<div class=\"daiu-item daiu-current\" style=\"position:relative;\">"
            +"<div style=\"filter:blur(4px);pointer-events:none;user-select:none;\">"
            +"<div class=\"daiu-age\">"+dd.age+"〜"+(dd.age+9)+"歳<br><strong style=\"color:var(--accent)\">▶ 現在</strong></div>"
            +"<div class=\"daiu-kan\"><span class=\"meishiki-gogyo "+GC[g]+"\" style=\"font-size:0.7rem;\">"+g+"</span><br>"+dd.k+dd.s+"</div>"
            +"<div class=\"daiu-desc\">"+DD[g].substring(0,30)+"...</div>"
            +"</div>"
            +"</div>";
        }
        if(!daiuPaywallShown){
          dh+=scGetPaywallHTML(ty+1,ty+2);
          daiuPaywallShown=true;
        }
        return;
      }
      dh+="<div class=\"daiu-item"+(ic?" daiu-current":"")+"\"><div class=\"daiu-age\">"+dd.age+"〜"+(dd.age+9)+"歳"+(ic?"<br><strong style=\"color:var(--accent)\">▶ 現在</strong>":"")+"</div>"
        +"<div class=\"daiu-kan\"><span class=\"meishiki-gogyo "+GC[g]+"\" style=\"font-size:0.7rem;\">"+g+"</span><br>"+dd.k+dd.s+"</div>"
        +"<div class=\"daiu-desc\">"+DD[g]+"</div></div>";
    });

    // 流年カード
    var rch="";
    rs.forEach(function(r,i){
      rch+="<div class=\"ryunen-card"+(i===0?" ryunen-current":"")+"\"><div class=\"ryunen-year\">"+r.y+"年"+(i===0?"（今年）":i===1?"（来年）":"（再来年）")+"</div>"
        +"<div class=\"ryunen-kan\">"+r.k+r.s+"</div>"
        +"<div style=\"margin-top:4px\"><span class=\"meishiki-gogyo "+GC[r.g]+"\" style=\"font-size:0.68rem;\">"+r.g+"</span></div></div>";
    });

    // 流年詳細
    var rdh="";
    rs.forEach(function(r,i){
      if(i===0){
        // 今年：全表示
        rdh+="<div class=\"sc-section\"><h3>"+r.y+"年（今年）"+r.k+r.s+"年の運勢</h3>"
          +"<p class=\"sc-desc\" style=\"margin-bottom:12px;\">"+r.d+"</p>"
          +"<div class=\"ryunen-detail\">"
          +"<div class=\"ryunen-row\"><span class=\"ryunen-label\">❤️ 恋愛運</span><div class=\"ryunen-bar-wrap\"><div class=\"ryunen-bar\" style=\"width:"+bw(r.l)+"\"></div></div><span class=\"ryunen-stars\">"+st(r.l)+"</span></div>"
          +"<div class=\"ryunen-row\"><span class=\"ryunen-label\">💼 仕事運</span><div class=\"ryunen-bar-wrap\"><div class=\"ryunen-bar\" style=\"width:"+bw(r.w)+"\"></div></div><span class=\"ryunen-stars\">"+st(r.w)+"</span></div>"
          +"<div class=\"ryunen-row\"><span class=\"ryunen-label\">💰 金　運</span><div class=\"ryunen-bar-wrap\"><div class=\"ryunen-bar\" style=\"width:"+bw(r.m)+"\"></div></div><span class=\"ryunen-stars\">"+st(r.m)+"</span></div>"
          +"</div></div>";
      } else if(i===1 && !scPaid){
        // 来年：冒頭のみ表示してペイウォール
        var preview=r.d.substring(0,60)+"...";
        rdh+="<div class=\"sc-section\"><h3>"+r.y+"年（来年）"+r.k+r.s+"年の運勢</h3>"
          +"<p class=\"sc-desc\" style=\"margin-bottom:12px;filter:blur(0px)\">"+preview+"</p>"
          +"<div class=\"sc-blur-content\" style=\"filter:blur(3px);pointer-events:none;user-select:none;opacity:0.5;\">"
          +"<div class=\"ryunen-detail\">"
          +"<div class=\"ryunen-row\"><span class=\"ryunen-label\">❤️ 恋愛運</span><div class=\"ryunen-bar-wrap\"><div class=\"ryunen-bar\" style=\"width:"+bw(r.l)+"\"></div></div><span class=\"ryunen-stars\">"+st(r.l)+"</span></div>"
          +"<div class=\"ryunen-row\"><span class=\"ryunen-label\">💼 仕事運</span><div class=\"ryunen-bar-wrap\"><div class=\"ryunen-bar\" style=\"width:"+bw(r.w)+"\"></div></div><span class=\"ryunen-stars\">"+st(r.w)+"</span></div>"
          +"<div class=\"ryunen-row\"><span class=\"ryunen-label\">💰 金　運</span><div class=\"ryunen-bar-wrap\"><div class=\"ryunen-bar\" style=\"width:"+bw(r.m)+"\"></div></div><span class=\"ryunen-stars\">"+st(r.m)+"</span></div>"
          +"</div></div>"
          +scGetPaywallHTML(ty+1,ty+2)
          +"</div>";
      } else if(scPaid){
        // 購入済み：全表示
        rdh+="<div class=\"sc-section\"><h3>"+r.y+"年（"+(i===1?"来年":"再来年")+"）"+r.k+r.s+"年の運勢</h3>"
          +"<p class=\"sc-desc\" style=\"margin-bottom:12px;\">"+r.d+"</p>"
          +"<div class=\"ryunen-detail\">"
          +"<div class=\"ryunen-row\"><span class=\"ryunen-label\">❤️ 恋愛運</span><div class=\"ryunen-bar-wrap\"><div class=\"ryunen-bar\" style=\"width:"+bw(r.l)+"\"></div></div><span class=\"ryunen-stars\">"+st(r.l)+"</span></div>"
          +"<div class=\"ryunen-row\"><span class=\"ryunen-label\">💼 仕事運</span><div class=\"ryunen-bar-wrap\"><div class=\"ryunen-bar\" style=\"width:"+bw(r.w)+"\"></div></div><span class=\"ryunen-stars\">"+st(r.w)+"</span></div>"
          +"<div class=\"ryunen-row\"><span class=\"ryunen-label\">💰 金　運</span><div class=\"ryunen-bar-wrap\"><div class=\"ryunen-bar\" style=\"width:"+bw(r.m)+"\"></div></div><span class=\"ryunen-stars\">"+st(r.m)+"</span></div>"
          +"</div></div>";
      }
    });

    // 十神セクション（5項目）
    var jsHtml="<div class=\"sc-section\"><h3>✦ あなたの才能・魂の目的（"+mainJs+"） ✦</h3>"
      +"<p class=\"sc-desc\">"+jsData.nature+"</p>"
      +"<p class=\"sc-desc\" style=\"margin-top:10px;\">"+jsData.work+"</p></div>"
      +"<div class=\"sc-section\"><h3>✦ 恋愛傾向とパートナー像 ✦</h3>"
      +"<p class=\"sc-desc\">"+jsData.love+"</p>"
      +"<p class=\"sc-desc\" style=\"margin-top:14px;font-weight:700;color:var(--primary);\">最良のパートナー像</p>"
      +(scPaid
        ? "<div class=\"sc-tag-wrap\" style=\"margin:8px 0;\"><span class=\"sc-tag\" style=\"background:linear-gradient(135deg,rgba(201,166,147,0.3),rgba(231,211,168,0.4));\">"+jsData.partnerType+"</span></div>"
          +"<p class=\"sc-desc\">"+jsData.partnerDesc+"</p>"
        : "<div class=\"sc-blur-wrap\">"
          +"<div class=\"sc-blur-content\"><p class=\"sc-desc\">"+jsData.partnerDesc.substring(0,30)+"...</p></div>"
          +scGetPaywallHTML()
          +"</div>"
      )
      +"</div>"
      +"<div class=\"sc-section\"><h3>✦ あなたの運気を高める重要人物 ✦</h3>"
      +"<div class=\"sc-tag-wrap\" style=\"margin:0 0 10px;\"><span class=\"sc-tag\" style=\"background:linear-gradient(135deg,rgba(201,166,147,0.3),rgba(231,211,168,0.4));\">"+jsData.supportType+"</span></div>"
      +"<p class=\"sc-desc\">"+jsData.supportDesc+"</p></div>"
      +"<div class=\"sc-section\"><h3>✦ 運勢の流れとあなたへの指針 ✦</h3>"
      +"<p class=\"sc-desc\">"+jsData.guidance+"</p></div>"
      +"<div class=\"sc-section\"><h3>✦ 起こしやすいミスと解決方法 ✦</h3>"
      +"<p class=\"sc-desc\">"+jsData.mistake+"</p></div>";

    res.innerHTML="<div class=\"sc-title-block\"><div class=\"sc-name\">"+y+"年"+m+"月"+d+"日生まれ</div>"
      +"<div class=\"sc-sub\">"+(scG===0?"男性":"女性")+"・"+age+"歳の命式鑑定</div></div>"
      +"<div class=\"sc-section\"><h3>✦ 命式（四柱） ✦</h3>"
      +"<table class=\"meishiki-table\"><tr><th>年柱</th><th>月柱</th><th>日柱（主星）</th><th>時柱</th></tr>"
      +"<tr>"+scPillar(nc)+scPillar(mc)+scPillar(dc)+scPillar(tc)+"</tr>"
      +"<tr><td style=\"font-size:0.7rem;color:var(--text-sub);\">"+jsNen+"</td>"
      +"<td style=\"font-size:0.7rem;color:var(--text-sub);\">"+jsMon+"</td>"
      +"<td style=\"font-size:0.7rem;color:var(--primary);font-weight:700;\">日主</td>"
      +"<td style=\"font-size:0.7rem;color:var(--text-sub);\">"+( jsJi||"─")+"</td></tr>"
      +"</table>"
      +(!tc?"<p style=\"font-size:0.75rem;color:var(--text-sub);text-align:center;margin-top:10px;\">出生時刻で時柱も鑑定できます</p>":"")
      +"</div>"
      +"<div class=\"sc-section\"><h3>✦ 五行バランス ✦</h3><div class=\"gogyo-bars\">"+gbh+"</div>"
      +"<p class=\"sc-desc\" style=\"margin-top:12px;\">"+GE[dg]+dg+"の気が最も強く、あなたの人生の中心的なエネルギーとなっています。このエネルギーを理解し活かすことで、持って生まれた才能が最大限に開花します。</p></div>"
      +"<div class=\"sc-section\"><h3>✦ 基本性格・才能（日干："+dc.k+"） ✦</h3>"
      +"<div class=\"sc-tag-wrap\">"+mk.t.map(function(t){return "<span class=\"sc-tag\">"+t+"</span>";}).join("")+"</div>"
      +"<p class=\"sc-desc\">"+mk.d+"</p></div>"
      +"<div class=\"sc-section\"><h3>✦ 日支（"+dc.s+"）からみる気質・恋愛観 ✦</h3>"
      +"<div class=\"sc-tag-wrap\">"+ms.t.map(function(t){return "<span class=\"sc-tag\">"+t+"</span>";}).join("")+"</div>"
      +"<p class=\"sc-desc\">"+ms.d+"</p></div>"
      +jsHtml
      +"<div class=\"sc-section\"><h3>✦ 大運（10年サイクル） ✦</h3>"
      +"<p class=\"sc-desc\" style=\"margin-bottom:12px;\">"+sa+"歳から大運が始まります。10年ごとに運気の大きな流れが変わります。</p>"
      +"<div class=\"daiu-list\">"+dh+"</div></div>"
      +"<div class=\"sc-section\"><h3>✦ 流年（年ごとの運気） ✦</h3><div class=\"ryunen-grid\">"+rch+"</div></div>"+rdh
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
