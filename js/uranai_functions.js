/* uranai-script-start */
const signImages = {};




// 月の星座・守護星・数秘術
const moonSigns=["♈おひつじ座","♉おうし座","♊ふたご座","♋かに座","♌しし座","♍おとめ座","♎てんびん座","♏さそり座","♐いて座","♑やぎ座","♒みずがめ座","♓うお座"];
const dayGuardians={0:"☀️ 太陽の日（日曜）",1:"🌙 月の日（月曜）",2:"🔴 火星の日（火曜）",3:"☿ 水星の日（水曜）",4:"♃ 木星の日（木曜）",5:"♀ 金星の日（金曜）",6:"♄ 土星の日（土曜）"};

function getMoonSign(d){
  const base=new Date(2000,0,1);
  const diff=Math.floor((d-base)/(1000*60*60*24));
  const idx=Math.floor((diff%354)/29.5*12)%12;
  return "月は"+ moonSigns[(idx+Math.floor(diff/365))%12]+"通過中";
}
function getNumerology(d){
  const s=`${d.getFullYear()}${d.getMonth()+1}${d.getDate()}`;
  let n=s.split('').reduce((a,b)=>a+parseInt(b),0);
  while(n>9&&n!==11&&n!==22) n=String(n).split('').reduce((a,b)=>a+parseInt(b),0);
  return `本日の数字【${n}】`;
}
function updateAstroBar(){
  const t=new Date();
  document.getElementById('moonSign').textContent=getMoonSign(t);
  document.getElementById('dayGuardian').textContent=dayGuardians[t.getDay()];
  document.getElementById('dayNumber').textContent=getNumerology(t);
}

// 日付からday_of_yearを計算
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay) - 1; // 0-indexed
}

// 今日・明日のデータを取得
function getFortuneData(tab) {
  const today = new Date();
  const targetDate = tab === 'today' ? today : new Date(today.getTime() + 86400000);
  const doy = getDayOfYear(targetDate);
  const idx = ((doy % 365) + 365) % 365;
  return fortuneDB[idx] || fortuneDB[0];
}


// 星座画像ヘルパー
function getSignImg(sign, size='normal') {
  return ''; // キャラ画像なし
}
function getNumerology(d){
  const s=`${d.getFullYear()}${d.getMonth()+1}${d.getDate()}`;
  let n=s.split('').reduce((a,b)=>a+parseInt(b),0);
  while(n>9&&n!==11&&n!==22) n=String(n).split('').reduce((a,b)=>a+parseInt(b),0);
  return `本日の数字【${n}】`;
}
function updateAstroBar(){
  const t=new Date();
  document.getElementById('moonSign').textContent=getMoonSign(t);
  document.getElementById('dayGuardian').textContent=dayGuardians[t.getDay()];
  document.getElementById('dayNumber').textContent=getNumerology(t);
}

// 星座判定
const signRanges=[
  {sign:"やぎ座",m1:12,d1:22,m2:12,d2:31},
  {sign:"みずがめ座",m1:1,d1:20,m2:2,d2:18},
  {sign:"うお座",m1:2,d1:19,m2:3,d2:20},
  {sign:"おひつじ座",m1:3,d1:21,m2:4,d2:19},
  {sign:"おうし座",m1:4,d1:20,m2:5,d2:20},
  {sign:"ふたご座",m1:5,d1:21,m2:6,d2:21},
  {sign:"かに座",m1:6,d1:22,m2:7,d2:22},
  {sign:"しし座",m1:7,d1:23,m2:8,d2:22},
  {sign:"おとめ座",m1:8,d1:23,m2:9,d2:22},
  {sign:"てんびん座",m1:9,d1:23,m2:10,d2:23},
  {sign:"さそり座",m1:10,d1:24,m2:11,d2:22},
  {sign:"いて座",m1:11,d1:23,m2:12,d2:21},
  {sign:"やぎ座",m1:12,d1:22,m2:1,d2:19}
];
function getSign(dateStr){
  const d=new Date(dateStr),m=d.getMonth()+1,day=d.getDate();
  for(const r of signRanges){
    if((m===r.m1&&day>=r.d1)||(m===r.m2&&day<=r.d2)) return r.sign;
  }
  return null;
}

// 現在タブ
let currentTab='today';
// 生年月日を保持する変数
let myBirthday = null;

// 入力切替
function switchInput(el,type){
  document.querySelectorAll('.input-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.input-panel').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('panel-'+type).classList.add('active');
}

function checkByBirthday(){
  const val=document.getElementById('birthdayInput').value;
  if(!val){alert('生年月日を入力してください');return;}
  const sign=getSign(val);
  if(!sign){alert('星座を判定できませんでした');return;}
  myBirthday = val;
  showMyResult(sign);
  // バイオリズムでランキング再構築
  rebuildRankingByBio(val);
}
function checkBySign(){
  const sign=document.getElementById('signSelect').value;
  if(sign) showMyResult(sign);
}
// 現在表示中の星座名を保持
let myCurrentSign = null;

function showMyResult(sign, scroll=true){
  const data=getFortuneData(currentTab).find(d=>d.sign===sign);
  if(!data) return;
  myCurrentSign=sign;
  document.getElementById('myEmoji').textContent=data.emoji;
  document.getElementById('mySignName').textContent=data.sign;
  document.getElementById('myRankNum').textContent=data.rank;
  document.getElementById('mySummary').textContent=data.summary;
  const el=document.getElementById('myResult');
  el.classList.add('show');
  if(scroll) el.scrollIntoView({behavior:'smooth',block:'center'});
}

function openMyModal(){
  if(myCurrentSign) openModal(myCurrentSign, currentTab);
}

// タブ切替
function switchTab(el,tab){
  currentTab=tab;
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.ranking-panel').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('panel-'+tab).classList.add('active');
  // TOP結果カードが表示中なら、新タブのデータで更新する
  if(myCurrentSign){
    showMyResult(myCurrentSign, false);
  }
}

