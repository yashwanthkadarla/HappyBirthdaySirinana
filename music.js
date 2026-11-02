/* Background music: starts when she taps "Open your surprise", loops until she
   leaves, pauses while any video plays, and comes back when videos stop. */
(function () {
  "use strict";
  var S = window.SITE || {};
  var cfg = S.music || {};
  if (cfg.enabled === false) return;

  var SRC = cfg.src || "bgm.mp3";
  var VOL = cfg.volume == null ? 0.45 : Math.max(0, Math.min(1, cfg.volume));

  var audio = new Audio();
  audio.src = SRC;
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0;

  var started = false, userMuted = false, fadeTimer = null, btn = null;

  /* ---- floating mute button ---- */
  var css = document.createElement("style");
  css.textContent =
    ".music-btn{position:fixed;right:14px;bottom:14px;z-index:48;width:48px;height:48px;border-radius:50%;border:0;" +
    "background:#f4b942;color:#1b0f23;font-size:1.35rem;line-height:1;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.4);" +
    "display:grid;place-items:center;transition:transform .2s}" +
    ".music-btn:hover{transform:scale(1.07)}" +
    ".music-btn:focus-visible{outline:2px solid #fff;outline-offset:3px}" +
    ".music-btn[hidden]{display:none}";
  document.head.appendChild(css);

  function makeBtn() {
    if (btn) return;
    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "music-btn";
    btn.addEventListener("click", function () {
      userMuted = !userMuted;
      if (!started) started = true;
      sync();
      paint();
    });
    document.body.appendChild(btn);
    paint();
  }
  function paint() {
    if (!btn) return;
    var on = !userMuted;
    btn.textContent = on ? "🔊" : "🔇";
    btn.setAttribute("aria-label", on ? "Mute the music" : "Play the music");
    btn.title = on ? "Mute the music" : "Play the music";
  }

  /* ---- smooth volume changes ---- */
  function fadeTo(v, ms, done) {
    clearInterval(fadeTimer);
    var from = audio.volume, t0 = performance.now();
    fadeTimer = setInterval(function () {
      var k = Math.min(1, (performance.now() - t0) / ms);
      try { audio.volume = from + (v - from) * k; } catch (e) {}
      if (k >= 1) { clearInterval(fadeTimer); if (done) done(); }
    }, 40);
  }

  function videoPlaying() {
    var v = document.querySelectorAll("video");
    for (var i = 0; i < v.length; i++) if (!v[i].paused && !v[i].ended) return true;
    return false;
  }
  function wanted() { return started && !userMuted && !videoPlaying() && !document.hidden; }

  function sync() {
    if (wanted()) {
      var p = audio.play();
      if (p && p.catch) p.catch(function () { userMuted = true; paint(); });
      fadeTo(VOL, 1600);
    } else {
      fadeTo(0, 450, function () { if (!wanted()) audio.pause(); });
    }
  }

  function start() {
    if (started) return;
    started = true;
    makeBtn();
    sync();
  }

  audio.addEventListener("error", function () {
    started = false;
    if (btn) btn.hidden = true;
  });

  /* ---- start on her first tap ---- */
  document.addEventListener("click", function (e) {
    if (e.target && e.target.closest && e.target.closest("#cd-open")) start();
  }, true);
  if (!document.getElementById("cd")) {
    document.addEventListener("pointerdown", start, { once: true });
  }

  /* ---- pause for videos, resume after ---- */
  ["play", "playing", "pause", "ended"].forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      if (e.target && e.target.tagName === "VIDEO") sync();
    }, true);
  });
  document.addEventListener("visibilitychange", sync);
})();
