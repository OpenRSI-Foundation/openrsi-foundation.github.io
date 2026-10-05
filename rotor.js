/* OpenRSI hero rotor and project cover.
   The rotor draws the OpenRSI mark as ASCII text and turns it slowly about the
   centre of its three tips. The Index project card gets a still, dotted
   star-trail cover. Both respect prefers-reduced-motion. */
(function () {
  'use strict';
  var MARK = new Path2D('M495.986 311.192C497.04 309.836 499.231 310.974 498.639 312.587C482.458 356.71 452.435 395.512 403.923 425.563C403.484 425.834 402.93 425.862 402.468 425.631C381.774 415.283 364.497 401.644 350.186 386.152C349.304 385.198 350.01 383.66 351.309 383.646C419.504 382.865 467.394 347.977 495.986 311.192ZM331.52 209.529C332.798 209.15 333.889 210.52 333.28 211.706C313.2 250.824 315.716 309.208 327.904 351.492C328.391 353.181 326.078 354.269 325.167 352.767C299.069 309.756 289.372 261.3 289.213 229.361C289.21 228.856 289.463 228.396 289.886 228.122C301.965 220.273 316.132 214.081 331.52 209.529ZM370.312 204.746C368.498 204.611 368.339 201.977 370.146 201.766C420.911 195.855 476.548 204.811 513.106 228.149C513.547 228.43 513.802 228.921 513.787 229.443C513.317 245.547 511.659 261.299 508.651 276.577C508.378 277.964 506.49 278.23 505.788 277.002C487.09 244.281 439.705 209.929 370.312 204.746Z');
  var CX = 402, CY = 295, R = 134;          // rotation centre (centre of the three tips) and radius
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function drawMark(c, x, y, diameter, angle, color) {
    var s = diameter / (2 * R);
    c.save(); c.translate(x, y); c.rotate(angle); c.scale(s, s); c.translate(-CX, -CY);
    c.fillStyle = color; c.fill(MARK); c.restore();
  }

  /* ---------- ASCII rotor ---------- */
  var pre = document.querySelector('.rotor');
  if (pre) {
    var COLS = 56, ROWS = 32, CW = 3, CH = 5, RAMP = ' .:-=+*#%@';
    var off = document.createElement('canvas');
    off.width = COLS * CW; off.height = ROWS * CH;
    var oc = off.getContext('2d', { willReadFrequently: true });
    var theta = 0.4, last = 0, visible = true;

    var render = function () {
      oc.fillStyle = '#000'; oc.fillRect(0, 0, off.width, off.height);
      drawMark(oc, off.width / 2, off.height / 2, off.height - 4, theta, '#fff');
      var d = oc.getImageData(0, 0, off.width, off.height).data, out = '';
      for (var r = 0; r < ROWS; r++) {
        for (var q = 0; q < COLS; q++) {
          var sum = 0;
          for (var y = 0; y < CH; y++) for (var x = 0; x < CW; x++) sum += d[((r * CH + y) * off.width + q * CW + x) * 4];
          out += RAMP[Math.min(9, Math.floor(sum / (CW * CH * 255) * 10))];
        }
        if (r < ROWS - 1) out += '\n';
      }
      pre.textContent = out;
    };
    render();

    if (!reduce) {
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(pre);
      }
      var tick = function (now) {
        if (visible && !document.hidden && now - last > 60) { theta += 0.012; render(); last = now; }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* ---------- dotted star-trail cover for the Index card ---------- */
  var cover = document.querySelector('.project-cover');
  if (cover) {
    var seed = 7, rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    var stars = [];
    for (var i = 0; i < 260; i++) stars.push({ rad: Math.pow(rnd(), 0.6), phi: rnd() * Math.PI * 2, b: 0.2 + Math.pow(rnd(), 3) * 0.8 });
    var paint = function () {
      var box = cover.getBoundingClientRect();
      if (!box.width || !box.height) return;
      var dpr = Math.min(2, window.devicePixelRatio || 1), W = box.width, H = box.height;
      cover.width = Math.round(W * dpr); cover.height = Math.round(H * dpr);
      var c = cover.getContext('2d');
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      var cx = W / 2, cy = H * 0.5, Rmax = Math.hypot(W, H) * 0.8;
      for (var s = 0; s < stars.length; s++) {
        var st = stars[s], rr = 12 + st.rad * Rmax, dot = 0.45 + st.b * 0.9;
        for (var k = 0; k < 12; k++) {
          var a = st.phi - k * 9 / Math.max(30, rr), x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a);
          if (x < -2 || x > W + 2 || y < -2 || y > H + 2) continue;
          c.fillStyle = 'rgba(240,240,240,' + (st.b * 0.7 * (1 - k / 14)).toFixed(3) + ')';
          c.beginPath(); c.arc(x, y, dot, 0, Math.PI * 2); c.fill();
        }
      }
      drawMark(c, cx, cy, 30, 0, '#f0f0f0');
    };
    paint();
    var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(paint, 120); });
  }
})();
