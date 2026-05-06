/* =========================================================
   iBRO recruit.ibro.jp — Global JS
   v1.0 — 2026-05-06 (LIM)
   ========================================================= */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mark JS-capable so CSS can pre-hide reveal-words and prevent FOUC.
  document.documentElement.classList.add('js');

  function init() {
    setupFadeIn();
    setupCountUp();
    setupAccordion();
    setupFloatingCta();
    setupHeaderTheme();
    setupPhotoBlocks();
    setupReadmore();
    setupProgressBar();
    setupParallax();
    setupTextReveal();
    setupMaskReveal();
    setupMagnet();
  }

  /* ---- Parallax (rAF + IO + lerp + auto scale-buffer) ----
     - Each element gets a scale buffer so the translate never reveals edges.
     - Progress is normalized to [-1, 1] across (viewport + element) range.
     - Lerp smooths frame-to-frame jitter so the motion feels glassy.
     - IntersectionObserver gates updates to in-view elements only. */
  function setupParallax() {
    if (prefersReducedMotion) return;
    var els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;

    var items = [];
    Array.prototype.forEach.call(els, function (el) {
      var speed = parseFloat(el.dataset.parallax);
      if (isNaN(speed)) speed = 0.12;
      speed = Math.max(-0.4, Math.min(0.4, speed));
      // scale buffer scales with speed so faster parallax never shows edges
      var scale = 1 + Math.min(0.22, Math.abs(speed) * 1.5);
      var item = { el: el, speed: speed, scale: scale, inView: false, current: 0, target: 0 };
      el.style.willChange = 'transform';
      el.style.transformOrigin = 'center center';
      el.style.transform = 'translate3d(0,0,0) scale(' + scale.toFixed(3) + ')';
      items.push(item);
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          for (var i = 0; i < items.length; i++) {
            if (items[i].el === entry.target) {
              items[i].inView = entry.isIntersecting;
              break;
            }
          }
        });
      }, { rootMargin: '200px 0px' });
      items.forEach(function (it) { io.observe(it.el); });
    } else {
      items.forEach(function (it) { it.inView = true; });
    }

    function computeTarget(item, vh) {
      var rect = item.el.getBoundingClientRect();
      var range = (vh + rect.height) / 2;
      // -1 = element just below viewport, 0 = centered, +1 = just above viewport
      var progress = (rect.top + rect.height / 2 - vh / 2) / range;
      progress = Math.max(-1, Math.min(1, progress));
      // Cap shift to a fraction of element height — never reveals edges given scale buffer
      var maxShift = Math.min(120, rect.height * 0.25);
      // Direction: classic parallax — bg drifts opposite to scroll → use -progress
      return -progress * maxShift * Math.abs(item.speed) / 0.2;
    }

    var rafId = null;
    var animating = false;
    function tick() {
      rafId = null;
      var vh = window.innerHeight;
      var stillAnimating = false;
      items.forEach(function (item) {
        if (!item.inView) return;
        item.target = computeTarget(item, vh);
        // Lerp current toward target for smoothing
        var diff = item.target - item.current;
        if (Math.abs(diff) < 0.05) {
          item.current = item.target;
        } else {
          item.current += diff * 0.18;
          stillAnimating = true;
        }
        item.el.style.transform =
          'translate3d(0,' + item.current.toFixed(2) + 'px,0) scale(' + item.scale.toFixed(3) + ')';
      });
      if (stillAnimating || animating) {
        animating = stillAnimating;
        rafId = requestAnimationFrame(tick);
      }
    }

    function onScroll() {
      animating = true;
      if (rafId === null) rafId = requestAnimationFrame(tick);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    // Settle initial positions after first layout
    requestAnimationFrame(function () {
      animating = true;
      tick();
    });
  }

  /* ---- Text reveal (block-level slide-in; Japanese-safe) ---- */
  function setupTextReveal() {
    var els = document.querySelectorAll('.reveal-words');
    if (!els.length) return;
    // Mark ready immediately so CSS un-hides text. Animation happens on intersection.
    els.forEach(function (el) { el.dataset.split = 'done'; });
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- Mask reveal (clip-path) ---- */
  function setupMaskReveal() {
    var els = document.querySelectorAll('.mask-reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- Magnetic hover (subtle pull toward cursor) ---- */
  function setupMagnet() {
    if (window.matchMedia('(hover: none)').matches) return;
    var els = document.querySelectorAll('.magnet');
    if (!els.length) return;
    els.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var mx = e.clientX - rect.left - rect.width / 2;
        var my = e.clientY - rect.top - rect.height / 2;
        var strength = parseFloat(el.dataset.magnet) || 0.18;
        el.style.transform = 'translate3d(' + (mx * strength).toFixed(2) + 'px,' + (my * strength).toFixed(2) + 'px,0)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'translate3d(0,0,0)';
      });
    });
  }

  /* ---------- Read-more accordion (storytelling LP) ---------- */
  function setupReadmore() {
    var btns = document.querySelectorAll('.readmore');
    btns.forEach(function (btn) {
      var targetId = btn.getAttribute('data-target');
      if (!targetId) return;
      var body = document.querySelector(targetId);
      if (!body) return;
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', targetId.replace('#', ''));
      btn.addEventListener('click', function () {
        var isOpen = body.classList.toggle('is-open');
        btn.classList.toggle('is-open', isOpen);
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        // update label
        var labelOpen = btn.getAttribute('data-label-open') || 'とじる';
        var labelClose = btn.getAttribute('data-label-close') || 'さらに読む';
        var labelSpan = btn.querySelector('.readmore__label') || btn;
        if (labelSpan === btn) {
          // first child text node update is fragile; use a span fallback
        } else {
          labelSpan.textContent = isOpen ? labelOpen : labelClose;
        }
      });
    });
  }

  /* ---------- Scroll progress bar (top) ---------- */
  function setupProgressBar() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    var rafId = null;
    function update() {
      rafId = null;
      var doc = document.documentElement;
      var scrollTop = window.scrollY || doc.scrollTop;
      var scrollHeight = doc.scrollHeight - doc.clientHeight;
      var pct = scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0;
      bar.style.width = pct + '%';
    }
    function onScroll() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(update);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ---------- Photo block scale-in (v3) ---------- */
  function setupPhotoBlocks() {
    var blocks = document.querySelectorAll('.photo-block');
    if (!blocks.length) return;
    if (!('IntersectionObserver' in window)) {
      blocks.forEach(function (b) { b.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    blocks.forEach(function (b) { io.observe(b); });
  }

  /* ---------- Scroll-aware header theme (auto light/dark) ---------- */
  function setupHeaderTheme() {
    var header = document.querySelector('.site-header');
    if (!header || header.classList.contains('site-header--static')) return;

    var darkSel = '.hero, .ph-hero, .section--ink';
    var rafId = null;
    var headerProbeY = 28; // px from viewport top — middle of compact header

    function probe() {
      rafId = null;
      var x = Math.max(20, Math.min(window.innerWidth - 20, window.innerWidth / 2));
      // The fixed header itself sits at this point. Use elementsFromPoint and
      // skip the header (and its descendants) to read the section behind it.
      var stack = document.elementsFromPoint
        ? document.elementsFromPoint(x, headerProbeY)
        : [document.elementFromPoint(x, headerProbeY)];
      for (var i = 0; i < stack.length; i++) {
        var el = stack[i];
        if (!el) continue;
        if (el === header || header.contains(el)) continue;
        var dark = el.closest(darkSel);
        if (dark) header.classList.remove('is-light');
        else header.classList.add('is-light');
        return;
      }
      // Fallback if nothing under header — assume light section.
      header.classList.add('is-light');
    }

    function onScroll() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(probe);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    // initial probe (after layout settles)
    requestAnimationFrame(probe);
  }

  /* ---------- Scroll fade-up ---------- */
  function setupFadeIn() {
    var els = document.querySelectorAll('.fade-up');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Number count-up ---------- */
  function setupCountUp() {
    var els = document.querySelectorAll('[data-count]');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.textContent = formatNumber(parseFloat(el.dataset.count)); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.45 });
    els.forEach(function (el) { io.observe(el); });
  }

  function animateCount(el) {
    var target = parseFloat(el.dataset.count) || 0;
    var duration = parseInt(el.dataset.duration, 10) || 1300;
    var start = performance.now();
    function frame(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      var current = Math.round(target * eased);
      el.textContent = formatNumber(current);
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = formatNumber(target);
    }
    requestAnimationFrame(frame);
  }

  function formatNumber(n) {
    return n.toLocaleString('ja-JP');
  }

  /* ---------- FAQ accordion ---------- */
  function setupAccordion() {
    var items = document.querySelectorAll('.faq__item');
    items.forEach(function (item) {
      var btn = item.querySelector('.faq__q');
      if (!btn) return;
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', function () {
        var isOpen = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });
  }

  /* ---------- Floating LINE CTA ---------- */
  function setupFloatingCta() {
    var cta = document.querySelector('.floating-cta');
    if (!cta) return;
    var threshold = 200;
    function check() {
      if (window.scrollY > threshold) cta.classList.add('is-visible');
      else cta.classList.remove('is-visible');
    }
    window.addEventListener('scroll', check, { passive: true });
    check();
    // Hide CTA when footer enters viewport so it doesn't cover the copyright.
    var footer = document.querySelector('.footer');
    if (footer && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) cta.classList.add('is-hidden-by-footer');
          else cta.classList.remove('is-hidden-by-footer');
        });
      }, { rootMargin: '0px 0px -40px 0px', threshold: 0 });
      io.observe(footer);
    }
  }
})();
