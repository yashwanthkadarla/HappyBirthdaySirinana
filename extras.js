(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var S = window.SITE || {};

  /* =====================================================
     1) PHOTOS SCROLL FROM RIGHT TO LEFT, ONE AFTER ANOTHER
     ===================================================== */
  (function marquee() {
    var g = document.getElementById("gallery");
    var sec = document.getElementById("gallery-section");
    var lb = document.getElementById("lb");
    if (!g || !sec) return;

    var track, built = false, pos = 0, last = 0, W = 0, fr = null, fc = null;
    var hover = false, touching = false, visible = true;

    function lbOpen() { return lb && !lb.hidden; }

    function makeClone(tile) {
      var orig = tile.querySelector("img");
      var c = document.createElement("div");
      c.className = "mq-tile mq-clone";
      c.setAttribute("aria-hidden", "true");
      var im = document.createElement("img");
      im.loading = "lazy"; im.decoding = "async"; im.alt = "";
      im.src = orig.currentSrc || orig.src;
      im.addEventListener("error", function () { c.remove(); });
      orig.addEventListener("error", function () { c.remove(); });
      c.appendChild(im);
      c.addEventListener("click", function () { if (tile.isConnected) tile.click(); });
      return c;
    }

    function measure() {
      if (!fr || !fr.isConnected) fr = track.querySelector(".photo");
      if (!fc || !fc.isConnected) fc = track.querySelector(".mq-clone");
      if (fr && fc) W = fc.offsetLeft - fr.offsetLeft;
    }

    function build() {
      if (built) return;
      var tiles = Array.prototype.filter.call(g.children, function (n) { return n.classList.contains("photo"); });
      if (!tiles.length) return;
      built = true;

      sec.classList.add("mq-on");
      g.classList.add("marquee");
      track = document.createElement("div");
      track.className = "mq-track";
      tiles.forEach(function (t) { t.classList.add("mq-tile"); track.appendChild(t); });
      g.appendChild(track);

      if (reduced) { g.classList.add("mq-static"); return; }

      tiles.forEach(function (t) { track.appendChild(makeClone(t)); });
      measure();
      var sets = 1;
      while (W > 0 && track.scrollWidth < W + g.clientWidth + 60 && sets < 8) {
        tiles.forEach(function (t) { track.appendChild(makeClone(t)); });
        sets++;
      }

      g.addEventListener("mouseenter", function () { hover = true; });
      g.addEventListener("mouseleave", function () { hover = false; });
      g.addEventListener("touchstart", function () { touching = true; }, { passive: true });
      g.addEventListener("touchend", function () { setTimeout(function () { touching = false; }, 1200); }, { passive: true });
      if (window.IntersectionObserver) {
        new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(g);
      }
      requestAnimationFrame(frame);
    }

    function frame(t) {
      requestAnimationFrame(frame);
      var dt = last ? Math.min((t - last) / 1000, 0.1) : 0;
      last = t;
      if (!visible || hover || touching || lbOpen()) return;
      measure();
      if (W <= 0) return;
      var speed = g.clientWidth < 700 ? 45 : 65;   // pixels per second
      pos -= speed * dt;
      if (-pos >= W) pos += W;
      track.style.transform = "translate3d(" + pos + "px,0,0)";
    }

    // the gallery is filled in after she taps "Open your surprise"
    var timer = null;
    var mo = new MutationObserver(function () {
      if (built) return;
      clearTimeout(timer);
      timer = setTimeout(function () { build(); if (built) mo.disconnect(); }, 600);
    });
    mo.observe(g, { childList: true });
    if (g.children.length) timer = setTimeout(build, 600);
  })();

  /* =====================================================
     2) THE BLUE PANDA WHO BRINGS FLOWERS AND SAYS BIRTHDAY WISHES
        (change the wishes here, or add  bunnyWishes: [...]  to config.js)
     ===================================================== */
  (function bunny() {
    var fin = document.getElementById("finale");
    if (!fin) return;

    var WISHES = (S.bunnyWishes && S.bunnyWishes.length) ? S.bunnyWishes : [
      "Happy Birthday, Siri! 🎂",
      "These flowers are for the most special girl 💐",
      "Wishing you a year full of smiles and sweet surprises ✨",
      "You make every single day brighter 🌸",
      "Close your eyes and make a wish, my love 🕯️",
      "Love you always 💛"
    ];

    var svg =
      '<svg viewBox="0 0 330 360" role="img" aria-label="A cute cartoon blue panda holding a bouquet of flowers">' +
      '<defs><g id="fl"><g fill="currentColor">' +
        '<ellipse cx="0" cy="-10" rx="7" ry="11"/><ellipse cx="0" cy="-10" rx="7" ry="11" transform="rotate(60)"/>' +
        '<ellipse cx="0" cy="-10" rx="7" ry="11" transform="rotate(120)"/><ellipse cx="0" cy="-10" rx="7" ry="11" transform="rotate(180)"/>' +
        '<ellipse cx="0" cy="-10" rx="7" ry="11" transform="rotate(240)"/><ellipse cx="0" cy="-10" rx="7" ry="11" transform="rotate(300)"/>' +
      '</g><circle r="5.5" fill="#fff3c4"/></g></defs>' +
      // round ears
      '<g class="ear"><circle cx="107" cy="104" r="26" fill="#1f3a73"/><circle cx="107" cy="104" r="12" fill="#3b5fa8"/></g>' +
      '<g class="ear r"><circle cx="223" cy="104" r="26" fill="#1f3a73"/><circle cx="223" cy="104" r="12" fill="#3b5fa8"/></g>' +
      // feet + body
      '<ellipse cx="124" cy="334" rx="32" ry="15" fill="#1f3a73"/><ellipse cx="206" cy="334" rx="32" ry="15" fill="#1f3a73"/>' +
      '<ellipse cx="165" cy="272" rx="72" ry="70" fill="#bcd9fa" stroke="#8fb7e6" stroke-width="2"/>' +
      '<ellipse cx="165" cy="284" rx="46" ry="48" fill="#e6f1ff"/>' +
      // resting arm
      '<ellipse cx="100" cy="266" rx="17" ry="40" fill="#1f3a73" transform="rotate(14 100 266)"/>' +
      // head
      '<ellipse cx="165" cy="155" rx="76" ry="64" fill="#e6f1ff" stroke="#8fb7e6" stroke-width="2"/>' +
      // eye patches + eyes
      '<ellipse cx="134" cy="150" rx="15" ry="20" fill="#1f3a73" transform="rotate(22 134 150)"/>' +
      '<ellipse cx="196" cy="150" rx="15" ry="20" fill="#1f3a73" transform="rotate(-22 196 150)"/>' +
      '<g class="eyes"><circle cx="136" cy="148" r="8" fill="#fff"/><circle cx="194" cy="148" r="8" fill="#fff"/>' +
        '<circle cx="137" cy="149" r="4.6" fill="#0f1e45"/><circle cx="193" cy="149" r="4.6" fill="#0f1e45"/>' +
        '<circle cx="138.5" cy="147" r="1.6" fill="#fff"/><circle cx="194.5" cy="147" r="1.6" fill="#fff"/></g>' +
      '<ellipse cx="108" cy="178" rx="12" ry="7" fill="#f7a8bd" opacity=".55"/><ellipse cx="222" cy="178" rx="12" ry="7" fill="#f7a8bd" opacity=".55"/>' +
      '<ellipse cx="165" cy="170" rx="10" ry="7" fill="#1f3a73"/>' +
      '<path d="M165 177 V183 M165 183 Q157 192 149 185 M165 183 Q173 192 181 185" stroke="#1f3a73" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
      // gold bow tie
      '<polygon points="165,224 138,210 138,238" fill="#f4b942"/><polygon points="165,224 192,210 192,238" fill="#f4b942"/><circle cx="165" cy="224" r="7" fill="#d99a1c"/>' +
      // arm + bouquet
      '<g class="arm"><ellipse cx="228" cy="264" rx="17" ry="40" fill="#1f3a73" transform="rotate(-14 228 264)"/>' +
        '<g class="bq">' +
          '<g stroke="#4f9a5a" stroke-width="4" stroke-linecap="round"><line x1="232" y1="258" x2="206" y2="216"/><line x1="232" y1="258" x2="232" y2="202"/><line x1="232" y1="258" x2="258" y2="216"/></g>' +
          '<ellipse cx="210" cy="252" rx="7" ry="14" fill="#5aa96a" transform="rotate(-50 210 252)"/><ellipse cx="254" cy="252" rx="7" ry="14" fill="#5aa96a" transform="rotate(50 254 252)"/>' +
          '<use href="#fl" transform="translate(206 214) scale(1.15)" style="color:#f4b942"/>' +
          '<use href="#fl" transform="translate(258 214) scale(1.15)" style="color:#ee6a95"/>' +
          '<use href="#fl" transform="translate(232 198) scale(1.3)" style="color:#fff0d6"/>' +
          '<polygon points="232,314 200,256 264,256" fill="#f48fb1" stroke="#e06b93" stroke-width="2"/>' +
          '<path d="M208 272 Q232 281 256 272" stroke="#f4b942" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '</g>' +
        '<circle cx="232" cy="298" r="12" fill="#1f3a73"/>' +
      '</g></svg>';

    var sec = document.createElement("section");
    sec.id = "bunny";
    sec.className = "section bunny";
    sec.innerHTML =
      '<h2>Someone is here to wish you \uD83C\uDF38</h2>' +
      '<div class="bunny-scene">' +
        '<div class="bunny-wrap" id="bunny-wrap"><div class="bunny-hop">' + svg + '</div></div>' +
        '<div class="bubble"><p id="bubble-text"></p></div>' +
      '</div>';
    fin.parentNode.insertBefore(sec, fin);

    var wrap = document.getElementById("bunny-wrap");
    var text = document.getElementById("bubble-text");
    var i = 0, wishTimer = null, heartTimer = null;
    text.textContent = WISHES[0];

    function show(n) {
      i = n % WISHES.length;
      text.classList.add("fade");
      setTimeout(function () { text.textContent = WISHES[i]; text.classList.remove("fade"); }, 350);
    }
    function hearts(n) {
      if (reduced) return;
      var icons = ["\uD83D\uDC9B", "\uD83C\uDF38", "\uD83D\uDC96", "\u2728"];
      for (var k = 0; k < n; k++) {
        (function () {
          var s = document.createElement("span");
          s.className = "bun-heart";
          s.textContent = icons[Math.floor(Math.random() * icons.length)];
          s.style.left = (55 + Math.random() * 35) + "%";
          s.style.setProperty("--hx", ((Math.random() * 2 - 1) * 40) + "px");
          wrap.appendChild(s);
          setTimeout(function () { s.remove(); }, 2300);
        })();
      }
    }
    function start() {
      if (wishTimer) return;
      wishTimer = setInterval(function () { show(i + 1); }, 3800);
      heartTimer = setInterval(function () { hearts(1); }, 2600);
    }
    function stop() {
      clearInterval(wishTimer); clearInterval(heartTimer);
      wishTimer = heartTimer = null;
    }

    wrap.addEventListener("click", function () { show(i + 1); hearts(6); });

    if (window.IntersectionObserver) {
      new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) { sec.classList.add("in"); start(); }
        else stop();
      }, { threshold: 0.35 }).observe(sec);
    } else { sec.classList.add("in"); start(); }
  })();
})();
