/* One video at a time. Swipe (or use the arrows) for the next one.
   Optional: add  videoAutoSlide: true  to config.js to make them slide by themselves. */
(function () {
  "use strict";
  var S = window.SITE || {};
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DWELL = Math.max(2, Number(S.videoSlideSeconds) || 4.5) * 1000;
  var AUTO = S.videoAutoSlide === true;

  var box = document.getElementById("videos");
  var sec = document.getElementById("videos-section");
  if (!box || !sec) return;

  var css = document.createElement("style");
  css.textContent =
    "#videos-section.vs-on{max-width:640px}" +
    "#videos.vs{display:flex;gap:1rem;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;" +
    "scrollbar-width:none;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;padding-bottom:.3rem}" +
    "#videos.vs::-webkit-scrollbar{display:none}" +
    "#videos.vs .video{flex:0 0 100%;scroll-snap-align:center;scroll-snap-stop:always}" +
    "#videos.vs .video video{width:100%;height:min(62vh,480px);max-height:none;object-fit:contain;background:#000}" +
    ".vs-count{align-self:center;min-width:4.2em;text-align:center;color:#c8b4cc;font-variant-numeric:tabular-nums}" +
    ".vs-nav{display:flex;justify-content:center;gap:.8rem;margin-top:1.1rem}" +
    ".vs-nav button{width:44px;height:44px;border-radius:50%;border:0;background:#f4b942;color:#1b0f23;" +
    "font-size:1.6rem;line-height:1;cursor:pointer;padding:0 0 3px}" +
    ".vs-nav button:hover{background:#ffcb61}" +
    ".vs-nav button:focus-visible{outline:2px solid #fff;outline-offset:3px}";
  document.head.appendChild(css);

  var built = false, hover = false, visible = true, holdUntil = 0;

  function hold(ms) { holdUntil = Date.now() + (ms || DWELL * 1.5); }
  function playing() {
    var v = box.querySelectorAll("video");
    for (var i = 0; i < v.length; i++) if (!v[i].paused && !v[i].ended) return true;
    return false;
  }
  function step() {
    var c = box.children;
    return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : box.clientWidth;
  }
  function go(dir) {
    var max = box.scrollWidth - box.clientWidth;
    if (max <= 0) return;
    if (dir > 0) {
      if (box.scrollLeft >= max - 6) box.scrollTo({ left: 0, behavior: "smooth" });
      else box.scrollBy({ left: step(), behavior: "smooth" });
    } else {
      if (box.scrollLeft <= 6) box.scrollTo({ left: max, behavior: "smooth" });
      else box.scrollBy({ left: -step(), behavior: "smooth" });
    }
  }

  function build() {
    if (built || !box.children.length) return;
    built = true;
    box.classList.add("vs");
    sec.classList.add("vs-on");

    var nav = document.createElement("div");
    nav.className = "vs-nav";
    var prev = document.createElement("button");
    prev.type = "button"; prev.textContent = "‹";
    prev.setAttribute("aria-label", "Previous video");
    var next = document.createElement("button");
    next.type = "button"; next.textContent = "›";
    next.setAttribute("aria-label", "Next video");
    prev.addEventListener("click", function () { hold(); go(-1); });
    next.addEventListener("click", function () { hold(); go(1); });
    var count = document.createElement("span");
    count.className = "vs-count";
    count.setAttribute("aria-live", "polite");
    nav.appendChild(prev); nav.appendChild(count); nav.appendChild(next);
    function updateCount() {
      var n = box.children.length;
      var i = Math.min(n - 1, Math.max(0, Math.round(box.scrollLeft / (step() || 1))));
      count.textContent = (i + 1) + " / " + n;
    }
    updateCount();
    box.addEventListener("scroll", updateCount, { passive: true });
    box.parentNode.insertBefore(nav, box.nextSibling);

    box.addEventListener("mouseenter", function () { hover = true; });
    box.addEventListener("mouseleave", function () { hover = false; hold(DWELL); });
    ["touchstart", "wheel", "keydown", "pointerdown"].forEach(function (ev) {
      box.addEventListener(ev, function () { hold(DWELL * 2); }, { passive: true });
    });
    ["pause", "ended"].forEach(function (ev) {
      box.addEventListener(ev, function () { hold(); }, true);
    });
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }, { threshold: 0.3 }).observe(box);
    }
    if (AUTO && !reduced) {
      setInterval(function () {
        if (!visible || hover || document.hidden || playing() || Date.now() < holdUntil) return;
        go(1);
      }, DWELL);
    }
  }

  // the videos are created after she taps "Open your surprise"
  var timer = null;
  var mo = new MutationObserver(function () {
    clearTimeout(timer);
    timer = setTimeout(function () { build(); if (built) mo.disconnect(); }, 300);
  });
  mo.observe(box, { childList: true });
  if (box.children.length) build();
})();