// ランキング描画（通常版）
function renderRanking(tab){
  const panel=document.getElementById('panel-'+tab);
  panel.innerHTML=getFortuneData(tab).map(d=>`
    <div class="rank-item" onclick="openModal('${d.sign}','${tab}')">
      <div class="rank-badge ${d.rank<=3?'r'+d.rank:'other'}">${
  d.rank+'位'
}</div>
      <div class="sign-icon">${d.emoji}</div>
      <div class="rank-content">
        <div class="rank-name">${d.sign}</div>
        <div class="rank-date">${d.range}</div>
        <div class="rank-summary">${d.summary}</div>
      </div>
      <div class="read-more">続きを読む ›</div>
    </div>
  `).join('');
}

// モーダル
function openModal(sign,tab){
  const data=getFortuneData(tab).find(d=>d.sign===sign);
  if(!data) return;
  const today=new Date();
  const targetDate=tab==='today'?today:new Date(today.getTime()+86400000);
  const label=tab==='today'?'今日':'明日';

  document.getElementById('modalEmoji').textContent=data.emoji;
  document.getElementById('modalName').textContent=data.sign;
  document.getElementById('modalRankNum').textContent=data.rank;
  document.getElementById('modalRankLabel').textContent=`位 / ${label}の全体運`;
  document.getElementById('modalAstro').innerHTML=
    `<span>🌙 ${getMoonSign(targetDate)}</span>`+
    `<span>⭐ ${dayGuardians[targetDate.getDay()]}</span>`+
    `<span>🔢 ${getNumerology(targetDate)}</span>`;
  document.getElementById('modalOverall').textContent=data.overall;
  document.getElementById('loveStars').innerHTML=makeStars(data.love.stars);
  document.getElementById('loveComment').textContent=data.love.comment;
  document.getElementById('workStars').innerHTML=makeStars(data.work.stars);
  document.getElementById('workComment').textContent=data.work.comment;
  document.getElementById('moneyStars').innerHTML=makeStars(data.money.stars);
  document.getElementById('moneyComment').textContent=data.money.comment;
  document.getElementById('luckyColor').textContent=data.lucky_color;
  document.getElementById('luckyItem').textContent=data.lucky_item;
  document.getElementById('luckyDir').textContent=data.lucky_dir;
  document.getElementById('luckyPlace').textContent=data.lucky_place;
  document.getElementById('luckyNum').textContent=data.lucky_num;
  document.getElementById('actionText').textContent=data.action;

  document.getElementById('modalOverlay').classList.add('show');
  document.body.style.overflow='hidden';
}
function makeStars(n){
  return Array.from({length:5},(_,i)=>
    `<span class="star ${i<n?'on':'off'}">${i<n?'★':'☆'}</span>`
  ).join('');
}
function closeModalOutside(e){
  if(e.target===document.getElementById('modalOverlay')) closeModal();
}
function closeModal(){
  document.getElementById('modalOverlay').classList.remove('show');
  document.body.style.overflow='';
}


// 黒背景を除去してcanvasのdata URLに変換
function removeBlackBg(imgEl, threshold=40) {
  try {
    const c = document.createElement('canvas');
    c.width = imgEl.naturalWidth || imgEl.width;
    c.height = imgEl.naturalHeight || imgEl.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(imgEl, 0, 0, c.width, c.height);
    const data = ctx.getImageData(0, 0, c.width, c.height);
    const d = data.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] < threshold && d[i+1] < threshold && d[i+2] < threshold) {
        d[i+3] = 0; // 黒ピクセルを透明に
      }
    }
    ctx.putImageData(data, 0, 0);
    return c.toDataURL('image/png');
  } catch(e) { return null; }
}

// img要素に黒背景除去を適用
function applyRemoveBg(imgEl) {
  if (!imgEl || imgEl.dataset.bgRemoved) return;
  const apply = () => {
    const dataUrl = removeBlackBg(imgEl);
    if (dataUrl) {
      imgEl.src = dataUrl;
      imgEl.style.mixBlendMode = '';
      imgEl.dataset.bgRemoved = '1';
      // 親spanの黒背景も不要になるので削除
      if (imgEl.parentElement && imgEl.parentElement.tagName === 'SPAN') {
        imgEl.parentElement.style.background = 'transparent';
      }
    }
  };
  if (imgEl.complete && imgEl.naturalWidth > 0) {
    apply();
  } else {
    imgEl.onload = apply;
  }
}

// ページ内の星座画像すべてに適用
function applyAllSignImages() {
  document.querySelectorAll('img[alt]').forEach(img => {
    const alt = img.alt;
    if (Object.keys(signImages).includes(alt)) {
      applyRemoveBg(img);
    }
  });
}

// MutationObserverで動的に追加される画像にも対応
const _signImgObserver = new MutationObserver(() => applyAllSignImages());
_signImgObserver.observe(document.body, { childList: true, subtree: true });

// 初期化（fortuneDB外部JSロード後に呼ばれる）
function initUranai() {
  updateAstroBar();
  renderRanking('today');
  renderRanking('tomorrow');
}

// 確実に実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUranai);
} else {
  initUranai();
}

// iframeの高さをWordPress親ページに自動通知
function notifyParentHeight() {
  try {
    const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    window.parent.postMessage({ type: 'uranai_resize', height: h }, '*');
  } catch(e) {}
}
window.addEventListener('load', notifyParentHeight);
setInterval(notifyParentHeight, 800);
// WordPress環境でjQueryがある場合
if (typeof jQuery !== 'undefined') {
  jQuery(document).ready(function(){ initUranai(); });
}
// 念のためwindow.loadでも実行（重複は問題なし）
window.addEventListener('load', function(){
  if (!document.getElementById('panel-today').innerHTML) {
    initUranai();
  }
});

// ============================================================
// 1ヶ月運勢サイクル（バイオリズム × 星座重み係数）
// ============================================================

// バイオリズム3周期
const BIO = { body: 23, emotion: 28, intellect: 33 };

