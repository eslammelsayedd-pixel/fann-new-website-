/* FANN motion layer (preview). Additive only: scroll reveal, hero pointer drift,
   magnetic gold buttons, scroll progress line. No library. Skips itself for
   "reduce motion". Text stays in the HTML; only opacity/transform are animated
   after load, and everything is shown again if the observer never fires. */
(function () {
  if (window.__fannMotion) return;
  window.__fannMotion = true;
  var mq = matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches || !('IntersectionObserver' in window)) return;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  var st = document.createElement('style');
  st.textContent =
    '#fm-bar{position:fixed;top:0;left:0;height:2px;width:0;background:#C5A572;z-index:2147483000;pointer-events:none}' +
    '.fm-rev{opacity:0;transform:translateY(24px);transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1)}' +
    '.fm-rev.fm-in{opacity:1;transform:none}' +
    '.fm-mag{transition:transform .25s ease-out}' +
    '@media (prefers-reduced-motion:reduce){.fm-rev{opacity:1!important;transform:none!important;transition:none!important}}';
  document.head.appendChild(st);

  var bar = document.createElement('div');
  bar.id = 'fm-bar';
  document.body.appendChild(bar);
  addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = h > 0 ? (scrollY / h * 100) + '%' : '0';
  }, { passive: true });

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (x) {
      if (x.isIntersecting) { x.target.classList.add('fm-in'); io.unobserve(x.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  function scan() {
    var q = 'main section h2, main section .grid > *, main section details, main section article';
    var list = [].slice.call(document.querySelectorAll(q));
    var n = 0;
    list.forEach(function (e) {
      if (e.dataset.fm || e.closest('.fm-rev') && e.closest('.fm-rev') !== e) return;
      if (e.closest('header, nav, [class*="hero"]')) return;
      var r = e.getBoundingClientRect();
      e.dataset.fm = '1';
      if (r.top < innerHeight * 0.95) return; // first screen is never hidden
      e.classList.add('fm-rev');
      e.style.transitionDelay = ((n++ % 3) * 80) + 'ms';
      io.observe(e);
    });
    if (fine) {
      [].forEach.call(document.querySelectorAll('.btn-gold'), function (b) {
        if (b.dataset.fmb) return; b.dataset.fmb = '1'; b.classList.add('fm-mag');
        b.addEventListener('pointermove', function (e) {
          var r = b.getBoundingClientRect();
          b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .16) + 'px,' + ((e.clientY - r.top - r.height / 2) * .26) + 'px)';
        });
        b.addEventListener('pointerleave', function () { b.style.transform = ''; });
      });
      var hero = document.querySelector('.fann-home-hero');
      if (hero && !hero.dataset.fmh && hero.firstElementChild) {
        hero.dataset.fmh = '1';
        var bg = hero.firstElementChild;
        hero.addEventListener('pointermove', function (e) {
          var r = hero.getBoundingClientRect();
          var nx = (e.clientX - r.left) / r.width * 2 - 1, ny = (e.clientY - r.top) / r.height * 2 - 1;
          bg.style.transition = 'transform .6s ease-out';
          bg.style.transform = 'scale(1.05) translate(' + (-nx * 12) + 'px,' + (-ny * 8) + 'px)';
        });
        hero.addEventListener('pointerleave', function () { bg.style.transform = ''; });
      }
    }
  }
  var t;
  function later() { clearTimeout(t); t = setTimeout(scan, 250); }
  scan();
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
  // last resort: never leave content hidden
  setTimeout(function () {
    if (!document.querySelector('.fm-in') && scrollY > 0) {
      [].forEach.call(document.querySelectorAll('.fm-rev'), function (e) { e.classList.add('fm-in'); });
    }
  }, 6000);
})();
