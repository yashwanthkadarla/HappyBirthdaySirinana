(function () {
  "use strict";
  var S = window.SITE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  document.title = "Happy Birthday, " + S.name;
  $("#hero-name").textContent = S.name;

  /* ---------- gate ---------- */
  function setupGate() {
    var g = $("#gate");
    if (!S.gate || !S.gate.answer) { g.remove(); return; }
    $("#gate-q").textContent = S.gate.question;
    g.hidden = false;
    document.body.classList.add("locked");
    $("#gate-in").focus();
    $("#gate-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var v = $("#gate-in").value.trim().toLowerCase();
      if (v === S.gate.answer.trim().toLowerCase()) {
        g.remove();
        document.body.classList.remove("locked");
      } else {
        $("#gate-err").textContent = "Not quite. Try again.";
      }
    });
  }

  /* ---------- live counter ---------- */
  function diff(from, to) {
    var y = to.getFullYear() - from.getFullYear();
    var m = to.getMonth() - from.getMonth();
    var d = to.getDate() - from.getDate();
    var h = to.getHours() - from.getHours();
    var mi = to.getMinutes() - from.getMinutes();
    var s = to.getSeconds() - from.getSeconds();
    if (s < 0) { s += 60; mi--; }
    if (mi < 0) { mi += 60; h--; }
    if (h < 0) { h += 24; d--; }
    if (d < 0) { d += new Date(to.getFullYear(), to.getMonth(), 0).getDate(); m--; }
    if (m < 0) { m += 12; y--; }
    return { years: y, months: m, days: d, hours: h, minutes: mi, seconds: s };
  }

  function setupCounter() {
    var start = new Date(S.metDate);
    var wrap = $("#counter");
    var keys = ["years", "months", "days", "hours", "minutes", "seconds"];
    var cells = {};
    keys.forEach(function (k) {
      var u = el("div", "unit");
      var n = el("span", "num", "0");
      var l = el("span", "lbl", k);
      u.appendChild(n); u.appendChild(l); wrap.appendChild(u);
      cells[k] = { n: n, l: l };
    });
    function tick() {
      var now = new Date();
      var d = now < start ? { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 } : diff(start, now);
      keys.forEach(function (k) {
        cells[k].n.textContent = d[k];
        cells[k].l.textContent = d[k] === 1 ? k.slice(0, -1) : k;
      });
    }
    tick();
    setInterval(tick, 1000);
  }

  function setupHero() {
    var img = $("#hero-photo");
    img.alt = S.fullName || S.name;
    img.onerror = function () { img.remove(); };
    img.src = S.heroPhoto;
  }

  /* ---------- letter ---------- */
  function setupLetter() {
    var L = S.letter, body = $("#letter-body");
    body.appendChild(el("h3", null, L.title));
    L.paragraphs.forEach(function (p) { body.appendChild(el("p", null, p)); });
    body.appendChild(el("p", "signoff", L.signoff));
    body.appendChild(el("p", "sender", L.sender));
    var btn = $("#letter-btn"), wrap = $("#letter-wrap");
    btn.addEventListener("click", function () {
      var open = wrap.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
      btn.textContent = open ? "Close the letter" : "Open your letter";
    });
  }

  /* ---------- timeline ---------- */
  function setupTimeline() {
    var ol = $("#timeline");
    (S.timeline || []).forEach(function (t) {
      var li = el("li");
      li.appendChild(el("p", "t-date", t.date));
      li.appendChild(el("h3", "t-title", t.title));
      li.appendChild(el("p", "t-text", t.text));
      if (t.photo) {
        var img = el("img", "t-photo");
        img.src = t.photo; img.alt = t.title; img.loading = "lazy";
        img.onerror = function () { img.remove(); };
        li.appendChild(img);
      }
      ol.appendChild(li);
    });
  }

  /* ---------- gallery + lightbox ---------- */
  var lb = $("#lb"), lbImg = $("#lb-img"), lbCap = $("#lb-cap");
  var current = 0, list = [], lastFocus = null;

  function setupGallery() {
    var g = $("#gallery"), failed = 0, total = S.photoCount;
    for (var i = 1; i <= total; i++) {
      (function (n) {
        var b = el("button", "photo");
        b.type = "button";
        var cap = (S.captions && S.captions[n]) || "";
        b.setAttribute("aria-label", cap || ("Open photo " + n));
        var img = el("img", "pending");
        img.loading = "lazy"; img.decoding = "async";
        img.alt = cap || ("Photo " + n);
        img.addEventListener("load", function () { img.classList.remove("pending"); });
        img.addEventListener("error", function () {
          b.remove();
          failed++;
          if (failed === total) $("#gallery-empty").hidden = false;
        });
        img.src = "photos/" + n + "." + S.photoExt;
        b.appendChild(img);
        b.addEventListener("click", function () { openLb(b); });
        g.appendChild(b);
      })(i);
    }
  }

  function showLb(i) {
    list = Array.prototype.slice.call(document.querySelectorAll("#gallery .photo img"));
    if (!list.length) return;
    current = (i + list.length) % list.length;
    lbImg.src = list[current].src;
    lbImg.alt = list[current].alt;
    lbCap.textContent = (S.captions && S.captions[parseInt(list[current].src.split("/").pop(), 10)]) || (current + 1) + " / " + list.length;
  }
  function openLb(btn) {
    lastFocus = btn;
    var imgs = Array.prototype.slice.call(document.querySelectorAll("#gallery .photo"));
    lb.hidden = false;
    document.body.classList.add("locked");
    showLb(imgs.indexOf(btn));
    $(".lb-close").focus();
  }
  function closeLb() {
    lb.hidden = true;
    document.body.classList.remove("locked");
    if (lastFocus) lastFocus.focus();
  }
  function setupLightbox() {
    $(".lb-close").addEventListener("click", closeLb);
    $(".lb-prev").addEventListener("click", function () { showLb(current - 1); });
    $(".lb-next").addEventListener("click", function () { showLb(current + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") showLb(current - 1);
      if (e.key === "ArrowRight") showLb(current + 1);
    });
    var x0 = null;
    lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) showLb(current + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  /* ---------- videos ---------- */
  function setupVideos() {
    var box = $("#videos"), sec = $("#videos-section");
    var vids = S.videos || [];
    if (!vids.length) { sec.remove(); return; }
    vids.forEach(function (v) {
      var f = el("figure", "video");
      var vid = document.createElement("video");
      vid.controls = true; vid.playsInline = true; vid.preload = "metadata";
      if (v.poster) vid.poster = v.poster;
      vid.src = v.src + "#t=0.1";
      vid.addEventListener("error", function () {
        f.remove();
        if (!box.children.length) sec.remove();
      });
      vid.addEventListener("play", function () {
        document.querySelectorAll("#videos video").forEach(function (o) { if (o !== vid) o.pause(); });
      });
      f.appendChild(vid);
      var cap = el("figcaption");
      cap.appendChild(el("strong", null, v.title));
      if (v.text) cap.appendChild(el("span", null, v.text));
      f.appendChild(cap);
      box.appendChild(f);
    });
  }

  /* ---------- finale ---------- */
  function petals() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var c = $("#petals"), ctx = c.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    var colors = ["#f4b942", "#f08a3c", "#ee6a95", "#ffd98a"];
    var W = innerWidth, H = innerHeight, ps = [], stopSpawn = performance.now() + 5000;
    function make() {
      return { x: Math.random() * W, y: -20 - Math.random() * H * 0.6, r: 6 + Math.random() * 8,
        vy: 1 + Math.random() * 1.8, vx: (Math.random() - 0.5), rot: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.08, sw: Math.random() * 6.28, col: colors[(Math.random() * colors.length) | 0] };
    }
    for (var i = 0; i < 90; i++) ps.push(make());
    (function frame() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (var i = ps.length - 1; i >= 0; i--) {
        var p = ps[i];
        p.sw += 0.03; p.x += p.vx + Math.sin(p.sw) * 0.8; p.y += p.vy; p.rot += p.vr;
        if (p.y > H + 30) {
          if (performance.now() < stopSpawn) { ps[i] = make(); continue; }
          ps.splice(i, 1); continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, 6.28); ctx.fill();
        ctx.restore();
      }
      if (ps.length) requestAnimationFrame(frame); else ctx.clearRect(0, 0, W, H);
    })();
  }

  function setupFinale() {
    var btn = $("#finale-btn"), msg = $("#finale-msg");
    btn.textContent = S.finale.button;
    msg.textContent = S.finale.message;
    btn.addEventListener("click", function () {
      btn.hidden = true;
      msg.hidden = false;
      msg.focus({ preventScroll: true });
      petals();
    });
  }

  $("#footer-text").textContent = "Made with love by " + S.from + " for " + S.fullName;

  /* ---------- countdown lock ---------- */
  var started = false;
  function startSite() {
    if (started) return;
    started = true;
    setupCounter();
    setupHero();
    setupLetter();
    setupTimeline();
    setupGallery();
    setupLightbox();
    setupVideos();
    setupFinale();
  }

  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }

  function setupCountdown() {
    var C = S.countdown, cd = $("#cd");
    var target = new Date(S.unlockAt).getTime();
    if (isNaN(target)) target = 0;

    $("#cd-title").textContent = C.title;
    $("#cd-note").textContent = C.note;

    var bits = [];
    if (S.photoCount > 0) bits.push(plural(S.photoCount, "photo"));
    if ((S.videos || []).length) bits.push(plural(S.videos.length, "video"));
    bits.push("one letter");
    var last = bits.pop();
    $("#cd-teaser").textContent = (bits.length ? bits.join(", ") + " and " : "") + last + " are waiting behind this door.";

    var keys = ["days", "hours", "minutes", "seconds"], cells = {};
    var wrap = $("#cd-counter");
    keys.forEach(function (k) {
      var u = el("div", "unit");
      var n = el("span", "num", "00");
      var l = el("span", "lbl", k);
      u.appendChild(n); u.appendChild(l); wrap.appendChild(u);
      cells[k] = { n: n, l: l };
    });

    var timer = null;
    function pad(n) { return n < 10 ? "0" + n : String(n); }

    function reveal() {
      cd.classList.add("open");
      $("#cd-title").textContent = C.openTitle;
      $("#cd-note").textContent = "";
      var b = $("#cd-open");
      b.textContent = C.openButton;
      b.hidden = false;
      b.focus({ preventScroll: true });
      b.addEventListener("click", function () {
        cd.remove();
        $("#site").hidden = false;
        window.scrollTo(0, 0);
        startSite();
      });
      petals();
    }

    function tick() {
      var ms = target - Date.now();
      if (ms <= 0) {
        if (timer) clearInterval(timer);
        reveal();
        return;
      }
      var sec = Math.floor(ms / 1000);
      var v = {
        days: Math.floor(sec / 86400),
        hours: Math.floor(sec % 86400 / 3600),
        minutes: Math.floor(sec % 3600 / 60),
        seconds: sec % 60
      };
      keys.forEach(function (k) {
        cells[k].n.textContent = pad(v[k]);
        cells[k].l.textContent = v[k] === 1 ? k.slice(0, -1) : k;
      });
    }

    tick();
    if (target - Date.now() > 0) timer = setInterval(tick, 1000);
  }

  setupGate();
  setupCountdown();
})();