// 星座ごとの各運勢への重み係数 [body, emotion, intellect]
// 恋愛→感情主導、仕事→知性主導、金→身体主導、総合→星座で異なる配分
// これにより4本がバラバラに動く
const signWeights = {
  //                  love              work              money            overall
  "おひつじ座":  { love:[0.1,0.85,0.05], work:[0.15,0.1,0.75], money:[0.8,0.1,0.1], overall:[0.45,0.35,0.2] },
  "おうし座":    { love:[0.1,0.82,0.08], work:[0.1,0.08,0.82], money:[0.82,0.1,0.08], overall:[0.3,0.4,0.3] },
  "ふたご座":    { love:[0.08,0.8,0.12], work:[0.08,0.12,0.8], money:[0.78,0.12,0.1], overall:[0.25,0.35,0.4] },
  "かに座":      { love:[0.1,0.87,0.03], work:[0.12,0.15,0.73], money:[0.75,0.15,0.1], overall:[0.28,0.52,0.2] },
  "しし座":      { love:[0.12,0.83,0.05], work:[0.18,0.07,0.75], money:[0.83,0.1,0.07], overall:[0.42,0.38,0.2] },
  "おとめ座":    { love:[0.07,0.82,0.11], work:[0.07,0.06,0.87], money:[0.8,0.08,0.12], overall:[0.25,0.32,0.43] },
  "てんびん座":  { love:[0.1,0.84,0.06], work:[0.1,0.1,0.8], money:[0.79,0.12,0.09], overall:[0.3,0.42,0.28] },
  "さそり座":    { love:[0.13,0.83,0.04], work:[0.14,0.11,0.75], money:[0.77,0.13,0.1], overall:[0.33,0.48,0.19] },
  "いて座":      { love:[0.1,0.8,0.1], work:[0.12,0.08,0.8], money:[0.8,0.1,0.1], overall:[0.37,0.3,0.33] },
  "やぎ座":      { love:[0.08,0.81,0.11], work:[0.1,0.05,0.85], money:[0.82,0.08,0.1], overall:[0.35,0.25,0.4] },
  "みずがめ座":  { love:[0.08,0.79,0.13], work:[0.08,0.1,0.82], money:[0.78,0.1,0.12], overall:[0.23,0.33,0.44] },
  "うお座":      { love:[0.1,0.86,0.04], work:[0.1,0.12,0.78], money:[0.76,0.14,0.1], overall:[0.27,0.52,0.21] },
};

// バイオリズム計算（生年月日からの経過日数）
function calcBio(birthDateStr, targetDate) {
  const birth = new Date(birthDateStr);
  const diffDays = Math.floor((targetDate - birth) / 86400000);
  return {
    body:      Math.sin(2 * Math.PI * diffDays / BIO.body),
    emotion:   Math.sin(2 * Math.PI * diffDays / BIO.emotion),
    intellect: Math.sin(2 * Math.PI * diffDays / BIO.intellect),
  };
}

// 運勢スコア計算（バイオリズム × 星座重み）
function calcFortuneScore(bio, weights) {
  return bio.body * weights[0] + bio.emotion * weights[1] + bio.intellect * weights[2];
}

// ランキングを当日バイオリズムスコアで再計算
function rebuildRankingByBio(birthday) {
  const signs = [
    {sign:"おひつじ座",emoji:"♈",range:"3/21〜4/19"},
    {sign:"おうし座",emoji:"♉",range:"4/20〜5/20"},
    {sign:"ふたご座",emoji:"♊",range:"5/21〜6/21"},
    {sign:"かに座",emoji:"♋",range:"6/22〜7/22"},
    {sign:"しし座",emoji:"♌",range:"7/23〜8/22"},
    {sign:"おとめ座",emoji:"♍",range:"8/23〜9/22"},
    {sign:"てんびん座",emoji:"♎",range:"9/23〜10/23"},
    {sign:"さそり座",emoji:"♏",range:"10/24〜11/22"},
    {sign:"いて座",emoji:"♐",range:"11/23〜12/21"},
    {sign:"やぎ座",emoji:"♑",range:"12/22〜1/19"},
    {sign:"みずがめ座",emoji:"♒",range:"1/20〜2/18"},
    {sign:"うお座",emoji:"♓",range:"2/19〜3/20"},
  ];

  // 各星座の生年月日から代表日でバイオリズム計算
  // ※星座ごとに固定の「代表生年月日」を使用（同じ星座内で統一）
  // 実際の個人バイオリズムは自分の星座のサイクルグラフで確認
  const signRepBirth = {
    "おひつじ座":"1990-04-05", "おうし座":"1990-05-05", "ふたご座":"1990-06-05",
    "かに座":"1990-07-05", "しし座":"1990-08-05", "おとめ座":"1990-09-05",
    "てんびん座":"1990-10-05", "さそり座":"1990-11-05", "いて座":"1990-12-05",
    "やぎ座":"1990-01-05", "みずがめ座":"1990-02-05", "うお座":"1990-03-05",
  };

  function getRankedData(targetDate) {
    const label = targetDate === 'today' ? '今日' : '明日';
    const date = targetDate === 'today' ? new Date() : (() => { const d=new Date(); d.setDate(d.getDate()+1); return d; })();

    // バイオリズムベースのスコアで全星座を採点
    const scored = signs.map(s => {
      const repBirth = birthday || signRepBirth[s.sign];
      const bio = calcBio(repBirth, date);
      const w = signWeights[s.sign] || signWeights["おひつじ座"];
      const score = calcFortuneScore(bio, w.overall);
      // fortuneDBからその日のデータ取得
      const doy = getDayOfYear(date);
      const idx = ((doy%365)+365)%365;
      const dbEntry = (fortuneDB[idx]||fortuneDB[0]).find(d=>d.sign===s.sign) || {};
      // コメントはDBから、順位はスコアで上書き
      return {
        ...dbEntry,
        sign: s.sign,
        emoji: s.emoji,
        range: s.range,
        _score: score,
      };
    });

    // スコア降順でソート → rank付与
    scored.sort((a,b) => b._score - a._score);
    scored.forEach((s,i) => { s.rank = i+1; });
    return scored;
  }

  // fortuneDataを動的に差し替え
  window._bioRankedToday = getRankedData('today');
  window._bioRankedTomorrow = getRankedData('tomorrow');

  // ランキング再描画
  renderRankingFromData('today', window._bioRankedToday);
  renderRankingFromData('tomorrow', window._bioRankedTomorrow);

  // TOP結果カードも更新
  if (myCurrentSign) showMyResult(myCurrentSign, false);
}

