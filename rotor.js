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
    var COLS = 64, ROWS = 36, CW = 3, CH = 5, RAMP = ' .:-=+*#%@';
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

/* Pixel resolve: text arrives as coarse pixels and sharpens in a few steps,
   the way the logo's idea of discrete rules becoming continuous motion reads
   in type. Runs once per element: the hero name on load, the statement's key
   phrase when it scrolls into view. The real text stays in the DOM (it is
   only made transparent while a canvas draws the steps over it). */
(function () {
  'use strict';
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var STEPS = [18, 11, 6, 3, 0];
  var STEP_MS = 120;

  function resolve(el) {
    var rects = el.getClientRects();
    if (rects.length !== 1) return;                      /* only single-line text */
    var r = rects[0], cs = getComputedStyle(el);
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var W = Math.ceil(r.width) + 8, H = Math.ceil(r.height) + 8;
    var cv = document.createElement('canvas');
    cv.setAttribute('aria-hidden', 'true');
    cv.className = 'resolve-canvas';
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.cssText = 'position:absolute;left:' + (r.left + window.scrollX - 4) + 'px;top:' + (r.top + window.scrollY - 4) + 'px;width:' + W + 'px;height:' + H + 'px;pointer-events:none;z-index:5;';
    document.body.appendChild(cv);
    var c = cv.getContext('2d');
    var font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    var color = cs.color;
    var base = 4 + (r.height + parseFloat(cs.fontSize) * 0.72) / 2;   /* optical baseline in the box */
    var small = document.createElement('canvas'), sc = small.getContext('2d');
    var rgb = color.match(/\d+(\.\d+)?/g).map(Number);
    el.style.color = 'transparent';
    var i = 0;
    function draw() {
      var b = STEPS[i];
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, cv.width, cv.height);
      if (!b) { cv.remove(); el.style.color = ''; return; }
      var sw = Math.max(1, Math.ceil(W / b)), sh = Math.max(1, Math.ceil(H / b));
      small.width = sw; small.height = sh;
      sc.setTransform(1 / b, 0, 0, 1 / b, 0, 0);
      sc.font = font; sc.textBaseline = 'alphabetic';
      sc.letterSpacing = cs.letterSpacing;
      sc.fillStyle = '#000';
      sc.fillText(el.textContent, 4, base);
      var img = sc.getImageData(0, 0, sw, sh), d = img.data;
      for (var k = 0; k < d.length; k += 4) { var on = d[k + 3] > 90; d[k] = rgb[0]; d[k + 1] = rgb[1]; d[k + 2] = rgb[2]; d[k + 3] = on ? 255 : 0; }
      sc.putImageData(img, 0, 0);
      c.imageSmoothingEnabled = false;
      c.drawImage(small, 0, 0, sw * b * dpr, sh * b * dpr);
      i++;
      setTimeout(draw, STEP_MS);
    }
    draw();
  }

  function whenFonts(fn) { (document.fonts && document.fonts.ready) ? document.fonts.ready.then(fn) : fn(); }

  whenFonts(function () {
    var name = document.querySelector('.hero-name');
    if (name) resolve(name);
    var phrase = document.querySelector('.statement .resolve');
    if (phrase && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { io.disconnect(); resolve(phrase); }
      }, { threshold: 1 });
      io.observe(phrase);
    }
  });
})();
