/* FANN motion layer. Additive only: scroll reveal and desktop hero pointer drift. No library. Skips itself for
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
    '.fm-rev{opacity:0;transform:translateY(24px);transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1)!important}' +
    '.fm-rev.fm-in{opacity:1;transform:none}' +
    '@media (prefers-reduced-motion:reduce){.fm-rev{opacity:1!important;transform:none!important;transition:none!important}}';
  document.head.appendChild(st);

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (x) {
      if (x.isIntersecting || x.boundingClientRect.top < 0) {
        var el = x.target;
        el.classList.add('fm-in'); io.unobserve(el);
        // hand the element back to its own styles once the entrance is done
        setTimeout(function () { el.classList.remove('fm-rev', 'fm-in'); el.style.transitionDelay = ''; }, 1100);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  function scan() {
    var q = 'main section h2, main section .grid > *, main section details, main section article';
    var list = [].slice.call(document.querySelectorAll(q));
    var n = 0;
    list.forEach(function (e) {
      if (e.dataset.fm || e.closest('.fm-rev') && e.closest('.fm-rev') !== e) return;
      if (e.closest('header, nav, form, [role="dialog"], [class*="hero"]')) return;
      var r = e.getBoundingClientRect();
      e.dataset.fm = '1';
      if (r.top < innerHeight * 0.95) return; // first screen is never hidden
      e.classList.add('fm-rev');
      e.style.transitionDelay = ((n++ % 3) * 80) + 'ms';
      io.observe(e);
      setTimeout(function () { if (e.isConnected && e.classList.contains('fm-rev')) { e.classList.remove('fm-rev', 'fm-in'); e.style.transitionDelay = ''; io.unobserve(e); } }, 15000);
    });
    if (fine) {
      var hero = document.querySelector('.fann-home-hero');
      if (hero && !hero.dataset.fmh && hero.firstElementChild) {
        hero.dataset.fmh = '1';
        var bg = hero.querySelector('.fann-hero-media');
        if (!bg) return;
        hero.addEventListener('pointermove', function (e) {
          var r = hero.getBoundingClientRect();
          var nx = (e.clientX - r.left) / r.width * 2 - 1, ny = (e.clientY - r.top) / r.height * 2 - 1;
          bg.style.transition = 'transform .6s ease-out';
          bg.style.transform = 'scale(1.025) translate(' + (-nx * 8) + 'px,' + (-ny * 5) + 'px)';
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
