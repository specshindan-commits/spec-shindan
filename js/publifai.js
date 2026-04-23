// ハンバーガーメニュー
function toggleMenu() {
  var h = document.getElementById('hamburger');
  var d = document.getElementById('drawer');
  var o = document.getElementById('drawerOverlay');
  h.classList.toggle('open');
  d.classList.toggle('open');
  o.classList.toggle('open');
}
function closeMenu() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
}

// FAQ アコーディオン
function toggleFaq(btn) {
  var answer = btn.nextElementSibling;
  var isOpen = btn.classList.contains('open');
  document.querySelectorAll('.faq-q').forEach(function(b) {
    b.classList.remove('open');
    b.nextElementSibling.classList.remove('open');
  });
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

// フォーム送信（★ 本番はFormspree等に差し替え）
function handleForm(e) {
  e.preventDefault();
  document.getElementById('form-msg').style.display = 'block';
  e.target.reset();
}

// カウントダウンタイマー（★ deadline を実際の終了日に変更）
(function () {
  var deadline = new Date();
  deadline.setDate(deadline.getDate() + 7);
  deadline.setHours(23, 59, 59, 0);
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var diff = deadline - new Date();
    if (diff <= 0) { return; }
    var d = pad(Math.floor(diff / 86400000));
    var h = pad(Math.floor((diff % 86400000) / 3600000));
    var m = pad(Math.floor((diff % 3600000) / 60000));
    var s = pad(Math.floor((diff % 60000) / 1000));
    // 1つ目
    document.getElementById('cd-days').textContent    = d;
    document.getElementById('cd-hours').textContent   = h;
    document.getElementById('cd-minutes').textContent = m;
    document.getElementById('cd-seconds').textContent = s;
    // 2つ目
    document.getElementById('cd-days2').textContent    = d;
    document.getElementById('cd-hours2').textContent   = h;
    document.getElementById('cd-minutes2').textContent = m;
    document.getElementById('cd-seconds2').textContent = s;
  }
  tick();
  setInterval(tick, 1000);
})();

// ── タイピングアニメーション ──
(function() {
  const lines = [
    { id: 'scramble1', text: '2分で3万字' },
    { id: 'scramble2', text: 'なのに、' },
    { id: 'scramble3', text: 'SEOが強い。' },
  ];
  const typeSpeed = 80;   // 1文字あたりのms
  const pauseAfter = 1500; // 完成後の待機ms
  const deleteSpeed = 40;  // 削除速度ms

  function typeText(el, text, i, onComplete) {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      setTimeout(() => typeText(el, text, i + 1, onComplete), typeSpeed);
    } else {
      if (onComplete) onComplete();
    }
  }

  function deleteText(el, text, i, onComplete) {
    if (i >= 0) {
      el.textContent = text.slice(0, i);
      setTimeout(() => deleteText(el, text, i - 1, onComplete), deleteSpeed);
    } else {
      if (onComplete) onComplete();
    }
  }

  function runSequence() {
    // 全要素を空にしてからタイプ開始
    lines.forEach(l => {
      const el = document.getElementById(l.id);
      if (el) el.textContent = '';
    });

    function typeLine(index) {
      if (index >= lines.length) {
        // 全行タイプ完了 → pauseAfter後に削除開始
        setTimeout(() => deleteLine(lines.length - 1), pauseAfter);
        return;
      }
      const { id, text } = lines[index];
      const el = document.getElementById(id);
      if (!el) { typeLine(index + 1); return; }
      typeText(el, text, 0, () => typeLine(index + 1));
    }

    function deleteLine(index) {
      if (index < 0) {
        // 全削除完了 → 0.3秒後にループ
        setTimeout(runSequence, 300);
        return;
      }
      const { id, text } = lines[index];
      const el = document.getElementById(id);
      if (!el) { deleteLine(index - 1); return; }
      deleteText(el, text, text.length, () => deleteLine(index - 1));
    }

    typeLine(0);
  }

  if (document.readyState === 'complete') {
    setTimeout(runSequence, 300);
  } else {
    window.addEventListener('load', () => setTimeout(runSequence, 300));
  }
// ── 見出しタイピングアニメーション（スクロール連動） ──
(function() {
  const TYPE_SPEED = 50;

  function buildHeading(el) {
    const raw = el.getAttribute('data-lines') || '';
    const isBlue = el.getAttribute('data-blue') === '1';
    const lines = raw.split('|');
    el.innerHTML = '';
    lines.forEach((line, i) => {
      const span = document.createElement('span');
      span.className = 'type-line';
      span.setAttribute('data-text', line);
      span.setAttribute('data-blue', isBlue && i === lines.length - 1 && lines.length > 1 ? '1' : '0');
      span.textContent = line;
      // 最終行を青色に
      if (isBlue && i === lines.length - 1 && lines.length > 1) {
        span.style.color = 'var(--blue)';
      } else {
        span.style.color = 'var(--navy)';
      }
      el.appendChild(span);
      if (i < lines.length - 1) el.appendChild(document.createElement('br'));
    });
  }

  function typeLines(el) {
    const spans = el.querySelectorAll('.type-line');
    spans.forEach(s => { s.textContent = ''; });
    let spanIndex = 0;

    function typeNext() {
      if (spanIndex >= spans.length) return;
      const span = spans[spanIndex];
      const text = span.getAttribute('data-text');
      const isBlueSpan = span.getAttribute('data-blue') === '1';
      let charIndex = 0;

      // カーソル
      spans.forEach(s => s.style.borderRight = 'none');
      span.style.borderRight = '2px solid var(--blue)';
      // 色を維持
      span.style.color = isBlueSpan ? 'var(--blue)' : 'var(--navy)';

      const timer = setInterval(() => {
        span.textContent = text.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex >= text.length) {
          clearInterval(timer);
          span.style.borderRight = 'none';
          spanIndex++;
          setTimeout(typeNext, 80);
        }
      }, TYPE_SPEED);
    }
    typeNext();
  }

  function init() {
    const headings = document.querySelectorAll('.type-heading');
    headings.forEach(el => buildHeading(el));

    // threshold:0にして少しでも画面に入ったら発火
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.typed) {
          entry.target.dataset.typed = '1';
          typeLines(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    headings.forEach(el => observer.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();