function getFortuneDataOverride(tab) {
  if (tab === 'today' && window._bioRankedToday) return window._bioRankedToday;
  if (tab === 'tomorrow' && window._bioRankedTomorrow) return window._bioRankedTomorrow;
  return getFortuneData(tab);
}

function renderRankingFromData(tab, data) {
  const panel = document.getElementById('panel-'+tab);
  panel.innerHTML = data.map(d => `
    <div class="rank-item" onclick="openModalFromData('${d.sign}','${tab}')">
      <div class="rank-badge ${d.rank<=3?'r'+d.rank:'other'}">${
  d.rank+'位'
}</div>
      <div class="sign-icon">${d.emoji}</div>
      <div class="rank-content">
        <div class="rank-name">${d.sign}</div>
        <div class="rank-date">${d.range}</div>
        <div class="rank-summary">${d.summary||''}</div>
      </div>
      <div class="read-more">続きを読む ›</div>
    </div>
  `).join('');
}

function openModalFromData(sign, tab) {
  const dataArr = tab==='today' ? (window._bioRankedToday||getFortuneData('today'))
                                : (window._bioRankedTomorrow||getFortuneData('tomorrow'));
  const data = dataArr.find(d=>d.sign===sign);
  if (!data) return;
  const today = new Date();
  const targetDate = tab==='today' ? today : new Date(today.getTime()+86400000);
  const label = tab==='today' ? '今日' : '明日';

  const modalEmojiEl = document.getElementById('modalEmoji');
  const modalImgHtml = getSignImg(data.sign);
  if (modalImgHtml) { modalEmojiEl.innerHTML = modalImgHtml; } else { modalEmojiEl.textContent = data.emoji; }
  document.getElementById('modalName').textContent = data.sign;
  document.getElementById('modalRankNum').textContent = data.rank;
  document.getElementById('modalRankLabel').textContent = `位 / ${label}の全体運`;
  document.getElementById('modalAstro').innerHTML =
    `<span>🌙 ${getMoonSign(targetDate)}</span>`+
    `<span>⭐ ${dayGuardians[targetDate.getDay()]}</span>`+
    `<span>🔢 ${getNumerology(targetDate)}</span>`;
  document.getElementById('modalOverall').textContent = data.overall||'';
  document.getElementById('loveStars').innerHTML = makeStars((data.love||{}).stars||3);
  document.getElementById('loveComment').textContent = (data.love||{}).comment||'';
  document.getElementById('workStars').innerHTML = makeStars((data.work||{}).stars||3);
  document.getElementById('workComment').textContent = (data.work||{}).comment||'';
  document.getElementById('moneyStars').innerHTML = makeStars((data.money||{}).stars||3);
  document.getElementById('moneyComment').textContent = (data.money||{}).comment||'';
  document.getElementById('luckyColor').textContent = data.lucky_color||'';
  document.getElementById('luckyItem').textContent = data.lucky_item||'';
  document.getElementById('luckyDir').textContent = data.lucky_dir||'';
  document.getElementById('luckyPlace').textContent = data.lucky_place||'';
  document.getElementById('luckyNum').textContent = data.lucky_num||'';
  document.getElementById('actionText').textContent = data.action||'';

  document.getElementById('modalOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}

// ============================================================
// サイクルグラフ描画（バイオリズム正確計算版）
// ============================================================

function openCycleTab() {
  if (!myCurrentSign && !myBirthday) {
    alert('1ヶ月のサイクルを表示するには\n先に星座を選択してください。');
    return;
  }
  showCycleChart(myCurrentSign || '');
}

function showCycleChart(sign) {
  // 生年月日なしの場合は星座代表値を使用
  const signRepBirthMap = {
    "おひつじ座":"1990-04-05","おうし座":"1990-05-05","ふたご座":"1990-06-05",
    "かに座":"1990-07-05","しし座":"1990-08-05","おとめ座":"1990-09-05",
    "てんびん座":"1990-10-05","さそり座":"1990-11-05","いて座":"1990-12-05",
    "やぎ座":"1990-01-05","みずがめ座":"1990-02-05","うお座":"1990-03-05",
  };
  const birthToUse = myBirthday || signRepBirthMap[sign] || "1990-01-01";
  const isSimple = !myBirthday; // 簡易版かどうか

  // バナー表示切替
  const banner = document.getElementById('cycleBirthdayBanner');
  if (banner) banner.style.display = isSimple ? 'flex' : 'none';

  const signList = [
    {sign:"おひつじ座",emoji:"♈"},{sign:"おうし座",emoji:"♉"},
    {sign:"ふたご座",emoji:"♊"},{sign:"かに座",emoji:"♋"},
    {sign:"しし座",emoji:"♌"},{sign:"おとめ座",emoji:"♍"},
    {sign:"てんびん座",emoji:"♎"},{sign:"さそり座",emoji:"♏"},
    {sign:"いて座",emoji:"♐"},{sign:"やぎ座",emoji:"♑"},
    {sign:"みずがめ座",emoji:"♒"},{sign:"うお座",emoji:"♓"},
  ];
  const sd = signList.find(s=>s.sign===sign);
  const emoji = sd ? sd.emoji : '🔮';

  document.getElementById('cycleEmoji').textContent = emoji;
  document.getElementById('cycleTitle').textContent = (sign||'あなた') + 'の運勢サイクル';

  const today = new Date();
  const fmt = d => `${d.getMonth()+1}/${d.getDate()}`;
  document.getElementById('cycleTodayDate').textContent = fmt(today);

  const DAYS = 31;
  const w = signWeights[sign] || signWeights["おひつじ座"];

  // 31日分のデータ生成
  const labels = [];
  const overallData=[], loveData=[], workData=[], moneyData=[];
  const bodyData=[], emotionData=[], intellectData=[];

  for (let i = 0; i < DAYS; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    // X軸ラベル：今日・5日おき・月初
    if (i===0) labels.push('今日');
    else if (d.getDate()===1) labels.push(fmt(d));
    else if (i%5===0) labels.push(fmt(d));
    else labels.push('');

    const bio = calcBio(birthToUse, d);
    bodyData.push(bio.body);
    emotionData.push(bio.emotion);
    intellectData.push(bio.intellect);
    overallData.push(calcFortuneScore(bio, w.overall));
    loveData.push(calcFortuneScore(bio, w.love));
    workData.push(calcFortuneScore(bio, w.work));
    moneyData.push(calcFortuneScore(bio, w.money));
  }

  // ──── ピーク日計算 ────
  const peakIdx = {
    overall: overallData.indexOf(Math.max(...overallData)),
    love:    loveData.indexOf(Math.max(...loveData)),
    work:    workData.indexOf(Math.max(...workData)),
    money:   moneyData.indexOf(Math.max(...moneyData)),
  };
  function idxToDate(i) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return `${d.getMonth()+1}月${d.getDate()}日`;
  }
  const peakEl = document.getElementById('cyclePeak');
  peakEl.innerHTML = `
    <div class="cycle-peak-title">🌟 これからの1ヶ月であなたの運勢が最も高まる日</div>
    <div class="cycle-peak-grid">
      <div class="cycle-peak-item">
        <div class="cycle-peak-icon">✨</div>
        <div>
          <div class="cycle-peak-label">総合運</div>
          <div class="cycle-peak-date">${idxToDate(peakIdx.overall)}</div>
        </div>
      </div>
      <div class="cycle-peak-item">
        <div class="cycle-peak-icon">💕</div>
        <div>
          <div class="cycle-peak-label">恋愛運</div>
          <div class="cycle-peak-date">${idxToDate(peakIdx.love)}</div>
        </div>
      </div>
      <div class="cycle-peak-item">
        <div class="cycle-peak-icon">💼</div>
        <div>
          <div class="cycle-peak-label">仕事運</div>
          <div class="cycle-peak-date">${idxToDate(peakIdx.work)}</div>
        </div>
      </div>
      <div class="cycle-peak-item">
        <div class="cycle-peak-icon">💰</div>
        <div>
          <div class="cycle-peak-label">金運</div>
          <div class="cycle-peak-date">${idxToDate(peakIdx.money)}</div>
        </div>
      </div>
    </div>
  `;

  // Canvas描画（純Canvas版・バグ修正）
  const canvas = document.getElementById('cycleCanvas');
  const ctx = canvas.getContext('2d');

  // サイズ設定（モーダル表示後に計算）
  requestAnimationFrame(() => {
    const dpr = window.devicePixelRatio || 1;
    const wrapper = canvas.parentElement;
    const W = wrapper.clientWidth - 20;
    const H = 220;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    const pad = { top:24, right:16, bottom:38, left:32 };
    const cw = W - pad.left - pad.right;
    const ch = H - pad.top - pad.bottom;

    ctx.clearRect(0, 0, W, H);

    // ──── グリッド ────
    const gridVals = [1, 0.5, 0, -0.5, -1];
    gridVals.forEach(v => {
      const y = pad.top + ch * (1 - (v+1)/2);
      ctx.beginPath();
      ctx.strokeStyle = v===0 ? 'rgba(123,79,212,0.3)' : 'rgba(123,79,212,0.07)';
      ctx.lineWidth = v===0 ? 1.5 : 1;
      if (v===0) ctx.setLineDash([4,3]); else ctx.setLineDash([]);
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left+cw, y);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // ──── Y軸ラベル ────
    ctx.fillStyle = 'rgba(102,102,128,0.85)';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'right';
    [['高調',1],['普通',0],['低調',-1]].forEach(([label,v]) => {
      const y = pad.top + ch * (1-(v+1)/2);
      ctx.fillText(label, pad.left-4, y+3);
    });

    // ──── 折れ線描画 ────
    const toX = i => pad.left + (i/(DAYS-1)) * cw;
    const toY = v => pad.top + ch * (1-(v+1)/2);

    function drawCurve(data, color, lw, dash=[]) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.setLineDash(dash);
      ctx.beginPath();
      // catmull-rom風のスムージング
      data.forEach((v,i) => {
        const x=toX(i), y=toY(v);
        if(i===0){ ctx.moveTo(x,y); return; }
        const px=toX(i-1), py=toY(data[i-1]);
        const cpx1=px+(x-px)*0.4, cpy1=py;
        const cpx2=x-(x-px)*0.4, cpy2=y;
        ctx.bezierCurveTo(cpx1,cpy1,cpx2,cpy2,x,y);
      });
      ctx.stroke();
      ctx.restore();
    }

    // バイオリズム3本（細め・半透明）
    drawCurve(bodyData,     'rgba(255,87,34,0.35)',  1.2, [3,3]);
    drawCurve(emotionData,  'rgba(233,30,140,0.35)', 1.2, [3,3]);
    drawCurve(intellectData,'rgba(33,150,243,0.35)', 1.2, [3,3]);

    // 運勢4本（太め・実線）
    drawCurve(moneyData,   '#FF9800', 1.8);
    drawCurve(workData,    '#00BCD4', 1.8);
    drawCurve(loveData,    '#E91E8C', 2.2);
    drawCurve(overallData, '#7B4FD4', 2.8);

    // ──── 今日の縦ライン ────
    const todayX = toX(0);
    ctx.save();
    ctx.strokeStyle = 'rgba(233,30,140,0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3,3]);
    ctx.beginPath();
    ctx.moveTo(todayX, pad.top);
    ctx.lineTo(todayX, pad.top+ch);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // ──── TODAY ラベル ────
    ctx.save();
    ctx.fillStyle = 'rgba(233,30,140,0.9)';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TODAY', todayX, pad.top-8);
    ctx.restore();

    // ──── 今日の光るドット（4運勢）────
    const todayDots = [
      {data:overallData, color:'#7B4FD4'},
      {data:loveData,    color:'#E91E8C'},
      {data:workData,    color:'#00BCD4'},
      {data:moneyData,   color:'#FF9800'},
    ];
    todayDots.forEach(({data,color}) => {
      const y = toY(data[0]);
      // 外グロー
      const grad = ctx.createRadialGradient(todayX,y,0,todayX,y,14);
      grad.addColorStop(0, color+'88');
      grad.addColorStop(1, color+'00');
      ctx.beginPath();
      ctx.arc(todayX, y, 14, 0, Math.PI*2);
      ctx.fillStyle = grad;
      ctx.fill();
      // 白縁
      ctx.beginPath();
      ctx.arc(todayX, y, 5.5, 0, Math.PI*2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      // 内色
      ctx.beginPath();
      ctx.arc(todayX, y, 3.5, 0, Math.PI*2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    // ──── X軸ラベル ────
    ctx.fillStyle = 'rgba(102,102,128,0.9)';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    labels.forEach((label, i) => {
      if (!label) return;
      ctx.fillStyle = i===0 ? 'rgba(233,30,140,0.9)' : 'rgba(102,102,128,0.85)';
      ctx.font = i===0 ? 'bold 9px sans-serif' : '9px sans-serif';
      ctx.fillText(label, toX(i), pad.top+ch+14);
    });

    // ──── ツールチップ用データ保存 ────
    const chartData = { pad, cw, ch, W, H, DAYS, labels, overallData, loveData, workData, moneyData, bodyData, emotionData, intellectData, toX, toY };

    // ──── ツールチップ描画関数 ────
    function drawTooltip(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const mx = clientX - rect.left;

      // チャートエリア外なら消去して終了
      if (mx < pad.left || mx > pad.left + cw) {
        redraw();
        return;
      }

      // 最近傍インデックスを求める
      const ratio = (mx - pad.left) / cw;
      const idx = Math.round(ratio * (DAYS - 1));
      if (idx < 0 || idx >= DAYS) { redraw(); return; }

      // 再描画（グラフ本体）
      redraw();

      const tx = toX(idx);

      // 縦ガイドライン
      ctx.save();
      ctx.strokeStyle = 'rgba(123,79,212,0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3,3]);
      ctx.beginPath();
      ctx.moveTo(tx, pad.top);
      ctx.lineTo(tx, pad.top + ch);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 各線の交点にドット
      const series = [
        {data: overallData, color: '#7B4FD4'},
        {data: loveData,    color: '#E91E8C'},
        {data: workData,    color: '#00BCD4'},
        {data: moneyData,   color: '#FF9800'},
      ];
      series.forEach(({data, color}) => {
        const y = toY(data[idx]);
        ctx.beginPath();
        ctx.arc(tx, y, 4.5, 0, Math.PI*2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(tx, y, 3, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      // ──── ツールチップBOX ────
      const dateLabel = labels[idx] || (() => {
        const d = new Date(); d.setDate(d.getDate() + idx);
        return `${d.getMonth()+1}/${d.getDate()}`;
      })();

      const score2label = v => {
        if (v > 0.6) return '↑↑↑';
        if (v > 0.2) return '↑↑';
        if (v > -0.2) return '→';
        if (v > -0.6) return '↓↓';
        return '↓↓↓';
      };
      const score2bar = v => {
        const pct = Math.round((v + 1) / 2 * 100);
        return `${pct}%`;
      };

      const lines = [
        { label: '総合運', value: overallData[idx], color: '#7B4FD4' },
        { label: '恋愛運', value: loveData[idx],    color: '#E91E8C' },
        { label: '仕事運', value: workData[idx],    color: '#00BCD4' },
        { label: '金運',   value: moneyData[idx],   color: '#FF9800' },
      ];

      // BOXサイズ計算
      const boxW = 110, lineH = 17, headerH = 22;
      const boxH = headerH + lines.length * lineH + 8;

      // 表示位置（右端に近ければ左に出す）
      let bx = tx + 10;
      if (bx + boxW > W - pad.right) bx = tx - boxW - 10;
      const by = pad.top + 4;

      // 影
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;

      // 背景
      ctx.fillStyle = 'rgba(26,10,46,0.88)';
      ctx.beginPath();
      ctx.roundRect(bx, by, boxW, boxH, 8);
      ctx.fill();
      ctx.restore();

      // 日付ヘッダー
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`📅 ${idx===0?'今日':dateLabel}`, bx+8, by+15);

      // 区切り線
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx+6, by+headerH);
      ctx.lineTo(bx+boxW-6, by+headerH);
      ctx.stroke();

      // 各運勢行
      lines.forEach(({label, value, color}, i) => {
        const ly = by + headerH + 4 + i * lineH + 11;

        // 色丸
        ctx.beginPath();
        ctx.arc(bx+12, ly-3, 4, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();

        // ラベル
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(label, bx+22, ly);

        // スコア
        const bar = score2label(value);
        ctx.fillStyle = value > 0.2 ? '#7fff7f' : value > -0.2 ? '#ffdd88' : '#ff8888';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${bar} ${score2bar(value)}`, bx+boxW-6, ly);
      });
    }

    // ──── 再描画関数（グラフ本体のみ）────
    function redraw() {
      ctx.clearRect(0, 0, W, H);

      // グリッド
      gridVals.forEach(v => {
        const y = pad.top + ch * (1 - (v+1)/2);
        ctx.beginPath();
        ctx.strokeStyle = v===0 ? 'rgba(123,79,212,0.3)' : 'rgba(123,79,212,0.07)';
        ctx.lineWidth = v===0 ? 1.5 : 1;
        if (v===0) ctx.setLineDash([4,3]); else ctx.setLineDash([]);
        ctx.moveTo(pad.left, y); ctx.lineTo(pad.left+cw, y);
        ctx.stroke(); ctx.setLineDash([]);
      });

      // Y軸ラベル
      ctx.fillStyle = 'rgba(102,102,128,0.85)';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'right';
      [['高調',1],['普通',0],['低調',-1]].forEach(([label,v]) => {
        const y = pad.top + ch * (1-(v+1)/2);
        ctx.fillText(label, pad.left-4, y+3);
      });

      // 折れ線
      drawCurve(bodyData,     'rgba(255,87,34,0.35)',  1.2, [3,3]);
      drawCurve(emotionData,  'rgba(233,30,140,0.35)', 1.2, [3,3]);
      drawCurve(intellectData,'rgba(33,150,243,0.35)', 1.2, [3,3]);
      drawCurve(moneyData,   '#FF9800', 1.8);
      drawCurve(workData,    '#00BCD4', 1.8);
      drawCurve(loveData,    '#E91E8C', 2.2);
      drawCurve(overallData, '#7B4FD4', 2.8);

      // 今日縦ライン
      ctx.save();
      ctx.strokeStyle = 'rgba(233,30,140,0.4)';
      ctx.lineWidth = 1; ctx.setLineDash([3,3]);
      ctx.beginPath();
      ctx.moveTo(toX(0), pad.top); ctx.lineTo(toX(0), pad.top+ch);
      ctx.stroke(); ctx.setLineDash([]); ctx.restore();

      // TODAY ラベル
      ctx.save();
      ctx.fillStyle = 'rgba(233,30,140,0.9)';
      ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('TODAY', toX(0), pad.top-8); ctx.restore();

      // 今日ドット
      todayDots.forEach(({data,color}) => {
        const y = toY(data[0]);
        const grad = ctx.createRadialGradient(toX(0),y,0,toX(0),y,14);
        grad.addColorStop(0, color+'88'); grad.addColorStop(1, color+'00');
        ctx.beginPath(); ctx.arc(toX(0),y,14,0,Math.PI*2);
        ctx.fillStyle = grad; ctx.fill();
        ctx.beginPath(); ctx.arc(toX(0),y,5.5,0,Math.PI*2);
        ctx.fillStyle='#fff'; ctx.fill();
        ctx.beginPath(); ctx.arc(toX(0),y,3.5,0,Math.PI*2);
        ctx.fillStyle=color; ctx.fill();
      });

      // X軸ラベル
      labels.forEach((label, i) => {
        if (!label) return;
        ctx.fillStyle = i===0 ? 'rgba(233,30,140,0.9)' : 'rgba(102,102,128,0.85)';
        ctx.font = i===0 ? 'bold 9px sans-serif' : '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, toX(i), pad.top+ch+14);
      });
    }

    // ──── イベントリスナー登録 ────
    // 既存リスナーを削除してから登録
    const oldCanvas = canvas.cloneNode(true);
    canvas.parentNode.replaceChild(oldCanvas, canvas);
    const newCanvas = oldCanvas;
    const newCtx = newCanvas.getContext('2d');

    // scaleを再適用
    newCtx.scale(dpr, dpr);

    // drawCurveをnewCtx用に再定義
    function drawCurveOn(c, data, color, lw, dash=[]) {
      c.save(); c.strokeStyle=color; c.lineWidth=lw;
      c.lineJoin='round'; c.lineCap='round'; c.setLineDash(dash);
      c.beginPath();
      data.forEach((v,i) => {
        const x=toX(i), y=toY(v);
        if(i===0){c.moveTo(x,y);return;}
        const px=toX(i-1),py=toY(data[i-1]);
        c.bezierCurveTo(px+(x-px)*0.4,py,x-(x-px)*0.4,y,x,y);
      });
      c.stroke(); c.restore();
    }

    function fullRedraw(c) {
      c.clearRect(0,0,W,H);
      gridVals.forEach(v => {
        const y=pad.top+ch*(1-(v+1)/2);
        c.beginPath();
        c.strokeStyle=v===0?'rgba(123,79,212,0.3)':'rgba(123,79,212,0.07)';
        c.lineWidth=v===0?1.5:1;
        if(v===0)c.setLineDash([4,3]);else c.setLineDash([]);
        c.moveTo(pad.left,y);c.lineTo(pad.left+cw,y);c.stroke();c.setLineDash([]);
      });
      c.fillStyle='rgba(102,102,128,0.85)'; c.font='9px sans-serif'; c.textAlign='right';
      [['高調',1],['普通',0],['低調',-1]].forEach(([l,v])=>{
        c.fillText(l,pad.left-4,pad.top+ch*(1-(v+1)/2)+3);
      });
      drawCurveOn(c,bodyData,'rgba(255,87,34,0.35)',1.2,[3,3]);
      drawCurveOn(c,emotionData,'rgba(233,30,140,0.35)',1.2,[3,3]);
      drawCurveOn(c,intellectData,'rgba(33,150,243,0.35)',1.2,[3,3]);
      drawCurveOn(c,moneyData,'#FF9800',1.8);
      drawCurveOn(c,workData,'#00BCD4',1.8);
      drawCurveOn(c,loveData,'#E91E8C',2.2);
      drawCurveOn(c,overallData,'#7B4FD4',2.8);
      // 今日縦ライン
      c.save();c.strokeStyle='rgba(233,30,140,0.4)';c.lineWidth=1;c.setLineDash([3,3]);
      c.beginPath();c.moveTo(toX(0),pad.top);c.lineTo(toX(0),pad.top+ch);c.stroke();
      c.setLineDash([]);c.restore();
      c.save();c.fillStyle='rgba(233,30,140,0.9)';c.font='bold 8px sans-serif';c.textAlign='center';
      c.fillText('TODAY',toX(0),pad.top-8);c.restore();
      todayDots.forEach(({data,color})=>{
        const y=toY(data[0]);
        const g=c.createRadialGradient(toX(0),y,0,toX(0),y,14);
        g.addColorStop(0,color+'88');g.addColorStop(1,color+'00');
        c.beginPath();c.arc(toX(0),y,14,0,Math.PI*2);c.fillStyle=g;c.fill();
        c.beginPath();c.arc(toX(0),y,5.5,0,Math.PI*2);c.fillStyle='#fff';c.fill();
        c.beginPath();c.arc(toX(0),y,3.5,0,Math.PI*2);c.fillStyle=color;c.fill();
      });
      labels.forEach((label,i)=>{
        if(!label)return;
        c.fillStyle=i===0?'rgba(233,30,140,0.9)':'rgba(102,102,128,0.85)';
        c.font=i===0?'bold 9px sans-serif':'9px sans-serif';
        c.textAlign='center';
        c.fillText(label,toX(i),pad.top+ch+14);
      });
    }

    function drawTooltipOn(c, clientX) {
      const rect = newCanvas.getBoundingClientRect();
      const mx = clientX - rect.left;
      if (mx < pad.left || mx > pad.left+cw) { fullRedraw(c); return; }
      const idx = Math.round((mx-pad.left)/cw*(DAYS-1));
      if (idx<0||idx>=DAYS) { fullRedraw(c); return; }
      fullRedraw(c);
      const tx = toX(idx);

      // ガイドライン
      c.save();c.strokeStyle='rgba(123,79,212,0.5)';c.lineWidth=1;c.setLineDash([3,3]);
      c.beginPath();c.moveTo(tx,pad.top);c.lineTo(tx,pad.top+ch);c.stroke();
      c.setLineDash([]);c.restore();

      // 交点ドット
      const ser=[
        {data:overallData,color:'#7B4FD4'},
        {data:loveData,color:'#E91E8C'},
        {data:workData,color:'#00BCD4'},
        {data:moneyData,color:'#FF9800'},
      ];
      ser.forEach(({data,color})=>{
        const y=toY(data[idx]);
        c.beginPath();c.arc(tx,y,4.5,0,Math.PI*2);c.fillStyle='#fff';c.fill();
        c.beginPath();c.arc(tx,y,3,0,Math.PI*2);c.fillStyle=color;c.fill();
      });

      // ツールチップ
      const score2label = v => v>0.6?'↑↑↑':v>0.2?'↑↑':v>-0.2?'→':v>-0.6?'↓↓':'↓↓↓';
      const score2pct = v => `${Math.round((v+1)/2*100)}%`;
      const dLabel = labels[idx]||(() => {
        const d=new Date();d.setDate(d.getDate()+idx);
        return `${d.getMonth()+1}/${d.getDate()}`;
      })();

      const tlines=[
        {label:'総合運',value:overallData[idx],color:'#7B4FD4'},
        {label:'恋愛運',value:loveData[idx],color:'#E91E8C'},
        {label:'仕事運',value:workData[idx],color:'#00BCD4'},
        {label:'金運',value:moneyData[idx],color:'#FF9800'},
      ];

      const boxW=120,lineH=17,headerH=22;
      const boxH=headerH+tlines.length*lineH+10;
      let bx=tx+12;
      if(bx+boxW>W-8)bx=tx-boxW-12;
      const by=pad.top+4;

      c.save();
      c.shadowColor='rgba(0,0,0,0.2)';c.shadowBlur=10;c.shadowOffsetY=3;
      c.fillStyle='rgba(20,8,40,0.92)';
      c.beginPath();c.roundRect(bx,by,boxW,boxH,8);c.fill();
      c.restore();

      c.fillStyle='#fff';c.font='bold 10px sans-serif';c.textAlign='left';
      c.fillText(`📅 ${idx===0?'今日':dLabel}`,bx+8,by+15);

      c.strokeStyle='rgba(255,255,255,0.12)';c.lineWidth=1;
      c.beginPath();c.moveTo(bx+6,by+headerH);c.lineTo(bx+boxW-6,by+headerH);c.stroke();

      tlines.forEach(({label,value,color},i)=>{
        const ly=by+headerH+4+i*lineH+11;
        c.beginPath();c.arc(bx+12,ly-3,4,0,Math.PI*2);c.fillStyle=color;c.fill();
        c.fillStyle='rgba(255,255,255,0.8)';c.font='9px sans-serif';c.textAlign='left';
        c.fillText(label,bx+22,ly);
        c.fillStyle=value>0.2?'#7fff7f':value>-0.2?'#ffdd88':'#ff8888';
        c.font='bold 9px sans-serif';c.textAlign='right';
        c.fillText(`${score2label(value)} ${score2pct(value)}`,bx+boxW-6,ly);
      });
    }

    // マウス・タッチイベント
    newCanvas.addEventListener('mousemove', e => drawTooltipOn(newCtx, e.clientX));
    newCanvas.addEventListener('mouseleave', () => fullRedraw(newCtx));
    newCanvas.addEventListener('touchstart', e => {
      e.preventDefault();
      drawTooltipOn(newCtx, e.touches[0].clientX);
    }, {passive:false});
    newCanvas.addEventListener('touchmove', e => {
      e.preventDefault();
      drawTooltipOn(newCtx, e.touches[0].clientX);
    }, {passive:false});
    newCanvas.addEventListener('touchend', () => {
      setTimeout(() => fullRedraw(newCtx), 2000);
    });

    // 初期描画
    fullRedraw(newCtx);
  });

  document.getElementById('cycleOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeCycleOutside(e) {
  if (e.target === document.getElementById('cycleOverlay')) closeCycle();
}
function closeCycle() {
  document.getElementById('cycleOverlay').classList.remove('show');
  document.body.style.overflow = '';
}