(function () {
  "use strict";

  function el(cls) { var d = document.createElement("div"); d.className = cls; return d; }

  function defs() {
    if (document.getElementById("bdefs")) return;
    var w = document.createElement("div");
    w.innerHTML =
      '<svg id="bdefs" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +
      '<radialGradient id="gold1" cx="35%" cy="28%" r="75%"><stop offset="0" stop-color="#fff3bf"/><stop offset=".3" stop-color="#f9d35c"/><stop offset=".7" stop-color="#e0a21f"/><stop offset="1" stop-color="#a86d0e"/></radialGradient>' +
      '<radialGradient id="gold2" cx="35%" cy="28%" r="75%"><stop offset="0" stop-color="#ffe9a0"/><stop offset=".3" stop-color="#f2bf3a"/><stop offset=".7" stop-color="#cf8f16"/><stop offset="1" stop-color="#8f5a08"/></radialGradient>' +
      '</defs></svg>';
    document.body.appendChild(w.firstChild);
  }

  function balloonSVG(g, len) {
    var h = 127 + len, q = len / 4, half = len / 2;
    return '<svg viewBox="0 0 100 ' + h + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<path d="M50 3 C79 3 96 29 96 56 C96 90 71 111 50 116 C29 111 4 90 4 56 C4 29 21 3 50 3 Z" fill="url(#gold' + g + ')"/>' +
      '<ellipse cx="32" cy="32" rx="9" ry="16" transform="rotate(25 32 32)" fill="#fff" opacity=".45"/>' +
      '<path d="M50 114 L43 127 L57 127 Z" fill="#b9780f"/>' +
      '<path d="M50 127 q -6 ' + q + ' 0 ' + half + ' t 0 ' + half + '" fill="none" stroke="#f6dc94" stroke-opacity=".8" stroke-width="1.3"/>' +
      '</svg>';
  }

  var SPECS = {
    left: [
      { w: 80, x: 0,   L: 150, d: 5.4, a: 5, dl: 0,    g: 1 },
      { w: 62, x: 56,  L: 240, d: 6.6, a: 6, dl: -2,   g: 2 },
      { w: 54, x: 104, L: 110, d: 4.8, a: 7, dl: -3.5, g: 1 }
    ],
    right: [
      { w: 56, x: 0,   L: 120, d: 5.0, a: 7, dl: -1,   g: 2 },
      { w: 76, x: 50,  L: 210, d: 6.2, a: 5, dl: -2.8, g: 1 },
      { w: 58, x: 102, L: 140, d: 4.6, a: 6, dl: -0.5, g: 2 }
    ]
  };

  function cluster(side) {
    var c = el("cluster " + side);
    SPECS[side].forEach(function (b) {
      var d = el("balloon");
      d.style.cssText = "--w:" + b.w + ";--x:" + b.x + ";--d:" + b.d + "s;--a:" + b.a + "deg;--dl:" + b.dl + "s";
      d.innerHTML = balloonSVG(b.g, b.L);
      c.appendChild(d);
    });
    return c;
  }

  function rise() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    defs();
    var layer = el("rise-layer");
    document.body.appendChild(layer);
    for (var i = 0; i < 16; i++) {
      var d = el("rise");
      var w = 44 + Math.random() * 44;
      d.style.cssText = "left:" + (Math.random() * 90) + "%;width:" + w + "px;--rd:" + (7 + Math.random() * 5) +
        "s;--rl:" + (Math.random() * 2.2) + "s;--sx:" + ((Math.random() * 2 - 1) * 40) + "px";
      var inner = el("rise-in");
      inner.innerHTML = balloonSVG(i % 2 ? 2 : 1, 90);
      d.appendChild(inner);
      layer.appendChild(d);
    }
    setTimeout(function () { layer.remove(); }, 16000);
  }

  defs();

  var cd = document.getElementById("cd");
  if (cd) {
    var wrap = el("balloons");
    wrap.appendChild(cluster("left"));
    wrap.appendChild(cluster("right"));
    cd.insertBefore(wrap, cd.firstChild);

    // release balloons the moment the countdown hits zero (or if she opens it after midnight)
    if (cd.classList.contains("open")) {
      rise();
    } else if (window.MutationObserver) {
      var mo = new MutationObserver(function () {
        if (cd.classList.contains("open")) { mo.disconnect(); rise(); }
      });
      mo.observe(cd, { attributes: true, attributeFilter: ["class"] });
    }
  }

  var open = document.getElementById("cd-open");
  if (open) open.addEventListener("click", rise);
  var fin = document.getElementById("finale-btn");
  if (fin) fin.addEventListener("click", rise);
})();
