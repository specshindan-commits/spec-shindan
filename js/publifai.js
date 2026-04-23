// PublifAI - Main Scripts

// ── カウントダウンタイマー ──
(function() {
  function calcDiff() {
    var deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);
    deadline.setHours(23, 59, 59, 0);
    var diff = Math.max(0, deadline - new Date());
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000)
    };
  }
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var t = calcDiff();
    var ids1 = ['cd-days', 'cd-hours', 'cd-minutes', 'cd-seconds'];
    var ids2 = ['cd-days2', 'cd-hours2', 'cd-minutes2', 'cd-seconds2'];
    var vals = [t.d, t.h, t.m, t.s];
    ids1.forEach(function(id, i) {
      var el = document.getElementById(id);
      if (el) el.textContent = pad(vals[i]);
    });
    ids2.forEach(function(id, i) {
      var el = document.getElementById(id);
      if (el) el.textContent = pad(vals[i]);
    });
  }
  tick();
  setInterval(tick, 1000);
}());

// ── ハンバーガーメニュー ──
function toggleMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('drawer').classList.toggle('open');
  document.getElementById('drawerOverlay').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
}

// ── FAQアコーディオン ──
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.faq-q').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.faq-item');
      var ans = item.querySelector('.faq-a');
      var isOpen = ans.classList.contains('open');
      document.querySelectorAll('.faq-a').forEach(function(a) { a.classList.remove('open'); });
      document.querySelectorAll('.faq-q').forEach(function(q) { q.classList.remove('open'); });
      if (!isOpen) {
        ans.classList.add('open');
        btn.classList.add('open');
      }
    });
  });
});

// ── キャッチコピー タイピングアニメーション ──
(function() {
  var lines = [
    { id: 'scramble1', text: '2分で3万字' },
    { id: 'scramble2', text: 'なのに、' },
    { id: 'scramble3', text: 'SEOが強い。' }
  ];
  var typeSpeed = 80;
  var pauseAfter = 1500;
  var deleteSpeed = 40;

  function typeText(el, text, i, cb) {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      setTimeout(function() { typeText(el, text, i + 1, cb); }, typeSpeed);
    } else {
      if (cb) cb();
    }
  }

  function deleteText(el, text, i, cb) {
    if (i >= 0) {
      el.textContent = text.slice(0, i);
      setTimeout(function() { deleteText(el, text, i - 1, cb); }, deleteSpeed);
    } else {
      if (cb) cb();
    }
  }

  function runSequence() {
    lines.forEach(function(l) {
      var el = document.getElementById(l.id);
      if (el) el.textContent = '';
    });

    function typeLine(idx) {
      if (idx >= lines.length) {
        setTimeout(function() { deleteLine(lines.length - 1); }, pauseAfter);
        return;
      }
      var el = document.getElementById(lines[idx].id);
      if (!el) { typeLine(idx + 1); return; }
      typeText(el, lines[idx].text, 0, function() { typeLine(idx + 1); });
    }

    function deleteLine(idx) {
      if (idx < 0) {
        setTimeout(runSequence, 300);
        return;
      }
      var el = document.getElementById(lines[idx].id);
      if (!el) { deleteLine(idx - 1); return; }
      deleteText(el, lines[idx].text, lines[idx].text.length, function() { deleteLine(idx - 1); });
    }

    typeLine(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(runSequence, 300); });
  } else {
    setTimeout(runSequence, 300);
  }
}());

// ── 見出しタイピングアニメーション ──
(function() {
  var TYPESPEED = 50;

  function buildHeading(el) {
    var raw = el.getAttribute('data-lines') || '';
    var isBlue = el.getAttribute('data-blue') === '1';
    var lines = raw.split('|');
    el.innerHTML = '';
    lines.forEach(function(line, i) {
      var span = document.createElement('span');
      span.className = 'type-line';
      span.setAttribute('data-text', line);
      var blueSpan = isBlue && i === lines.length - 1 && lines.length > 1;
      span.setAttribute('data-isblue', blueSpan ? '1' : '0');
      span.textContent = line;
      span.style.color = blueSpan ? 'var(--blue)' : 'var(--navy)';
      el.appendChild(span);
      if (i < lines.length - 1) {
        el.appendChild(document.createElement('br'));
      }
    });
  }

  function typeLines(el) {
    var spans = el.querySelectorAll('.type-line');
    spans.forEach(function(s) { s.textContent = ''; });
    var spanIndex = 0;

    function typeNext() {
      if (spanIndex >= spans.length) return;
      var span = spans[spanIndex];
      var text = span.getAttribute('data-text');
      var isBlueSpan = span.getAttribute('data-isblue') === '1';
      var charIndex = 0;
      spans.forEach(function(s) { s.style.borderRight = 'none'; });
      span.style.borderRight = '2px solid var(--blue)';
      span.style.color = isBlueSpan ? 'var(--blue)' : 'var(--navy)';
      var timer = setInterval(function() {
        span.textContent = text.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex >= text.length) {
          clearInterval(timer);
          span.style.borderRight = 'none';
          spanIndex++;
          setTimeout(typeNext, 80);
        }
      }, TYPESPEED);
    }
    typeNext();
  }

  function init() {
    var headings = document.querySelectorAll('.type-heading');
    headings.forEach(function(el) { buildHeading(el); });
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting && !entry.target.dataset.typed) {
            entry.target.dataset.typed = '1';
            typeLines(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
      headings.forEach(function(el) { observer.observe(el); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
