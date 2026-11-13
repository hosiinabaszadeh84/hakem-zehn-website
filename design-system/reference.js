/* ==========================================================================
   Hakem Zehn Reference System v3 — Interactive Visual & Editorial Engine
   Zero Dependencies — Pure Vanilla ES5+ — Works Offline / Static
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Reading Progress Bar & Scroll Reveal Choreography
     ------------------------------------------------------------------------ */
  var progressFill = document.getElementById('hz-progress-fill');
  var dockRingFill = document.querySelector('.hz-dock-ring-fill');
  var persianDigitsMap = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  function toPersianPct(ratio) {
    return (
      Math.round(ratio * 100)
        .toString()
        .replace(/\d/g, function (d) {
          return persianDigitsMap[Number(d)];
        }) + '٪'
    );
  }

  function updateReadingProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
    if (progressFill) {
      progressFill.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
    }
    if (dockRingFill) {
      var circumference = 119.38;
      dockRingFill.style.strokeDashoffset = (circumference * (1 - ratio)).toFixed(2);
    }
    var dockProgEl = document.getElementById('hz-dock-sheet-progress');
    if (dockProgEl) {
      dockProgEl.textContent = 'پیشرفت مطالعه در این صفحه: ' + toPersianPct(ratio);
    }
  }

  window.addEventListener('scroll', updateReadingProgress, { passive: true });
  window.addEventListener('resize', updateReadingProgress);
  updateReadingProgress();

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cinemaInterludes = Array.prototype.slice.call(document.querySelectorAll('.hz-cinema-interlude'));
  var parallaxTicking = false;

  var heroStage = document.getElementById('hero');
  var heroScrollCue = document.getElementById('hz-scroll-cue');

  function updateCinemaParallax() {
    parallaxTicking = false;
    var scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    if (heroScrollCue) {
      heroScrollCue.classList.toggle('is-scrolled', scrollTop > 96);
    }
    if (prefersReducedMotion) return;
    var vh = window.innerHeight || 800;
    if (heroStage && scrollTop < vh * 1.25) {
      var heroSpan = Math.max(480, heroStage.offsetHeight || vh);
      var heroProgress = Math.min(1, Math.max(0, scrollTop / heroSpan));
      heroStage.style.setProperty('--hz-hero-parallax', (heroProgress * 68).toFixed(2) + 'px');
      heroStage.style.setProperty('--hz-hero-scale', (1 + heroProgress * 0.13).toFixed(4));
      heroStage.style.setProperty('--hz-hero-dim', (1 - heroProgress * 0.56).toFixed(3));
      heroStage.style.setProperty('--hz-hero-glow-shift', (-heroProgress * 26).toFixed(2) + 'px');
      heroStage.style.setProperty('--hz-hero-copy-parallax', (-heroProgress * 28).toFixed(2) + 'px');
      heroStage.style.setProperty('--hz-hero-copy-opacity', (1 - heroProgress * 0.72).toFixed(3));
    }
    cinemaInterludes.forEach(function (fig) {
      if (!fig.classList.contains('is-visible')) return;
      var rect = fig.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      var centerOffset = (rect.top + rect.height / 2 - vh / 2) / vh;
      var shift = Math.max(-12, Math.min(12, centerOffset * 20));
      fig.style.setProperty('--hz-parallax-y', shift.toFixed(2) + 'px');
    });
  }

  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.hz-reveal'));
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObs = new IntersectionObserver(
      function (entries) {
        var changed = false;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObs.unobserve(entry.target);
            changed = true;
          }
        });
        if (changed) updateCinemaParallax();
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      revealObs.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  if (!prefersReducedMotion && (cinemaInterludes.length || heroStage || heroScrollCue)) {
    window.addEventListener(
      'scroll',
      function () {
        if (!parallaxTicking) {
          parallaxTicking = true;
          window.requestAnimationFrame(updateCinemaParallax);
        }
      },
      { passive: true }
    );
    updateCinemaParallax();
  }

  /* ------------------------------------------------------------------------
     1b. Living Sovereign Brain Neural Canvas (Real-Time Synaptic Pulses + 3D Rings)
     ------------------------------------------------------------------------ */
  (function initHeroBrainCanvas() {
    var canvas = document.getElementById('hz-brain-neural-canvas');
    var mediaBox = document.querySelector('.hz-hero-media');
    var brainImg = mediaBox ? mediaBox.querySelector('img') : null;
    if (!canvas || !mediaBox || !brainImg || !canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var cw = 0;
    var ch = 0;
    var dpr = 1;
    var pointerX = 0;
    var pointerY = 0;
    var smoothPX = 0;
    var smoothPY = 0;
    var isHeroVisible = true;
    var rafId = 0;
    var lastTs = 0;

    // Normalized anatomical anchors inside hero_sovereign_brain_1794567948769.jpg
    var nodes = [
      { u: 0.465, v: 0.34, r: 3.1, kind: 'crown' }, // 0 Prefrontal Executive Crown
      { u: 0.495, v: 0.43, r: 2.6, kind: 'crown' }, // 1 Frontal Pole
      { u: 0.42, v: 0.25, r: 2.5, kind: 'gold' },   // 2 Superior Frontal
      { u: 0.335, v: 0.205, r: 2.8, kind: 'crown' },// 3 Motor / Parietal Crown
      { u: 0.245, v: 0.24, r: 2.4, kind: 'gold' },  // 4 Superior Parietal
      { u: 0.17, v: 0.345, r: 2.4, kind: 'gold' },  // 5 Parieto-Occipital
      { u: 0.145, v: 0.465, r: 2.3, kind: 'gold' }, // 6 Occipital Vault
      { u: 0.20, v: 0.565, r: 2.4, kind: 'cyan' },  // 7 Posterior Temporal
      { u: 0.285, v: 0.535, r: 2.9, kind: 'cyan' }, // 8 Central Synaptic Hub
      { u: 0.355, v: 0.48, r: 3.3, kind: 'crown' }, // 9 Executive Thalamus / Core
      { u: 0.415, v: 0.425, r: 2.7, kind: 'cyan' }, // 10 Anterior Temporal / Insula
      { u: 0.39, v: 0.545, r: 2.5, kind: 'gold' },  // 11 Inferior Frontal-Temporal
      { u: 0.305, v: 0.335, r: 2.6, kind: 'gold' }, // 12 Dorsal Cortex Bridge
      { u: 0.24, v: 0.415, r: 2.6, kind: 'cyan' },  // 13 Mid-Cortex Cyan Junction
      { u: 0.365, v: 0.31, r: 2.8, kind: 'cyan' },  // 14 Prefrontal Focus Relay
      { u: 0.23, v: 0.68, r: 2.2, kind: 'gold' },   // 15 Cerebellar Core
      { u: 0.31, v: 0.645, r: 2.2, kind: 'gold' },  // 16 Limbic Anchor
      { u: 0.455, v: 0.505, r: 2.3, kind: 'gold' }  // 17 Ventral Prefrontal
    ];

    var edges = [
      [0, 1], [0, 2], [0, 14], [0, 10], [1, 17], [1, 10],
      [2, 3], [2, 14], [3, 4], [3, 12], [4, 5], [4, 12], [4, 13],
      [5, 6], [5, 13], [6, 7], [6, 13], [7, 8], [7, 15],
      [8, 9], [8, 13], [8, 16], [9, 10], [9, 11], [9, 14], [9, 12],
      [10, 14], [10, 11], [10, 17], [11, 16], [11, 17], [12, 13], [12, 14],
      [15, 16], [13, 9]
    ];

    var nodeHeat = nodes.map(function () {
      return 0;
    });
    var ripples = [];
    var pulses = [];
    var sovereignWaves = [];
    var waveCooldown = 0.6;

    function spawnPulse(fromIdx, preferredToIdx) {
      var neighbors = [];
      for (var i = 0; i < edges.length; i++) {
        var e = edges[i];
        if (e[0] === fromIdx) neighbors.push(e[1]);
        else if (e[1] === fromIdx) neighbors.push(e[0]);
      }
      if (!neighbors.length) return;
      var toIdx =
        typeof preferredToIdx === 'number'
          ? preferredToIdx
          : neighbors[Math.floor(Math.random() * neighbors.length)];
      var isCyan = nodes[fromIdx].kind === 'cyan' || nodes[toIdx].kind === 'cyan';
      pulses.push({
        from: fromIdx,
        to: toIdx,
        t: 0,
        speed: 0.48 + Math.random() * 0.52,
        cyan: isCyan && Math.random() > 0.35
      });
    }

    for (var p = 0; p < 10; p++) {
      var startEdge = edges[Math.floor((p * edges.length) / 10)];
      spawnPulse(startEdge[0], startEdge[1]);
      pulses[pulses.length - 1].t = Math.random() * 0.72;
    }

    function parseObjPosRatio(val, fallback) {
      if (!val || val === 'center') return 0.5;
      if (val === 'left' || val === 'top') return 0;
      if (val === 'right' || val === 'bottom') return 1;
      if (val.indexOf('%') !== -1) {
        var n = parseFloat(val);
        return isNaN(n) ? fallback : n / 100;
      }
      return fallback;
    }

    function computeCoverBox() {
      var nw = brainImg.naturalWidth || 1408;
      var nh = brainImg.naturalHeight || 768;
      var cs = window.getComputedStyle(brainImg);
      var parts = (cs.objectPosition || '13% 50%').trim().split(/\s+/);
      var px = parseObjPosRatio(parts[0], 0.13);
      var py = parseObjPosRatio(parts[1] || '50%', 0.5);
      var scale = Math.max(cw / nw, ch / nh);
      var rw = nw * scale;
      var rh = nh * scale;
      return {
        ox: (cw - rw) * px,
        oy: (ch - rh) * py,
        rw: rw,
        rh: rh
      };
    }

    function resizeCanvas() {
      var rect = mediaBox.getBoundingClientRect();
      cw = Math.max(1, Math.round(rect.width));
      ch = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function mapNode(idx, box) {
      var n = nodes[idx];
      var depthFactor = n.kind === 'crown' ? 1.15 : 0.85;
      return {
        x: box.ox + n.u * box.rw + smoothPX * 8 * depthFactor,
        y: box.oy + n.v * box.rh + smoothPY * 6 * depthFactor
      };
    }

    function getControlPoint(ax, ay, bx, by, idx) {
      var mx = (ax + bx) * 0.5;
      var my = (ay + by) * 0.5;
      var dx = bx - ax;
      var dy = by - ay;
      var bend = (idx % 2 === 0 ? 1 : -1) * 0.16;
      return {
        cx: mx - dy * bend,
        cy: my + dx * bend
      };
    }

    function evalQuad(ax, ay, cx, cy, bx, by, t) {
      var inv = 1 - t;
      return {
        x: inv * inv * ax + 2 * inv * t * cx + t * t * bx,
        y: inv * inv * ay + 2 * inv * t * cy + t * t * by
      };
    }

    function renderFrame(ts) {
      if (!lastTs) lastTs = ts;
      var dt = Math.min(0.05, Math.max(0.001, (ts - lastTs) / 1000));
      lastTs = ts;
      var timeSec = ts * 0.001;

      smoothPX += (pointerX - smoothPX) * Math.min(1, dt * 6);
      smoothPY += (pointerY - smoothPY) * Math.min(1, dt * 6);

      ctx.clearRect(0, 0, cw, ch);
      var box = computeCoverBox();
      var brainCX = box.ox + 0.325 * box.rw + smoothPX * 6;
      var brainCY = box.oy + 0.455 * box.rh + smoothPY * 5;
      var brainRX = box.rw * 0.245;
      var brainRY = box.rh * 0.295;

      // 1. Living Cortical Breathing Aura + Prefrontal Heartbeat Wave
      var breath = 0.5 + 0.5 * Math.sin(timeSec * 1.65);
      var coreGrad = ctx.createRadialGradient(
        brainCX + box.rw * 0.03,
        brainCY - box.rh * 0.02,
        brainRX * 0.06,
        brainCX,
        brainCY,
        brainRX * (0.98 + breath * 0.14)
      );
      coreGrad.addColorStop(0, 'rgba(231, 198, 139, ' + (0.17 + breath * 0.11).toFixed(3) + ')');
      coreGrad.addColorStop(0.42, 'rgba(114, 216, 219, ' + (0.08 + breath * 0.06).toFixed(3) + ')');
      coreGrad.addColorStop(1, 'rgba(8, 14, 21, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(brainCX, brainCY, brainRX * 1.18, 0, Math.PI * 2);
      ctx.fill();

      if (!prefersReducedMotion) {
        waveCooldown -= dt;
        if (waveCooldown <= 0) {
          sovereignWaves.push({ progress: 0 });
          waveCooldown = 2.35;
        }
        for (var w = sovereignWaves.length - 1; w >= 0; w--) {
          var sw = sovereignWaves[w];
          sw.progress += dt * 0.44;
          if (sw.progress >= 1) {
            sovereignWaves.splice(w, 1);
            continue;
          }
          var wr = brainRX * (0.16 + sw.progress * 0.72);
          var wa = (1 - sw.progress) * (1 - sw.progress) * 0.22;
          ctx.strokeStyle = 'rgba(231, 198, 139, ' + wa.toFixed(3) + ')';
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.arc(brainCX + box.rw * 0.03, brainCY - box.rh * 0.02, wr, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // 2. Neural Filaments Mesh
      var pts = [];
      for (var nIdx = 0; nIdx < nodes.length; nIdx++) {
        pts.push(mapNode(nIdx, box));
      }

      ctx.lineWidth = 1.05;
      for (var eIdx = 0; eIdx < edges.length; eIdx++) {
        var edge = edges[eIdx];
        var pA = pts[edge[0]];
        var pB = pts[edge[1]];
        var cp = getControlPoint(pA.x, pA.y, pB.x, pB.y, eIdx);
        var edgeAlpha = 0.11 + 0.06 * Math.sin(timeSec * 1.9 + eIdx * 0.6);
        ctx.strokeStyle =
          eIdx % 3 === 0
            ? 'rgba(114, 216, 219, ' + edgeAlpha.toFixed(3) + ')'
            : 'rgba(231, 198, 139, ' + (edgeAlpha + 0.05).toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.quadraticCurveTo(cp.cx, cp.cy, pB.x, pB.y);
        ctx.stroke();
      }

      // 3. Traveling Action-Potential Pulses + Arrival Synaptic Sparks
      if (!prefersReducedMotion) {
        for (var q = pulses.length - 1; q >= 0; q--) {
          var pulse = pulses[q];
          pulse.t += dt * pulse.speed;
          if (pulse.t >= 1) {
            var hit = pts[pulse.to];
            nodeHeat[pulse.to] = 1;
            ripples.push({
              x: hit.x,
              y: hit.y,
              r: 2.5,
              maxR: 18 + Math.random() * 11,
              alpha: 0.78,
              cyan: pulse.cyan
            });
            var nextFrom = pulse.to;
            pulses.splice(q, 1);
            spawnPulse(nextFrom);
            continue;
          }

          var sA = pts[pulse.from];
          var sB = pts[pulse.to];
          var sCp = getControlPoint(sA.x, sA.y, sB.x, sB.y, pulse.from + pulse.to);
          var head = evalQuad(sA.x, sA.y, sCp.cx, sCp.cy, sB.x, sB.y, pulse.t);
          var tailT = Math.max(0, pulse.t - 0.3);
          var tail = evalQuad(sA.x, sA.y, sCp.cx, sCp.cy, sB.x, sB.y, tailT);

          var wakeGrad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
          wakeGrad.addColorStop(0, 'rgba(231, 198, 139, 0)');
          wakeGrad.addColorStop(
            1,
            pulse.cyan ? 'rgba(114, 216, 219, 0.96)' : 'rgba(247, 224, 178, 0.98)'
          );
          ctx.strokeStyle = wakeGrad;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(tail.x, tail.y);
          ctx.lineTo(head.x, head.y);
          ctx.stroke();

          var glowR = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 12);
          glowR.addColorStop(
            0,
            pulse.cyan ? 'rgba(210, 250, 252, 0.98)' : 'rgba(255, 244, 214, 1)'
          );
          glowR.addColorStop(
            0.35,
            pulse.cyan ? 'rgba(114, 216, 219, 0.65)' : 'rgba(231, 198, 139, 0.68)'
          );
          glowR.addColorStop(1, 'rgba(231, 198, 139, 0)');
          ctx.fillStyle = glowR;
          ctx.beginPath();
          ctx.arc(head.x, head.y, 12, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Synaptic Nodes & Firing Ripples
      for (var i = 0; i < nodes.length; i++) {
        nodeHeat[i] = Math.max(0, nodeHeat[i] - dt * 1.35);
        var pt = pts[i];
        var nd = nodes[i];
        var shimmer = 0.45 + 0.55 * Math.sin(timeSec * 2.3 + i * 0.9);
        var energy = Math.min(1, 0.28 + shimmer * 0.3 + nodeHeat[i] * 0.72);
        var radius = nd.r * (0.9 + nodeHeat[i] * 0.55);

        var nGrad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, radius * 3.8);
        if (nd.kind === 'cyan') {
          nGrad.addColorStop(0, 'rgba(182, 248, 250, ' + (energy * 0.9).toFixed(3) + ')');
          nGrad.addColorStop(1, 'rgba(114, 216, 219, 0)');
        } else {
          nGrad.addColorStop(0, 'rgba(255, 236, 192, ' + (energy * 0.92).toFixed(3) + ')');
          nGrad.addColorStop(1, 'rgba(231, 198, 139, 0)');
        }
        ctx.fillStyle = nGrad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius * 3.8, 0, Math.PI * 2);
        ctx.fill();
      }

      for (var rp = ripples.length - 1; rp >= 0; rp--) {
        var rpl = ripples[rp];
        rpl.r += dt * 30;
        rpl.alpha -= dt * 1.18;
        if (rpl.alpha <= 0 || rpl.r >= rpl.maxR) {
          ripples.splice(rp, 1);
          continue;
        }
        ctx.strokeStyle = rpl.cyan
          ? 'rgba(114, 216, 219, ' + rpl.alpha.toFixed(3) + ')'
          : 'rgba(231, 198, 139, ' + rpl.alpha.toFixed(3) + ')';
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(rpl.x, rpl.y, rpl.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 5. Live 3D-Projected Sovereign Orbital Rings & Orbiting Satellites
      var rings = [
        { rx: brainRX * 1.07, ry: brainRY * 0.96, tilt: 0.19 + smoothPY * 0.04, speed: 0.46, cyan: false, phase: 0 },
        { rx: brainRX * 0.94, ry: brainRY * 1.06, tilt: -0.11 - smoothPX * 0.03, speed: -0.35, cyan: true, phase: 2.1 }
      ];

      for (var rg = 0; rg < rings.length; rg++) {
        var ring = rings[rg];
        var steps = 48;
        var cosT = Math.cos(ring.tilt);
        var sinT = Math.sin(ring.tilt);
        for (var st = 0; st < steps; st++) {
          var a1 = (st / steps) * Math.PI * 2;
          var a2 = ((st + 1) / steps) * Math.PI * 2;
          var z = Math.sin((a1 + a2) * 0.5);
          if (z < -0.15) continue;
          var lx1 = Math.cos(a1) * ring.rx;
          var ly1 = Math.sin(a1) * ring.ry * 0.34;
          var lx2 = Math.cos(a2) * ring.rx;
          var ly2 = Math.sin(a2) * ring.ry * 0.34;
          var px1 = brainCX + lx1 * cosT - ly1 * sinT;
          var py1 = brainCY + lx1 * sinT + ly1 * cosT;
          var px2 = brainCX + lx2 * cosT - ly2 * sinT;
          var py2 = brainCY + lx2 * sinT + ly2 * cosT;
          var shimmerArc = 0.05 * Math.sin(timeSec * 2.4 + a1 * 2 - ring.phase);
          var ringAlpha = Math.max(0.06, 0.12 + Math.max(0, z) * 0.28 + shimmerArc);
          ctx.strokeStyle = ring.cyan
            ? 'rgba(114, 216, 219, ' + ringAlpha.toFixed(3) + ')'
            : 'rgba(231, 198, 139, ' + ringAlpha.toFixed(3) + ')';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.stroke();
        }

        // Orbiting Luminous Sovereign Satellites along each ring
        var satCount = 3;
        for (var sIdx = 0; sIdx < satCount; sIdx++) {
          var ang = timeSec * ring.speed + ring.phase + (sIdx * Math.PI * 2) / satCount;
          var sx = Math.cos(ang) * ring.rx;
          var sy = Math.sin(ang) * ring.ry * 0.34;
          var sz = Math.sin(ang);
          var ox = brainCX + sx * cosT - sy * sinT;
          var oy = brainCY + sx * sinT + sy * cosT;
          var depthAlpha = sz > 0 ? 0.65 + sz * 0.35 : Math.max(0.14, 0.38 + sz * 0.26);
          var satR = sz > 0 ? 10.5 : 6.5;
          var satG = ctx.createRadialGradient(ox, oy, 0, ox, oy, satR);
          satG.addColorStop(
            0,
            ring.cyan
              ? 'rgba(204, 250, 252, ' + depthAlpha.toFixed(3) + ')'
              : 'rgba(255, 242, 204, ' + depthAlpha.toFixed(3) + ')'
          );
          satG.addColorStop(1, 'rgba(231, 198, 139, 0)');
          ctx.fillStyle = satG;
          ctx.beginPath();
          ctx.arc(ox, oy, satR, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!prefersReducedMotion && isHeroVisible) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    }

    function startLoop() {
      if (rafId || !isHeroVisible) return;
      lastTs = 0;
      rafId = window.requestAnimationFrame(renderFrame);
    }

    function stopLoop() {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    resizeCanvas();
    window.addEventListener('resize', function () {
      resizeCanvas();
      if (prefersReducedMotion) renderFrame(performance.now());
    });

    if (heroStage && !prefersReducedMotion) {
      heroStage.addEventListener(
        'pointermove',
        function (evt) {
          var rect = heroStage.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          pointerX = ((evt.clientX - rect.left) / rect.width - 0.5) * 2;
          pointerY = ((evt.clientY - rect.top) / rect.height - 0.5) * 2;
        },
        { passive: true }
      );
      heroStage.addEventListener('pointerleave', function () {
        pointerX = 0;
        pointerY = 0;
      });
    }

    if ('IntersectionObserver' in window && heroStage) {
      var heroObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            isHeroVisible = entry.isIntersecting;
            if (prefersReducedMotion) {
              if (isHeroVisible) renderFrame(performance.now());
            } else if (isHeroVisible) {
              startLoop();
            } else {
              stopLoop();
            }
          });
        },
        { threshold: 0.05 }
      );
      heroObs.observe(heroStage);
    }

    if (brainImg.complete) {
      if (prefersReducedMotion) renderFrame(performance.now());
      else startLoop();
    } else {
      brainImg.addEventListener('load', function () {
        resizeCanvas();
        if (prefersReducedMotion) renderFrame(performance.now());
        else startLoop();
      });
    }
  })();

  /* Active top nav highlighting */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.hz-nav-links a[href^="#"]'));
  var trackedSections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href').slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && trackedSections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            navLinks.forEach(function (l) {
              l.classList.toggle('is-active', l.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: 0.05 }
    );
    trackedSections.forEach(function (sec) {
      navObserver.observe(sec);
    });
  }

  /* Mobile Nav Drawer (Architectural Glass Sheet — فهرست) */
  var mobileMenuBtn = document.getElementById('hz-mobile-menu-btn');
  var mobileNavDrawer = document.getElementById('hz-mobile-nav-drawer');
  var navBackdrop = null;

  var closeNavDrawer = function () {};

  if (mobileMenuBtn && mobileNavDrawer) {
    var navCurrentPath = window.location.pathname || '/index.html';
    if (navCurrentPath === '/') navCurrentPath = '/index.html';

    navBackdrop = document.createElement('div');
    navBackdrop.className = 'hz-nav-backdrop';
    navBackdrop.id = 'hz-nav-backdrop';
    document.body.appendChild(navBackdrop);

    var drawerRoutes = [
      { href: '/index.html', num: '۰۱', title: 'صفحهٔ اصلی و نقشهٔ علمی' },
      { href: '/tark-porn.html', num: '۰۲', title: 'چطور پورن را ترک کنیم؟' },
      { href: '/tark-khod-arzaei.html', num: '۰۳', title: 'راهنمای ترک خودارضایی' },
      { href: '/porn-brain.html', num: '۰۴', title: 'تأثیر پورن بر مغز و دوپامین' },
      { href: '/relapse.html', num: '۰۵', title: 'پروتکل ۶۰ دقیقه بعد از لغزش' },
      { href: '/habits.html', num: '۰۶', title: 'مرز عادت و اختلال CSBD' },
      { href: '/guides.html', num: '۰۷', title: 'مرکز همهٔ راهنماها' },
      { href: '/privacy.html', num: '۰۸', title: 'حریم خصوصی و نگهداری محلی' }
    ];

    var drawerCardsHtml = drawerRoutes
      .map(function (item) {
        var isCurrent = navCurrentPath === item.href;
        return (
          '<a class="hz-drawer-nav-card' +
          (isCurrent ? ' is-current' : '') +
          '" href="' +
          item.href +
          '">' +
          '<span class="hz-drawer-nav-row">' +
          '<span class="hz-drawer-nav-num">' +
          item.num +
          '</span>' +
          '<span class="hz-drawer-nav-title">' +
          item.title +
          '</span>' +
          '</span>' +
          '<span class="hz-drawer-nav-trail">' +
          (isCurrent ? 'اینجایی' : '←') +
          '</span>' +
          '</a>'
        );
      })
      .join('');

    var isFeaturesCurrent = navCurrentPath === '/features.html';
    mobileNavDrawer.setAttribute('role', 'dialog');
    mobileNavDrawer.setAttribute('aria-label', 'فهرست بخش‌ها و راهنماهای حاکم ذهن');
    mobileNavDrawer.innerHTML =
      '<div class="hz-drawer-head">' +
      '<strong class="hz-drawer-heading">فهرست</strong>' +
      '<div class="hz-drawer-head-actions">' +
      '<button type="button" class="hz-drawer-search-btn" id="hz-drawer-search-jump">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>' +
      '<span>جست‌وجو</span>' +
      '</button>' +
      '<button type="button" class="hz-drawer-close-btn" id="hz-drawer-close-btn" aria-label="بستن فهرست">×</button>' +
      '</div>' +
      '</div>' +
      '<a class="hz-drawer-hero-card' +
      (isFeaturesCurrent ? ' is-current' : '') +
      '" href="/features.html">' +
      '<div class="hz-drawer-hero-main">' +
      '<img src="/assets/icon-sm.webp" width="32" height="32" alt="نشان اپلیکیشن حاکم ذهن" referrerpolicy="no-referrer" />' +
      '<div>' +
      '<span class="hz-drawer-hero-title">اپلیکیشن اندروید حاکم ذهن ۱٫۸</span>' +
      '<span class="hz-drawer-hero-sub">سپر SOS، روش آسان و مسیر ۱۴۰ روزه</span>' +
      '</div>' +
      '</div>' +
      '<span class="hz-drawer-hero-arrow">←</span>' +
      '</a>' +
      '<div class="hz-drawer-grid">' +
      drawerCardsHtml +
      '</div>' +
      '<div class="hz-drawer-footer-bar">' +
      '<a class="hz-drawer-sos-link" href="/features.html#sos-shield">سپر فوری SOS</a>' +
      '<a class="hz-drawer-myket-link" href="https://myket.ir/app/ir.hakemzehn.app" target="_blank" rel="noopener">دریافت از مایکت ←</a>' +
      '</div>';

    closeNavDrawer = function () {
      mobileNavDrawer.classList.remove('is-open');
      if (navBackdrop) navBackdrop.classList.remove('is-open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    };

    var openNavDrawer = function () {
      mobileNavDrawer.classList.add('is-open');
      if (navBackdrop) navBackdrop.classList.add('is-open');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    };

    mobileMenuBtn.addEventListener('click', function () {
      if (mobileNavDrawer.classList.contains('is-open')) {
        closeNavDrawer();
      } else {
        openNavDrawer();
      }
    });

    navBackdrop.addEventListener('click', closeNavDrawer);

    var drawerCloseBtn = document.getElementById('hz-drawer-close-btn');
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeNavDrawer);
    }

    var drawerSearchJump = document.getElementById('hz-drawer-search-jump');
    if (drawerSearchJump) {
      drawerSearchJump.addEventListener('click', function () {
        closeNavDrawer();
        var topSearchBtn = document.getElementById('hz-search-trigger');
        if (topSearchBtn) topSearchBtn.click();
      });
    }

    mobileNavDrawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNavDrawer);
    });
  }

  /* ------------------------------------------------------------------------
     2. Interactive Dopamine Prism & Waveform Simulator (Chapter 01)
     ------------------------------------------------------------------------ */
  var dopaminePhases = {
    supernormal: {
      step: 'فاز ۰۱ از ۰۳',
      status: 'جهش غیرطبیعی وسط اسکرول و تماشا',
      path: 'M 12 112 C 68 112, 108 32, 156 32 C 204 32, 232 126, 288 130 C 334 133, 372 114, 408 112',
      area: 'M 12 112 C 68 112, 108 32, 156 32 C 204 32, 232 126, 288 130 C 334 133, 372 114, 408 112 L 408 112 L 12 112 Z',
      dotX: '156',
      dotY: '32',
      guideBottomY: '112',
      callout: 'شوک کاذب (۲ برابر عادی)',
      calloutX: '156',
      calloutY: '18',
      level: '۲ برابر خط پایه',
      window: 'همون چند دقیقهٔ تماشا',
      receptors: 'اشباع موقت گیرنده‌ها',
      title: 'مغزت توی چند ثانیه فریب «تنوع بی‌نهایت» رو می‌خوره',
      body: 'مغز ما برای دنیای واقعی ساخته شده، نه اینکه با دو تا اسکرول صدتا تصویر تازه و عجیب ببینه. این حجم از تنوع ناگهانی مثل یه موج غیرعادی می‌کوبه به مدار پاداش؛ مغز هم برای اینکه تعادلش به‌هم نریزه، موقتاً «ولومِ حساسیت» گیرنده‌هاش رو میاره پایین.'
    },
    crash: {
      step: 'فاز ۰۲ از ۰۳',
      status: 'افت زیر خط تعادل و بی‌حوصلگی بعدی',
      path: 'M 12 112 C 74 112, 128 178, 198 178 C 268 178, 328 122, 408 116',
      area: 'M 12 112 C 74 112, 128 178, 198 178 C 268 178, 328 122, 408 116 L 408 112 L 12 112 Z',
      dotX: '198',
      dotY: '178',
      guideBottomY: '112',
      callout: 'سقوط زیر خط عادی',
      calloutX: '198',
      calloutY: '195',
      level: 'افت زیر خط پایه',
      window: '۱ تا ۲ ساعت بعد',
      receptors: 'کلافگی و مه‌ذهنی',
      title: 'چرا یک ساعت بعد یهو دلت می‌گیره و حوصلهٔ هیچ‌چی رو نداری؟',
      body: 'پورن هیچ نیاز واقعی از بدنت رو برطرف نمی‌کنه؛ اول یه خلأ می‌سازه، یه لحظه پرش می‌کنه و بعد با سودش پس می‌گیره! وقتی منحنی میاد زیر خطِ عادی مغز، دقیقاً همون حسِ کلافگی، سنگینی سر و بی‌حوصلگی به درس و کار میاد سراغت.'
    },
    recovery: {
      step: 'فاز ۰۳ از ۰۳',
      status: 'برگشتِ آرامش و مزهٔ لذت‌های عادی',
      path: 'M 12 114 C 84 108, 146 92, 214 92 C 282 92, 340 98, 408 94',
      area: 'M 12 114 C 84 108, 146 92, 214 92 C 282 92, 340 98, 408 94 L 408 112 L 12 112 Z',
      dotX: '214',
      dotY: '92',
      guideBottomY: '112',
      callout: 'تعادل پایدار (۱۰۰٪)',
      calloutX: '214',
      calloutY: '75',
      level: 'تعادل ۱۰۰٪ پایه',
      window: 'هفته‌های ۳ تا ۴',
      receptors: 'زنده‌شدن حساسیت طبیعی',
      title: 'وقتی دست از جنگیدن برداری و فقط راهِ تصویر رو ببندی',
      body: 'لازم نیست دنبال معجزهٔ ۳ روزه باشی. همین که راهِ دسترسی سریع رو ببندی و سوخت تصویری به مغز نرسه، سیستم عصبی به‌خاطر انعطاف‌پذیریش (نوروپلاستیسیتی) آروم‌آروم ولوم رو برمی‌گردونه سر جاش؛ خواب عمیق‌تر می‌شه و کارهای ساده دوباره بهت حال می‌ده.'
    }
  };

  var visualFrame = document.getElementById('hz-dopamine-frame');
  var showcaseShell = visualFrame ? visualFrame.closest('.hz-split-showcase') : null;
  var waveActivePath = document.getElementById('hz-wave-active-path');
  var waveAreaPath = document.getElementById('hz-wave-area-path');
  var waveStatusEl = document.getElementById('hz-wave-status');
  var waveStepEl = document.getElementById('hz-wave-step');
  var waveDotEl = document.getElementById('hz-wave-dot');
  var waveDotHaloEl = document.getElementById('hz-wave-dot-halo');
  var waveGuideEl = document.getElementById('hz-wave-guide');
  var waveCalloutEl = document.getElementById('hz-wave-callout');
  var telemetryLevelEl = document.getElementById('hz-telemetry-level');
  var telemetryTimeEl = document.getElementById('hz-telemetry-time');
  var telemetryStateEl = document.getElementById('hz-telemetry-state');
  var phaseTitleEl = document.getElementById('hz-dopamine-title');
  var phaseBodyEl = document.getElementById('hz-dopamine-body');
  var phaseReadoutEl = document.querySelector('.hz-phase-readout');
  var segButtons = Array.prototype.slice.call(document.querySelectorAll('[data-dopamine-phase]'));

  function setDopaminePhase(key) {
    var data = dopaminePhases[key];
    if (!data) return;
    if (visualFrame) {
      visualFrame.setAttribute('data-phase', key);
      visualFrame.classList.remove('is-pulsing');
      void visualFrame.offsetWidth;
      visualFrame.classList.add('is-pulsing');
    }
    if (showcaseShell) showcaseShell.setAttribute('data-phase', key);
    if (waveActivePath) waveActivePath.setAttribute('d', data.path);
    if (waveAreaPath) waveAreaPath.setAttribute('d', data.area);
    if (waveStatusEl) waveStatusEl.textContent = data.status;
    if (waveStepEl) waveStepEl.textContent = data.step;
    if (waveDotEl) {
      waveDotEl.setAttribute('cx', data.dotX);
      waveDotEl.setAttribute('cy', data.dotY);
    }
    if (waveDotHaloEl) {
      waveDotHaloEl.setAttribute('cx', data.dotX);
      waveDotHaloEl.setAttribute('cy', data.dotY);
    }
    if (waveGuideEl) {
      waveGuideEl.setAttribute('x1', data.dotX);
      waveGuideEl.setAttribute('x2', data.dotX);
      waveGuideEl.setAttribute('y1', data.dotY);
      waveGuideEl.setAttribute('y2', data.guideBottomY);
    }
    if (waveCalloutEl) {
      waveCalloutEl.textContent = data.callout;
      waveCalloutEl.setAttribute('x', data.calloutX);
      waveCalloutEl.setAttribute('y', data.calloutY);
    }
    if (telemetryLevelEl) telemetryLevelEl.textContent = data.level;
    if (telemetryTimeEl) telemetryTimeEl.textContent = data.window;
    if (telemetryStateEl) telemetryStateEl.textContent = data.receptors;
    if (phaseTitleEl) phaseTitleEl.textContent = data.title;
    if (phaseBodyEl) phaseBodyEl.textContent = data.body;
    if (phaseReadoutEl) {
      phaseReadoutEl.classList.remove('is-switching');
      void phaseReadoutEl.offsetWidth;
      phaseReadoutEl.classList.add('is-switching');
    }
    segButtons.forEach(function (btn) {
      var active = btn.getAttribute('data-dopamine-phase') === key;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  segButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setDopaminePhase(btn.getAttribute('data-dopamine-phase'));
    });
  });

  /* ------------------------------------------------------------------------
     3. Interactive Perspective Shift Curtain (Chapter 02)
     ------------------------------------------------------------------------ */
  var perspectiveRange = document.getElementById('hz-perspective-range');
  var curtainShadow = document.getElementById('hz-curtain-shadow');
  var curtainPhoto = document.getElementById('hz-curtain-photo');
  var curtainKicker = document.getElementById('hz-curtain-kicker');
  var curtainText = document.getElementById('hz-curtain-text');
  var epWillpower = document.getElementById('hz-ep-willpower');
  var epEasyPeasy = document.getElementById('hz-ep-easypeasy');

  var axisLook = document.getElementById('hz-axis-look');
  var axisNight = document.getElementById('hz-axis-night');
  var axisRelapse = document.getElementById('hz-axis-relapse');
  var axisLong = document.getElementById('hz-axis-long');
  var axisCards = Array.prototype.slice.call(document.querySelectorAll('.hz-axis-card'));

  /* Each page carries its own fresh static copy in these five elements.
     Capture it now — before the first updatePerspective() call below
     overwrites it — so the slider re-injects the current page's own
     sentences instead of one shared copy on both pages. When an element
     is absent (other pages load this file too), fall back to the shared
     strings. The willpower-angle strings below stay shared: none of
     them appears in tark-porn.html, so they duplicate nothing. */
  function readPageText(el, fallback) {
    if (!el || typeof el.textContent !== 'string') return fallback;
    var t = el.textContent.replace(/\s+/g, ' ').trim();
    return t ? t : fallback;
  }

  var perspectiveEasyCopy = {
    curtain: readPageText(curtainText, '«من از هیچ لذت واقعی‌ای دست نمی‌کشم؛ فقط از یک چرخهٔ خسته‌کننده بیرون می‌آیم.»'),
    look: readPageText(axisLook, '«دارم از یک چرخهٔ خسته‌کننده و وقت‌گیر آزاد می‌شوم»'),
    night: readPageText(axisNight, 'چون باور فریبنده شکسته، نیازی به جنگ سنگین با خود نیست'),
    relapse: readPageText(axisRelapse, 'بررسی حلقهٔ جاافتاده و ادامهٔ آرام مسیر از گام بعد'),
    long: readPageText(axisLong, 'کم‌رنگ‌شدن تدریجی ارزش خیالی تصاویر در ذهن')
  };

  function updatePerspective(val) {
    var num = Math.min(100, Math.max(0, Number(val)));
    var isEasy = num >= 50;

    if (curtainShadow) {
      var shadowOpacity = Math.max(0.08, 0.92 - (num / 100) * 0.84);
      curtainShadow.style.opacity = shadowOpacity.toFixed(2);
    }
    if (curtainPhoto) {
      var ratio = num / 100;
      var scale = 1.07 - ratio * 0.07;
      var brightness = 0.74 + ratio * 0.3;
      var saturate = 0.84 + ratio * 0.24;
      curtainPhoto.style.transform = 'scale(' + scale.toFixed(3) + ')';
      curtainPhoto.style.filter =
        'brightness(' + brightness.toFixed(2) + ') saturate(' + saturate.toFixed(2) + ')';
    }

    if (epWillpower) epWillpower.classList.toggle('is-active', !isEasy);
    if (epEasyPeasy) epEasyPeasy.classList.toggle('is-active', isEasy);

    axisCards.forEach(function (card) {
      card.classList.toggle('is-easypeasy', isEasy);
    });

    if (isEasy) {
      if (curtainKicker) curtainKicker.textContent = 'زاویهٔ روش آسان (ایزی‌پیسی) · رهایی بدون حس محرومیت';
      if (curtainText) {
        curtainText.textContent = perspectiveEasyCopy.curtain;
      }
      if (axisLook) axisLook.textContent = perspectiveEasyCopy.look;
      if (axisNight) axisNight.textContent = perspectiveEasyCopy.night;
      if (axisRelapse) axisRelapse.textContent = perspectiveEasyCopy.relapse;
      if (axisLong) axisLong.textContent = perspectiveEasyCopy.long;
    } else {
      if (curtainKicker) curtainKicker.textContent = 'زاویهٔ جنگ اراده · مقاومت فرساینده و حس محرومیت';
      if (curtainText) {
        curtainText.textContent = '«باید تحمل کنم و خودم را محروم نگه دارم تا یک روز بالاخره خسته نشوم...»';
      }
      if (axisLook) axisLook.textContent = '«دارم از یک لذت و آرامش دست می‌کشم»';
      if (axisNight) axisNight.textContent = 'انرژی اراده با خستگی روز تمام شده و احتمال تسلیم بالا می‌رود';
      if (axisRelapse) axisRelapse.textContent = 'عذاب وجدان شدید و رهاکردن کل مسیر';
      if (axisLong) axisLong.textContent = 'شمارش معکوس تا انفجار بعدی';
    }
  }

  if (perspectiveRange) {
    perspectiveRange.addEventListener('input', function () {
      updatePerspective(perspectiveRange.value);
    });
    updatePerspective(perspectiveRange.value);
  }
  if (epWillpower && perspectiveRange) {
    epWillpower.addEventListener('click', function () {
      perspectiveRange.value = '15';
      updatePerspective(15);
    });
  }
  if (epEasyPeasy && perspectiveRange) {
    epEasyPeasy.addEventListener('click', function () {
      perspectiveRange.value = '88';
      updatePerspective(88);
    });
  }

  /* ------------------------------------------------------------------------
     4. 4-Stage Clockwise Loop + 5-Second Pause Card (Chapter 03)
     ------------------------------------------------------------------------ */
  var loopStepsData = [
    {
      step: 1,
      shortTitle: 'اسکرول بی‌هدف',
      pauseTip: 'در حلقهٔ ۰۱ چه کار کنی؟ پیش از باز کردن اکسپلور یا تلگرام در حالت خستگی، گوشی را زمین بگذار و از اتاق خواب بیرون بیا؛ تغییر موقعیت فیزیکی ۵ ثانیه‌ای رشتهٔ اسکرول را می‌بُرد.'
    },
    {
      step: 2,
      shortTitle: 'جرقه و فقط یه چک',
      pauseTip: 'در حلقهٔ ۰۲ چه کار کنی؟ بدون چانه‌زنی ذهنی («ببینم یا نه»)، همان لحظه صفحه را ببند و یک لیوان آب خنک بردار تا فشار آنی بشکند.'
    },
    {
      step: 3,
      shortTitle: 'حالت ناشناس',
      pauseTip: 'در حلقهٔ ۰۳ چه کار کنی؟ لحظه‌ای که دستت سمت پنجرهٔ ناشناس می‌رود زنگ خطر واقعی است؛ فیلتر DNS امن دقیقاً همین پل دسترسی فوری را قطع می‌کند.'
    },
    {
      step: 4,
      shortTitle: 'فراموشی قیمت واقعی',
      pauseTip: 'در حلقهٔ ۰۴ چه کار کنی؟ پنج ثانیه به تصویر یک ساعت بعد فکر کن: کلافگی، خواب سبک و بی‌حوصلگی فردا — همین یادآوری اوج کاذب را خنثی می‌کند.'
    }
  ];

  var currentLoopStep = 1;
  var loopArc = document.getElementById('hz-loop-arc');
  var loopCenterStep = document.getElementById('hz-loop-center-step');
  var loopCenterTitle = document.getElementById('hz-loop-center-title');
  var loopPauseTip = document.getElementById('hz-loop-pause-tip');
  var loopNodes = Array.prototype.slice.call(document.querySelectorAll('.hz-loop-node'));
  var loopStageItems = Array.prototype.slice.call(document.querySelectorAll('.hz-loop-stage-btn'));
  var loopPrevBtn = document.getElementById('hz-loop-prev');
  var loopNextBtn = document.getElementById('hz-loop-next');
  var persianNums = ['۰', '۱', '۲', '۳', '۴'];

  /* Same idea for the pause card: the static tip on this page is the
     page's own step-1 tip (tark-porn's and index's differ). Capture it
     now so clicking back to step 1 restores this page's tip instead of
     the shared copy. Steps 2–4 have no static source on either page and
     their tips appear on neither page, so they stay shared. */
  loopStepsData[0].pauseTip = readPageText(loopPauseTip, loopStepsData[0].pauseTip);

  function setLoopStep(step) {
    if (step < 1 || step > 4) step = 1;
    currentLoopStep = step;
    var info = loopStepsData[step - 1];
    if (loopArc) {
      var circumference = 565.48;
      var offset = circumference * (1 - step / 4);
      loopArc.style.strokeDashoffset = offset.toFixed(2);
    }
    if (loopCenterStep) loopCenterStep.textContent = 'حلقهٔ ۰' + persianNums[step];
    if (loopCenterTitle) loopCenterTitle.textContent = info.shortTitle;
    if (loopPauseTip) loopPauseTip.textContent = info.pauseTip;

    loopNodes.forEach(function (n) {
      var active = Number(n.getAttribute('data-step')) === step;
      n.classList.toggle('is-active', active);
      n.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    loopStageItems.forEach(function (item) {
      var active = Number(item.getAttribute('data-step')) === step;
      item.classList.toggle('is-active', active);
    });
  }

  loopNodes.forEach(function (n) {
    n.addEventListener('click', function () {
      setLoopStep(Number(n.getAttribute('data-step')));
    });
  });

  loopStageItems.forEach(function (item) {
    item.addEventListener('click', function () {
      setLoopStep(Number(item.getAttribute('data-step')));
    });
  });

  if (loopPrevBtn) {
    loopPrevBtn.addEventListener('click', function () {
      setLoopStep(currentLoopStep > 1 ? currentLoopStep - 1 : 4);
    });
  }
  if (loopNextBtn) {
    loopNextBtn.addEventListener('click', function () {
      setLoopStep(currentLoopStep < 4 ? currentLoopStep + 1 : 1);
    });
  }

  /* ------------------------------------------------------------------------
     5. 4-Week Horizon Scrubber (Chapter 04)
     ------------------------------------------------------------------------ */
  var weekPills = Array.prototype.slice.call(document.querySelectorAll('.hz-week-pill'));
  var weekCards = Array.prototype.slice.call(document.querySelectorAll('.hz-week-card'));
  var horizonImg = document.getElementById('hz-horizon-img');

  function activateWeek(weekNum) {
    weekPills.forEach(function (pill) {
      var active = pill.getAttribute('data-week') === String(weekNum);
      pill.classList.toggle('is-active', active);
      pill.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    weekCards.forEach(function (card) {
      var active = card.getAttribute('data-week') === String(weekNum);
      card.classList.toggle('is-active', active);
    });
    if (horizonImg) {
      var scale = 1 + (Number(weekNum) - 1) * 0.02;
      horizonImg.style.setProperty('--hz-week-scale', scale.toFixed(3));
      var horizonWrap = horizonImg.parentElement;
      if (horizonWrap) {
        horizonWrap.classList.remove('is-switching');
        void horizonWrap.offsetWidth;
        horizonWrap.classList.add('is-switching');
      }
    }
  }

  weekPills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      activateWeek(pill.getAttribute('data-week'));
    });
  });

  /* ------------------------------------------------------------------------
     6. Inline Reference Inspector for Terms & Citations [۱]..[۴]
     ------------------------------------------------------------------------ */
  var referenceEntries = {
    supernormal: {
      title: 'محرک فراهنجار (Supernormal Stimulus)',
      body: 'محرکی مصنوعی با شدت، تنوع و سرعت بسیار بالاتر از محیط طبیعی؛ صفحه‌نمایش تنوعی ارائه می‌دهد که سیستم پاداش مغز را بیش‌ازحد تحریک می‌کند و لذت‌های عادی را کمرنگ نشان می‌دهد.',
      meta: 'مستند علمی · ادامه در فصل کتابخانهٔ «تأثیر پورن بر مغز»'
    },
    easypeasy: {
      title: 'روش آسان (EasyPeasy)',
      body: 'رویکردی مبتنی بر تغییر باور: به جای تحمل محرومیت با زور اراده، ارزش خیالی پورن زیر سؤال می‌رود تا حس قربانی‌شدن از بین برود و نیاز به جنگ شبانه فرو بریزد.',
      meta: 'ستون فکری بخش آموزشی حاکم ذهن'
    },
    csbd: {
      title: 'اختلال رفتار جنسی اجباری (CSBD)',
      body: 'الگوی پایدار ناتوانی در کنترل تکانه‌های شدید جنسی که دست‌کم ۶ ماه ادامه یابد و به خواب، کار، تحصیل یا روابط آسیب بزند.',
      meta: 'مستند به طبقه‌بندی ICD-11 سازمان جهانی بهداشت (۲۰۲۴)'
    },
    dns: {
      title: 'DNS امن و SafeSearch',
      body: 'تنظیم فیلتر در سطح شبکه و موتور جست‌وجو یک مانع ۳۰ ثانیه‌ای ایجاد می‌کند تا ذهن فرصت کند پیش از ورود به سایت‌ها از حالت تکانشی خارج شود.',
      meta: 'پروتکل تغییر محیط ۵ دقیقه‌ای'
    },
    'src-2': {
      title: 'پانوشت منبع [۲] — Mayo Clinic Staff (۲۰۲۳)',
      body: 'پشتیبانی از معیارهای ارجاع تخصصی: اختلال مداوم در خواب، کار، تحصیل یا رابطهٔ عاطفی و از دست رفتن کنترل شروع یا توقف.',
      meta: 'بازبینی‌شده: ۱۹ آوریل ۲۰۲۳'
    },
    'src-4': {
      title: 'پانوشت منبع [۴] — WHO ICD-11 (۲۰۲۴)',
      body: 'پشتیبانی از توصیف‌های رسمی سازمان جهانی بهداشت دربارهٔ تمایز میان عادت مسئله‌ساز و اختلال بالینی و عدم جایگزینی محتوای آموزشی با تشخیص تخصصی.',
      meta: 'انتشار رسمی سازمان جهانی بهداشت'
    },
    'src-5': {
      title: 'پانوشت منبع [۵] — Kühn & Gallinat, JAMA Psychiatry (۲۰۱۴)',
      body: 'پشتیبانی از ارتباط میان مصرف مکرر پورنوگرافی و کاهش موقتی واکنش‌پذیری و پیوند عصبی مسیر فرونتواستریاتال (Frontostriatal) و بازگشت‌پذیری انعطاف عصبی.',
      meta: 'منتشرشده در ژورنال JAMA Psychiatry · PMID: 24871202'
    },
    'src-6': {
      title: 'پانوشت منبع [۶] — Gola و همکاران, Neuropsychopharmacology (۲۰۱۷)',
      body: 'پشتیبانی از نقش اصلی «نشانه‌های پیش‌بینی‌کننده» (Cues) در تحریک جسم مخطط و چرایی مؤثربودن بستن سرنخ‌های محیطی (گوشی و اکسپلور) پیش از تحریک تصویر.',
      meta: 'منتشرشده در Neuropsychopharmacology · PMCID: PMC5561346'
    }
  };

  function closeInlineDrawer() {
    var old = document.querySelector('.hz-inline-drawer');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    document.querySelectorAll('.hz-term[aria-expanded="true"]').forEach(function (el) {
      el.setAttribute('aria-expanded', 'false');
    });
  }

  document.querySelectorAll('[data-ref]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var key = el.getAttribute('data-ref');
      var entry = referenceEntries[key];
      if (!entry) return;

      if (el.tagName === 'A') {
        e.preventDefault();
      }

      var wasExpanded = el.getAttribute('aria-expanded') === 'true';
      closeInlineDrawer();
      if (wasExpanded) return;

      var parentBlock = el.closest('p, li, div.hz-boundary-box') || el.parentElement;
      if (!parentBlock) return;

      var drawer = document.createElement('div');
      drawer.className = 'hz-inline-drawer';
      drawer.setAttribute('role', 'note');
      drawer.innerHTML =
        '<div class="hz-inline-drawer-head">' +
        '<strong>' + entry.title + '</strong>' +
        '<button type="button" class="hz-inline-drawer-close" aria-label="بستن توضیح">×</button>' +
        '</div>' +
        '<p style="margin:0 0 8px">' + entry.body + '</p>' +
        '<span style="font-size:0.84rem;color:var(--hz-gold)">' + entry.meta + '</span>';

      parentBlock.insertAdjacentElement('afterend', drawer);
      el.setAttribute('aria-expanded', 'true');

      var closeBtn = drawer.querySelector('.hz-inline-drawer-close');
      if (closeBtn) closeBtn.addEventListener('click', closeInlineDrawer);

      if (key.indexOf('src-') === 0) {
        document.querySelectorAll('.hz-source-item').forEach(function (s) {
          s.classList.remove('is-highlighted');
        });
        var srcTarget = document.getElementById(key);
        if (srcTarget) srcTarget.classList.add('is-highlighted');
      }
    });
  });

  /* ------------------------------------------------------------------------
     7. Deep Chapter Library Reader Drawer (Chapter 05)
     ------------------------------------------------------------------------ */
  var libraryArticles = {
    'tark-porn-full': {
      kicker: 'مرجع جامع · ترک پورنوگرافی',
      title: 'نقشهٔ یکپارچهٔ رهایی از پورن: از امشب تا ثبات ذهنی',
      html:
        '<p>اگر بارها تصمیم گرفته‌ای از فردا بگذاری کنار و دوباره نیمه‌شب شکست خورده‌ای، اشکال از «بی‌ارادگی» تو نیست؛ اشکال از روشی است که به جای قطع دسترسی و شکستن فریب ذهنی، همه‌چیز را روی دوش مقاومت لحظه‌ای می‌اندازد.</p>' +
        '<h3>سه اصل ثابت در تمام صفحات این مرجع</h3>' +
        '<ul>' +
        '<li><strong>اصل ۱ (جداسازی نبردها):</strong> پورن یک محرک بینایی فراهنجار روی صفحه است؛ خودارضایی عادت جسمی دیگری است. اگر پورن را قطع کنی، در مسیر رهایی هستی و صفر نمی‌شوی.</li>' +
        '<li><strong>اصل ۲ (اصلاح محیط قبل از تصمیم):</strong> شارژر بیرون اتاق خواب، DNS امن، و خروج از کانال‌های محرک در ۵ دقیقه جلوی ۹۰٪ لغزش‌های تصادفی را می‌گیرد.</li>' +
        '<li><strong>اصل ۳ (تغییر زاویهٔ دید با روش آسان):</strong> وقتی ببینی پورن اول اضطراب و خلأ می‌سازد و بعد وانمود می‌کند آرامت کرده، دیگر حس محرومیت نداری.</li>' +
        '</ul>' +
        '<h3>پس از اولین شب آزاد چه انتظاری داشته باشی؟</h3>' +
        '<p>طبیعی است در روزهای اول ذهن به دنبال همان تحریک سریع بگردد. این «هوس» نشانهٔ نیاز واقعی بدن نیست، بلکه واکنش کوتاه‌مدت عادت به نبود سوخت همیشگی است. هر بار که موج می‌آید و با قانون ۵ ثانیه به عقب جایت را عوض می‌کنی، ارتباط عصبی قبلی ضعیف‌تر می‌شود.</p>'
    },
    'porn-brain': {
      kicker: 'عصب‌شناسی رفتاری · مدار پاداش',
      title: 'تأثیر پورن بر مغز و دوپامین: چه چیزی پژوهش است و چه چیزی شایعه؟',
      html:
        '<p>در فضای وب فارسی دو افراط وجود دارد: یا گفته می‌شود پورن کاملاً بی‌ضرر است، یا ادعاهای ترسناک دربارهٔ «نابودی دائمی مغز» مطرح می‌شود. واقعیت علمی میان این دو است و بسیار امیدوارکننده:</p>' +
        '<h3>۱. پدیدهٔ محرک فراهنجار و تنظیم کاهشی (Downregulation)</h3>' +
        '<p>مغز انسان برای پاداش‌های طبیعیِ تدریجی طراحی شده است. وقتی در چند کلیک ده‌ها صحنهٔ پرتنوع با نور و سرعت بالا دیده می‌شود، مدار پاداش دچار جهش ناگهانی دوپامین می‌گردد و برای محافظت از تعادل خود، حساسیت به محرک‌های معمولی روزمره (درس، ورزش، گفت‌وگوی آرام) را موقتاً پایین می‌آورد.</p>' +
        '<h3>۲. چرا مه‌ذهنی و بی‌حوصلگی صبحگاهی رخ می‌دهد؟</h3>' +
        '<p>تماشای طولانی در نیمه‌شب نه‌تنها ریتم ملاتونین و خواب عمیق را مختل می‌کند، بلکه به خاطر افت پس از اوج (Post-Spike Crash)، فردا صبح فرد احساس خستگی، ناتوانی در تمرکز طولانی و بی‌حوصلگی دارد.</p>' +
        '<h3>۳. خبر علمی خوب: انعطاف‌پذیری عصبی (Neuroplasticity)</h3>' +
        '<p>آسیب غیرقابل بازگشتی در کار نیست. با قطع تحریکات فراهنجار و بازگشت نظم خواب، حساسیت طبیعی مدار پاداش طی چند هفته به تدریج ترمیم می‌شود.</p>'
    },
    'tark-khod-arzaei': {
      kicker: 'مسیر جداگانه · مدیریت عادت جسمی',
      title: 'چطور خودارضایی را ترک کنیم؟ مدیریت عادت‌های تخت و تنهایی',
      html:
        '<p>یکی از بزرگ‌ترین اشتباهات رایج این است که فرد تصور می‌کند تا وقتی نتوانسته هر دو رفتار را هم‌زمان کامل متوقف کند، هیچ پیشرفتی نداشته است. در مرجع حاکم ذهن، محرک بینایی (پورن) از عادت جسمیِ مرتبط با تخت و تنهایی تفکیک می‌شود.</p>' +
        '<h3>سه محرک پنهان عادت‌های تخت</h3>' +
        '<ul>' +
        '<li><strong>بیداری بدون خواب در رختخواب:</strong> ماندن طولانی در تخت با گوشی یا در حالت خستگی ذهنی، مغز را در آستانهٔ وسوسه قرار می‌دهد.</li>' +
        '<li><strong>تنهایی و استرس حل‌نشدهٔ روز:</strong> وقتی هیجانی مثل ناکامی یا تنش کاری در طول روز تخلیه نشده، شب دنبال مسکّن فوری می‌گردد.</li>' +
        '<li><strong>شرم و دور باطل سرزنش:</strong> عذاب وجدان شدید پس از لغزش، خودبه‌خود اضطراب جدیدی می‌سازد که فردا شب دوباره به همان چرخه دامن می‌زند.</li>' +
        '</ul>' +
        '<p>راه‌حل عملی: قانون «ورود به تخت فقط هنگام خواب‌آلودگی واقعی» و ترک اتاق هنگام بروز تنشِ شدید بیدارماندن.</p>'
    },
    relapse: {
      kicker: 'پروتکل اضطراری بدون سرزنش',
      title: 'لغزش بعد از ترک چه کنیم؟ پروتکل ۶۰ دقیقهٔ اول',
      html:
        '<p>خطرناک‌ترین بخش یک لغزش، خودِ لغزش نیست؛ بلکه «اثر حالا که خراب شد» (What-the-hell effect) است که باعث می‌شود فرد بگوید «همه‌چیز صفر شد، پس تا آخر هفته ادامه بدهم».</p>' +
        '<h3>چهار اقدام دقیق در یک ساعت اول</h3>' +
        '<ul>' +
        '<li><strong>دقیقهٔ ۰ تا ۵ (توقف بدون مجازات):</strong> صفحه را ببند، از فضای خصوصی بیرون بیا و آب بخور. نه قول قهرمانانه بده، نه خودت را تحقیر کن.</li>' +
        '<li><strong>دقیقهٔ ۱۵ (پیداکردن حلقهٔ جاافتاده):</strong> فقط یک سؤال ساده بپرس: از کدام سوراخ محیطی وارد شد؟ اکسپلور باز بود؟ گوشی کنار تخت بود؟ فیلتر خاموش شد؟</li>' +
        '<li><strong>دقیقهٔ ۳۰ (بستن همان یک درز):</strong> همان‌جا آن تک درز مشخص را ببند (مثلاً خروج از یک کانال یا جابه‌جایی شارژر).</li>' +
        '<li><strong>تداوم مسیر:</strong> مسیر قبلی تو از بین نرفته؛ مهارت شناخته‌شدن یک تلهٔ تازه به تو اضافه شده است.</li>' +
        '</ul>'
    },
    habits: {
      kicker: 'مرز آموزشی و بالینی · ICD-11',
      title: 'تفاوت عادت مسئله‌ساز و اختلال رفتار جنسی اجباری (CSBD)',
      html:
        '<p>هر عادت نامطلوبی «بیماری روانی» نیست، اما نادیده‌گرفتن نشانه‌های بالینی هم درست نیست. سازمان جهانی بهداشت (WHO) در ویرایش یازدهم طبقه‌بندی بین‌المللی بیماری‌ها (ICD-11)، مرز روشنی ترسیم کرده است.</p>' +
        '<h3>چه زمانی عادت، خودمدیریتی‌پذیر است؟</h3>' +
        '<p>وقتی با تغییر محیط، اصلاح باورها و نظم خواب کنترل رفتار آرام‌آرام به دست می‌آید و عملکرد شغلی، تحصیلی و روابط روزمره پابرجاست.</p>' +
        '<h3>چه زمانی مشاورهٔ تخصصی لازم است؟</h3>' +
        '<ul>' +
        '<li>تداوم الگوی ناتوانی در کنترل تکانه‌ها برای ۶ ماه یا بیشتر با وجود آسیب‌های ملموس.</li>' +
        '<li>اختلال جدی در خواب، شغل، تحصیل، یا روابط صمیمانه و خانوادگی.</li>' +
        '<li>استفادهٔ مداوم بدون احساس لذت، همراه با پریشانی روانی شدید.</li>' +
        '</ul>' +
        '<p>در این شرایط، گفت‌وگو با روان‌شناس بالینی آشنا با رفتارهای اجباری بهترین و مؤثرترین گام علمی است.</p>'
    }
  };

  var readerModal = document.getElementById('hz-reader-modal');
  var readerKicker = document.getElementById('hz-reader-kicker');
  var readerTitle = document.getElementById('hz-reader-title');
  var readerBody = document.getElementById('hz-reader-body');
  var readerCloseBtn = document.getElementById('hz-reader-close');
  var lastFocusedBeforeModal = null;

  function openReaderModal(articleKey) {
    var article = libraryArticles[articleKey];
    if (!article || !readerModal) return;
    lastFocusedBeforeModal = document.activeElement;
    if (readerKicker) readerKicker.textContent = article.kicker;
    if (readerTitle) readerTitle.textContent = article.title;
    if (readerBody) readerBody.innerHTML = article.html;
    readerModal.classList.add('is-open');
    document.body.classList.add('hz-modal-open');
    if (readerCloseBtn) readerCloseBtn.focus();
  }

  function closeReaderModal() {
    if (!readerModal) return;
    readerModal.classList.remove('is-open');
    document.body.classList.remove('hz-modal-open');
    if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') {
      lastFocusedBeforeModal.focus();
    }
  }

  document.querySelectorAll('[data-open-article]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openReaderModal(btn.getAttribute('data-open-article'));
    });
  });

  if (readerCloseBtn) {
    readerCloseBtn.addEventListener('click', closeReaderModal);
  }
  if (readerModal) {
    readerModal.addEventListener('click', function (e) {
      if (e.target === readerModal) closeReaderModal();
    });
  }

  /* ------------------------------------------------------------------------
     8. Instant Reference Search Modal
     ------------------------------------------------------------------------ */
  var searchModal = document.getElementById('hz-search-modal');
  var searchTrigger = document.getElementById('hz-search-trigger');
  var searchClose = document.getElementById('hz-search-close');
  var searchInput = document.getElementById('hz-search-dialog-input');
  var searchResultsBody = document.getElementById('hz-search-results-body');

  var searchIndex = [
    { type: 'page', target: '/features.html', title: 'معرفی کامل اپلیکیشن حاکم ذهن (مایکت)', body: 'سپر SOS با قانون ۵ دقیقه، ثبت مستقل پورن و خودارضایی، مسیر ۱۴۰ روزه در ۳ فاز، ۳۰ فصل روش آسان، ۷ فاز و ۲۱ وظیفه، نسخه طلایی PRO ۹۹ هزار تومان.' },
    { type: 'page', target: '/privacy.html', title: 'حریم خصوصی و نگهداری محلی در حاکم ذهن', body: 'ذخیره محلی در Room بدون ثبت‌نام و شماره تلفن، بکاپ رمزنگاری‌شده AES-256-GCM و شفافیت کامل دسترسی‌ها و پرداخت آفلاین مایکت.' },
    { type: 'page', target: '/tark-porn.html', title: 'راهنمای جامع ترک پورن (روش آسان)', body: 'قطع دسترسی ۵ دقیقه‌ای، مقایسه اراده با روش آسان، حلقه فقط یک نگاه و نقشه ۴ هفته.' },
    { type: 'page', target: '/tark-khod-arzaei.html', title: 'راهنمای جامع ترک خودارضایی (مسیر جداگانه)', body: 'تفکیک از پورن، قانون تختخواب، مدیریت خستگی و تنش شبانه و برنامه ۴ هفته.' },
    { type: 'page', target: '/porn-brain.html', title: 'تأثیر پورن بر مغز و دوپامین', body: 'محرک فراهنجار، تنظیم کاهشی، مه‌ذهنی صبحگاهی، واقعیت علمی و رد شایعات.' },
    { type: 'page', target: '/relapse.html', title: 'لغزش بعد از ترک چه کنیم؟ پروتکل ۶۰ دقیقهٔ اول', body: 'توقف اثر حالا که خراب شد، بستن درز محیطی و ادامهٔ مسیر بدون سرزنش.' },
    { type: 'page', target: '/habits.html', title: 'تفاوت عادت و اختلال CSBD در ICD-11', body: 'مرز خودمدیریتی، معیارهای سازمان جهانی بهداشت و زمان مراجعه به روان‌شناس.' },
    { type: 'page', target: '/guides.html', title: 'مرکز راهنماهای حاکم ذهن', body: 'فهرست کامل و دسته‌بندی‌شدهٔ تمام مقالات و مسیرهای علمی.' },
    { type: 'page', target: '/avarze-khod-arzaei.html', title: 'عوارض خودارضایی و پورن؛ واقعیت یا شایعه؟', body: 'تفکیک شواهد علمی از شایعات ریزش مو و ناباروری؛ خواب، تمرکز، اضطراب و رابطه.' },
    { type: 'page', target: '/khod-arzaei-zanan.html', title: 'ترک خودارضایی زنان بدون شرم و سکوت', body: 'ریشه‌های تنهایی و فرسودگی عاطفی، شکستن شرم هویتی و برنامه ۴ هفته‌ای محرمانه.' },
    { type: 'page', target: '/tark-nojavanan.html', title: 'ترک خودارضایی و پورن در نوجوانی + راهنمای والدین', body: 'مرز کنجکاوی بلوغ با عادت اجباری، فشار همسالان و گفت‌وگوی آرام والدین.' },
    { type: 'page', target: '/tark-khod-arzaei-eslam.html', title: 'ترک خودارضایی از نظر اسلام؛ حکم، توبه و عمل', body: 'حکم استمناء، سه رکن توبه واقعی و هفت قدم عبادی و محیطی هفته اول.' },
    { type: 'page', target: '/triggers.html', title: 'شناخت محرک‌ها و کنترل وسوسه', body: 'الگوی ۴ پرسش برای موقعیت خطر، پاسخ اگر-پس و مکث SOS در لحظه وسوسه.' },
    { type: 'page', target: '/start.html', title: 'شروع کاهش یا ترک در ۴۸ ساعت اول', body: 'هدف قابل مشاهده، ثبت کوتاه سه‌خطی و یک تغییر محیطی در پرخطرترین ساعت.' },
    { type: 'page', target: '/release.html', title: 'دانلود حاکم ذهن ۱٫۸ از مایکت و پشتیبانی', body: 'دریافت رسمی از مایکت برای اندروید ۷ و بالاتر، امکانات رایگان و PRO دائمی.' },
    { type: 'section', target: '#app-showcase', title: 'تور زندهٔ نرم‌افزار حاکم ذهن', body: 'معرفی سپر SOS، آینه رفتاری، داشبورد ۱۴۰ روزه، روش آسان و نسخه طلایی PRO.' },
    { type: 'section', target: '#brain-prism', title: 'شبیه‌ساز دوپامین و منشور مغز', body: 'مقایسه جهش فراهنجار، افت خلأ و بازگشت تعادل.' },
    { type: 'section', target: '#perspective-shift', title: 'تغییر زاویهٔ دید: جنگ اراده یا روش آسان', body: 'مقایسهٔ باور محرومیت با رهایی و جدول چهاربعدی.' },
    { type: 'section', target: '#loop-tonight', title: 'حلقهٔ فقط یک نگاه و ۵ تغییر محیطی امشب', body: 'اسکرول بی‌هدف، حالت ناشناس Incognito، قانون ۵ ثانیه به عقب، DNS امن.' },
    { type: 'section', target: '#horizon-roadmap', title: 'نقشهٔ راه چهار هفته روی افق آرام', body: 'جداسازی فکر از عمل، نظم شبانه، کاهش کلنجار و تبدیل وسوسه به صدای دوردست.' },
    { type: 'section', target: '#faq', title: 'پرسش‌های متداول', body: 'سؤال‌های پرتکرار دربارهٔ ترک سریع ۳ روز، موج وسوسهٔ نیمه‌شب و زمان آرام‌شدن ذهن.' },
    { type: 'section', target: '#sources', title: 'منابع علمی و حدود راهنما', body: 'Mayo Clinic 2023، پژوهش Kraus 2018 و معیارهای WHO ICD-11.' }
  ];

  function renderSearchList(query) {
    if (!searchResultsBody) return;
    var q = (query || '').trim().toLowerCase();
    var matches = !q
      ? searchIndex.slice(0, 6)
      : searchIndex.filter(function (item) {
          return item.title.toLowerCase().indexOf(q) !== -1 || item.body.toLowerCase().indexOf(q) !== -1;
        });

    if (!matches.length) {
      searchResultsBody.innerHTML =
        '<p style="margin:12px 0;color:var(--hz-text-muted)">موردی با این عبارت پیدا نشد. کلماتی مثل «ترک پورن»، «خودارضایی»، «دوپامین»، «روش آسان»، «DNS»، «لغزش» یا «CSBD» را امتحان کن.</p>';
      return;
    }

    var html = '<div class="hz-search-group-label">' + (q ? 'نتایج جست‌وجو' : 'صفحه‌ها و راهنماهای اصلی مرجع') + '</div>';
    matches.forEach(function (item) {
      html +=
        '<button type="button" class="hz-search-item" data-search-type="' +
        item.type +
        '" data-search-target="' +
        item.target +
        '">' +
        '<strong>' +
        item.title +
        '</strong>' +
        '<span>' +
        item.body +
        '</span>' +
        '</button>';
    });
    searchResultsBody.innerHTML = html;

    searchResultsBody.querySelectorAll('.hz-search-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var type = btn.getAttribute('data-search-type');
        var target = btn.getAttribute('data-search-target');
        closeSearchModal();
        if (type === 'page') {
          window.location.href = target;
        } else if (type === 'article') {
          openReaderModal(target);
        } else {
          var sec = document.querySelector(target);
          if (sec) {
            sec.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.location.href = '/' + target;
          }
        }
      });
    });
  }

  function openSearchModal() {
    if (!searchModal) return;
    lastFocusedBeforeModal = document.activeElement;
    searchModal.classList.add('is-open');
    document.body.classList.add('hz-modal-open');
    renderSearchList(searchInput ? searchInput.value : '');
    if (searchInput) searchInput.focus();
  }

  function closeSearchModal() {
    if (!searchModal) return;
    searchModal.classList.remove('is-open');
    document.body.classList.remove('hz-modal-open');
    if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') {
      lastFocusedBeforeModal.focus();
    }
  }

  if (searchTrigger) searchTrigger.addEventListener('click', openSearchModal);
  if (searchClose) searchClose.addEventListener('click', closeSearchModal);
  if (searchModal) {
    searchModal.addEventListener('click', function (e) {
      if (e.target === searchModal) closeSearchModal();
    });
  }
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      renderSearchList(searchInput.value);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSearchModal();
      closeReaderModal();
      closeInlineDrawer();
      closeNavDrawer();
    } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      openSearchModal();
    }
  });

  /* ------------------------------------------------------------------------
     9. Single-Open FAQ Accordion
     ------------------------------------------------------------------------ */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.hz-faq-item'));
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item && other.open) other.removeAttribute('open');
        });
      }
    });
  });

  /* ------------------------------------------------------------------------
     10. Subpage Interactive Controls (Guides Filter, Night & Relapse Steppers)
     ------------------------------------------------------------------------ */
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll('[data-guide-filter]'));
  var topicCards = Array.prototype.slice.call(document.querySelectorAll('[data-topic]'));
  var guidesBentoGrid = document.getElementById('hz-guides-bento');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-guide-filter');
      filterBtns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      if (guidesBentoGrid) {
        guidesBentoGrid.classList.toggle('is-filtered-mode', filter !== 'all');
      }
      topicCards.forEach(function (card) {
        var topics = (card.getAttribute('data-topic') || '').split(' ');
        var show = filter === 'all' || topics.indexOf(filter) !== -1;
        card.classList.toggle('hz-hidden-card', !show);
      });
    });
  });

  var nightBtns = Array.prototype.slice.call(document.querySelectorAll('[data-night-step]'));
  var nightCards = Array.prototype.slice.call(document.querySelectorAll('[data-night-panel]'));
  nightBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var step = btn.getAttribute('data-night-step');
      nightBtns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      nightCards.forEach(function (c) {
        c.classList.toggle('is-highlighted', c.getAttribute('data-night-panel') === step);
      });
    });
  });

  var relapseBtns = Array.prototype.slice.call(document.querySelectorAll('[data-relapse-step]'));
  var relapseCards = Array.prototype.slice.call(document.querySelectorAll('[data-relapse-panel]'));
  relapseBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var step = btn.getAttribute('data-relapse-step');
      relapseBtns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      relapseCards.forEach(function (c) {
        c.classList.toggle('is-highlighted', c.getAttribute('data-relapse-panel') === step);
      });
    });
  });

  /* ------------------------------------------------------------------------
     11. Deep Page-by-Page Interactions (Belief Flips, Tonight Configurator, Labs)
     ------------------------------------------------------------------------ */
  var beliefCards = Array.prototype.slice.call(document.querySelectorAll('[data-belief-card]'));
  beliefCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var isRevealed = card.classList.toggle('is-revealed');
      card.setAttribute('aria-pressed', isRevealed ? 'true' : 'false');
      var stateEl = card.querySelector('.hz-belief-state');
      var titleEl = card.querySelector('h3');
      var answerEl = card.querySelector('.hz-belief-answer');
      var hintEl = card.querySelector('.hz-belief-hint');
      if (isRevealed) {
        if (stateEl) stateEl.textContent = 'واقعیت علمی و عملی';
        if (titleEl && card.dataset.truthTitle) titleEl.textContent = card.dataset.truthTitle;
        if (answerEl && card.dataset.truthBody) answerEl.textContent = card.dataset.truthBody;
        if (hintEl) hintEl.textContent = 'بازگشت به باور رایج';
      } else {
        if (stateEl) stateEl.textContent = 'باور فریبندهٔ رایج';
        if (titleEl && card.dataset.mythTitle) titleEl.textContent = card.dataset.mythTitle;
        if (answerEl && card.dataset.mythBody) answerEl.textContent = card.dataset.mythBody;
        if (hintEl) hintEl.textContent = 'لمس کن تا پاسخ علمی را ببینی ←';
      }
    });
  });

  var scenarioData = {
    'night-bed': {
      title: 'سناریوی آسیب‌پذیری آخر شب در رختخواب',
      insight: 'پژوهش fMRI نشان می‌دهد نشانه‌های محیطی پیش‌بینی‌کننده (تخت + گوشی در تاریکی) پیش از دیدن تصویر، موج اشتیاق را در جسم مخطط روشن می‌کنند [۶].',
      steps: [
        'شارژر گوشی را همین امشب بیرون اتاق خواب بگذار و از یک ساعت زنگ ساده کنار تخت استفاده کن.',
        'تا پلک‌هایت واقعاً سنگین نشده وارد رختخواب نشو؛ اگر ۲۰ دقیقه بیدار ماندی اتاق را ترک کن.',
        'حالت خاکستری (Grayscale) یا زمان استراحت صفحه را از ساعت ۲۲:۳۰ روی گوشی روشن کن.'
      ]
    },
    'explore-scroll': {
      title: 'سناریوی شروع تصادفی از اکسپلور و تلگرام',
      insight: 'بیش از نیمی از لغزش‌ها با تصمیم مستقیم دیدن پورن شروع نمی‌شوند؛ با مواجههٔ اتفاقی با تصاویر نیمه‌تحریک‌آمیز در فید عادی کلید می‌خورند.',
      steps: [
        'همهٔ کانال‌ها و ربات‌های محرک تلگرام را همین الان ترک و آرشیو پنهان را پاک کن.',
        'روی جست‌وجوهای اینستاگرام موضوعات فنی، طبیعت یا ورزشی بگذار و محتوای محرک را «علاقه‌مند نیستم» بزن.',
        'DNS امن خانواده و SafeSearch گوگل را قفل کن تا پل «فقط یه چک» در ۵ ثانیه بسته بماند.'
      ]
    },
    'work-stress': {
      title: 'سناریوی فشار کاری، اضطراب یا ناکامی روزانه',
      insight: 'هنگام تنش هیجانی، مغز دنبال سریع‌ترین مسکّن لحظه‌ای کورتیزول است، حتی اگر یک ساعت بعد کلافگی بیشتری تحویل بگیرد.',
      steps: [
        'قبل از لمس گوشی، ۵ دقیقه جایت را عوض کن و یک لیوان آب خنک بنوش (قانون ۵ ثانیه به عقب).',
        'فشار عصبی را با حرکت فیزیکی سبک (۱۵ دقیقه پیاده‌روی تند یا دوش ولرم) تخلیه کن.',
        'یادآوری روش آسان: پورن استرس کاری را حل نمی‌کند، فقط یک لایه خستگی تازه اضافه می‌کند.'
      ]
    },
    'afternoon-alone': {
      title: 'سناریوی تنهایی و خلأ بی‌برنامه در خانه',
      insight: 'وقتی در ساعتی از روز بدون نقشه در خانه تنها می‌مانی، کسالت فوری ذهن را مستقیم سمت تکراری‌ترین پاداش دسترس می‌برد.',
      steps: [
        'گوشی را در فضای مشترک و روشن خانه روی میز بگذار و وارد اتاق بسته نشو.',
        'برای همان بازهٔ تکراری تنهایی از قبل یک کار مشخص (پادکست، کار دستی، یا خروج از خانه) بچین.',
        'تماس کوتاه با یک دوست یا عضو خانواده، ارتباط اجتماعی واقعی را جایگزین انزوای صفحه می‌کند.'
      ]
    },
    'relapse-bed': {
      title: 'اگر درز لغزش از رختخواب و گوشی بود:',
      insight: 'به جای حس «اراده‌ام ضعیف است»، فقط این سه مانع فیزیکی را امشب بین دستت و صفحه بگذار:',
      steps: [
        'انتقال سیم شارژر به هال یا میز کار بیرون اتاق پیش از ساعت خواب.',
        'خاموش‌کردن اینترنت گوشی یا گذاشتن گوشی در حالت هواپیما هنگام شب.',
        'اجرای قانون ۱۵ دقیقه: بیدارماندن در تخت یعنی ترک فوری رختخواب.'
      ]
    },
    'relapse-social': {
      title: 'اگر درز لغزش از اکسپلور یا تلگرام بود:',
      insight: 'الگوریتم شبکه‌های اجتماعی عمداً برای نگه‌داشتن توجه طراحی شده؛ تغییر محیط دیجیتال مؤثرتر از جنگ ذهنی است:',
      steps: [
        'خروج بی‌چون‌وچرا از کانال‌ها و گروهی که اولین جرقه را فرستاد.',
        'ریست فید اکسپلور با جست‌وجوی ۱۰ حساب علمی، طبیعت یا ورزشی.',
        'حذف موقت اپلیکیشن مرورگر یا شبکهٔ محرک به مدت ۷ روز تا موج آرام شود.'
      ]
    },
    'relapse-stress': {
      title: 'اگر درز لغزش از استرس یا کلافگی ناگهانی بود:',
      insight: 'اینجا بدن دنبال کاهش فشار عصبی بوده، نه خودِ تصویر؛ فردا باید به جای ممنوعیت خشک، تخلیهٔ فشار بسازی:',
      steps: [
        'نوشتن ۲ خط دربارهٔ فشار همان روز برای جداکردن تنش روانی از هوس.',
        'ثبت یک جایگزین ۲۰ دقیقه‌ای ثابت (دوش، پیاده‌روی، تماس) برای ساعات افت انرژی.',
        'اجرای فوری خواب منظم امشب تا کم‌خوابی آستانهٔ تحمل فردا را پایین نیاورد.'
      ]
    },
    'brain-w1': {
      title: 'هفتهٔ ۱: قطع شوک و بی‌قراری اولیه',
      insight: 'در روزهای اول چون سوخت مصنوعی قطع شده، ذهن برای مدت کوتاهی بی‌قرارتر می‌شود؛ این واکنش خروج عادت است، نه نیاز واقعی بدن [۵].',
      steps: [
        'نوسان لحظه‌ای خلق طبیعی است و طی چند روز آرام‌تر می‌شود.',
        'کاهش حجم ورودی تصویر روی چشم، فشار فوری روی جسم مخطط را کم می‌کند.',
        'مهم‌ترین دستاورد هفتهٔ اول: فاصله‌انداختن میان فکر و عمل.'
      ]
    },
    'brain-w2': {
      title: 'هفتهٔ ۲: نظم ملاتونین و سبک‌شدن صبح‌ها',
      insight: 'با دورشدن صفحه از رختخواب، کیفیت خواب عمیق بالا می‌رود و مه‌ذهنی سنگین صبحگاهی به شکل محسوسی کم می‌شود.',
      steps: [
        'طول کشیدن کمتر برای به خواب رفتن در پایان شب.',
        'بیداری سرحال‌تر بدون حس کلافگی پس از شب‌های اسکرول.',
        'بازگشت تدریجی حوصله برای کارهای ۳۰ دقیقه‌ای روزانه.'
      ]
    },
    'brain-w4': {
      title: 'هفتهٔ ۳ تا ۴: تعادل حساسیت پاداش (نوروپلاستیسیتی)',
      insight: 'مطالعات نشان می‌دهند کاهش محرک‌های شدید به مدار فرونتواستریاتال فرصت می‌دهد حساسیت به محرک‌های طبیعی زندگی را بازیابی کند [۵].',
      steps: [
        'کاهش چشمگیر قدرت و تعداد وسوسه‌های ناگهانی در طول هفته.',
        'لذت‌بردن دوباره از گفت‌وگو، ورزش، مطالعه و پیشرفت‌های آرام.',
        'تبدیل‌شدن فکر تصویر به یک صدای دوردست بدون اجبار پاسخ‌دادن.'
      ]
    }
  };

  var scenarioBuilders = Array.prototype.slice.call(document.querySelectorAll('[data-scenario-container]'));
  scenarioBuilders.forEach(function (container) {
    var btns = Array.prototype.slice.call(container.querySelectorAll('[data-scenario-key]'));
    var titleEl = container.querySelector('.hz-scenario-title');
    var insightEl = container.querySelector('.hz-scenario-insight');
    var stepEls = Array.prototype.slice.call(container.querySelectorAll('.hz-scenario-step-text'));

    function applyScenario(key) {
      var item = scenarioData[key];
      if (!item) return;
      btns.forEach(function (b) {
        var active = b.getAttribute('data-scenario-key') === key;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      if (titleEl) titleEl.textContent = item.title;
      if (insightEl) insightEl.textContent = item.insight;
      stepEls.forEach(function (el, idx) {
        if (item.steps[idx]) el.textContent = item.steps[idx];
      });
    }

    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        applyScenario(b.getAttribute('data-scenario-key'));
      });
    });
  });

  /* ------------------------------------------------------------------------
     12. Android App v1.8 Showcase Tour, SOS 5-Min Simulator & Free/PRO Filter
     ------------------------------------------------------------------------ */
  var appTourModules = {
    dashboard: {
      kicker: 'تب داشبورد و ثبت مستقل · مسیر ۱۴۰ روزه',
      title: 'داشبورد «امروز، یک قدم روشن» و تفکیک پورن از خودارضایی',
      summary:
        'توی اپ حاکم ذهن، مسیر ۱۴۰ روزه به جای شعارهای ۳۰ یا ۹۰ روزه، توی سه فاز ۷ هفته‌ای پیوسته جلو می‌ره. از اون مهم‌تر، دوری از پورن و دوری از خودارضایی جدا از هم ثبت می‌شن تا یه لغزش کوچیک همه‌چیزت رو خراب نکنه.',
      screenshot: '/assets/dashboard.webp',
      alt: 'نمای واقعی صفحه داشبورد اپلیکیشن حاکم ذهن: امروز یک قدم روشن، روز ۱ از ۱۴۰، تمرکز امروز و عادت‌های روزانه',
      caption: 'نمای واقعی صفحهٔ داشبورد اپلیکیشن حاکم ذهن (نسخهٔ ۱٫۸ مایکت)',
      landscape: false,
      linkHref: '/features.html#roadmap-140',
      points: [
        'مسیر ۱۴۰ روزه در ۳ فاز ۷ هفته‌ای پیوسته: سم‌زدایی پایه (۱–۴۹)، بازسازی عصبی (۵۰–۹۸) و تثبیت و تسلط (۹۹–۱۴۰)',
        'ثبت جداگانهٔ پاک‌ماندن از پورن و خودارضایی کنار ۱۶ عادت رشد، ۳ عادت صبحگاهی، نماز و شارژر بیرون اتاق',
        'امکان تنظیم «ریتم امروز» و امتیازدهی شفاف ۰ تا ۱۰۰ بر اساس وضعیت واقعی روزت، نه کمال‌گرایی خشک'
      ]
    },
    sos: {
      kicker: 'پناهگاه لحظهٔ خطر · قانون ۵ دقیقه',
      title: 'سپر SOS برای شکستن موج وسوسه بدون سرزنش',
      summary:
        'وقتی وسط شب یهو فشار میاد و مغزت قفل می‌کنه، قرار نیست تنها بمونی. پناه SOS با ۳ تا حالت ورودی («معمولی»، «الان نمی‌تونم فکر کنم» و «زمین‌گیر شدن بعد از لغزش») کنار توئه و بهت می‌گه: فقط ۵ دقیقه هیچ تصمیمی نگیر.',
      screenshot: '/assets/sos-preview.webp',
      alt: 'نمای واقعی صفحه پناه SOS در اپلیکیشن حاکم ذهن: لازم نیست همین حالا تصمیم بگیری، فقط یک نفس راحت و دکمه شروع مکث',
      caption: 'نمای واقعی صفحهٔ پناه اضطراری SOS و شروع مکث ۵ دقیقه‌ای',
      landscape: false,
      linkHref: '/features.html#sos-shield',
      points: [
        'تکیه بر «قانون ۵ دقیقه»: بدون وعده‌های سنگین، فقط ۵ دقیقه صفحه رو ببند، جا‌به‌جا شو و نفس بکش',
        'راهنمای رایگان تنفس ۱۰ ثانیه‌ای (۴ ثانیه دم، ۶ ثانیه بازدم با ریتم آزاد)، زمین‌گیر شدن حسی و هر ۳ بازقاب‌بندی شناختی',
        'در نسخهٔ طلایی PRO: تشخیص HALT (گرسنگی، عصبانیت، تنهایی، خستگی)، مربی تطبیقی SOS از داده‌های ۹۰ روز خودت و صوت اضطراری'
      ]
    },
    mirror: {
      kicker: 'آینهٔ رفتاری · نقشهٔ ۱۴۰ گره در ۷ ناحیه',
      title: 'شناخت الگوهای پنهان و رادار ساعات خطر روی گوشی خودت',
      summary:
        'حاکم ذهن به‌جای نصیحت کلیشه‌ای، از ثبت‌های روزانهٔ خودت یک «آینهٔ رفتاری» می‌سازه تا ببینی دقیقاً کی و بعد از چه عادتی موج سراغت میاد. این تصویر سنجش پزشکی مغز نیست؛ مقدار دادهٔ ثبت‌شده و همراهی رفتارها را نشان می‌دهد، نه علت یا پیش‌بینی.',
      screenshot: '/assets/analytics-preview.webp',
      alt: 'نمای واقعی صفحه شناخت من و الگوهای رفتاری در اپلیکیشن حاکم ذهن همراه با سلب مسئولیت این مشاهده اثبات علت نیست',
      caption: 'نمای واقعی بخش «شناخت من» و آینهٔ رفتاری روی دستگاه کاربر',
      landscape: false,
      linkHref: '/features.html#neural-mirror',
      points: [
        'نقشهٔ بصری ۱۴۰ گره در ۷ ناحیه: قشر پیش‌پیشانی، پیشانی، آهیانه‌ای، پس‌سری، گیجگاهی، لیمبیک و مخچه/ساقهٔ مغز',
        'تفکیک شفاف: نمایش هم‌زمانی رفتارها بدون ادعای تشخیص پزشکی یا پیش‌بینی قطعی',
        'در نسخهٔ طلایی PRO: آنالیز ۳۰ و ۹۰ روزه و تشخیص دقیق ساعات اوج آسیب‌پذیری در شبانه‌روز'
      ]
    },
    easypeasy: {
      kicker: 'پناهگاه روش آسان · ۷ فاز، ۲۱ وظیفه و ۳۰ فصل کتاب',
      title: 'شست‌وشوی مغزی را باز کن، نه زور اراده را بیشتر',
      summary:
        'توی تب روش آسان، هم کتاب کامل ۱۹۸ صفحه‌ای «ترک پورنوگرافی به روش آسان» توی ۳۰ گام (۳۰ فصل) در اختیارت قرار گرفته، هم یک مسیر عملی در ۷ فاز (هر فاز ۳ وظیفه، جمعاً ۲۱ وظیفه) تا هم «هیولای کوچک» شیمیایی آروم بشه و هم «هیولای بزرگ»ِ فریب ذهنی فرو بریزه.',
      screenshot: '/assets/curtain_illusion_break_1794517421527.jpg',
      alt: 'فضای روشن پنجرهٔ رو به صبح به نشانهٔ کنار رفتن باورهای فریبنده در روش آسان',
      caption: 'روش آسان در حاکم ذهن ۱٫۸: گام‌های ۱ تا ۵ برای همیشه رایگان است',
      landscape: true,
      linkHref: '/features.html#easypeasy-engine',
      points: [
        'تمایز روشن: ۳۰ گام یعنی ۳۰ فصل کتاب روش آسان؛ در کنارش ۷ فاز و ۲۱ وظیفهٔ ترتیبی برای اجرای روزمره چیده شده',
        'تخلیهٔ هیولای کوچک (میل شیمیایی) از ۱۰۰ به ۰ ظرف ۲۸ روز همراه با بازکردن دام‌های روانی هیولای بزرگ',
        'حتی با یک لغزش، دانش فاز ۰ تا ۲ هرگز پاک نمی‌شه و مسیر از روز ۸ دوباره ادامه پیدا می‌کنه'
      ]
    }
  };

  var appTabBtns = Array.prototype.slice.call(document.querySelectorAll('[data-app-tab]'));
  var appReadout = document.getElementById('hz-app-readout');
  var appKicker = document.getElementById('hz-app-kicker');
  var appTitle = document.getElementById('hz-app-title');
  var appSummary = document.getElementById('hz-app-summary');
  var appPoints = [
    document.getElementById('hz-app-pt-1'),
    document.getElementById('hz-app-pt-2'),
    document.getElementById('hz-app-pt-3')
  ];
  var appDeepLink = document.getElementById('hz-app-deeplink');
  var appBezel = document.getElementById('hz-phone-bezel');
  var appScreen = document.getElementById('hz-phone-screen');
  var appCaption = document.getElementById('hz-phone-caption');

  function activateAppTab(tabKey) {
    var spec = appTourModules[tabKey];
    if (!spec) return;
    appTabBtns.forEach(function (btn) {
      var active = btn.getAttribute('data-app-tab') === tabKey;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    if (appKicker) appKicker.textContent = spec.kicker;
    if (appTitle) appTitle.textContent = spec.title;
    if (appSummary) appSummary.textContent = spec.summary;
    appPoints.forEach(function (el, idx) {
      if (el && spec.points[idx]) el.textContent = spec.points[idx];
    });
    if (appDeepLink) appDeepLink.setAttribute('href', spec.linkHref);
    if (appScreen) {
      appScreen.setAttribute('src', spec.screenshot);
      appScreen.setAttribute('alt', spec.alt);
    }
    if (appCaption) appCaption.textContent = spec.caption;
    if (appBezel) {
      appBezel.classList.toggle('is-landscape', Boolean(spec.landscape));
      appBezel.classList.remove('is-switching');
      void appBezel.offsetWidth;
      appBezel.classList.add('is-switching');
    }
    if (appReadout) {
      appReadout.classList.remove('is-switching');
      void appReadout.offsetWidth;
      appReadout.classList.add('is-switching');
    }
  }

  appTabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activateAppTab(btn.getAttribute('data-app-tab'));
    });
  });

  /* Interactive SOS 5-Minute Pause & Breathing Preview */
  var sosSteps = {
    pause: {
      title: 'قانون ۵ دقیقه: فقط ۵ دقیقه هیچ تصمیمی نگیر',
      body: 'وقتی موج هوس میاد بالا، مغز می‌خواد مجبورت کنه همین الان تصمیم بگیری. اپ حاکم ذهن بهت یادآوری می‌کنه لازم نیست برای کل عمرت تصمیم بگیری؛ فقط همین ۵ دقیقه گوشی رو زمین بذار، جات رو عوض کن و یه لیوان آب خنک بخور. بعد از ۵ دقیقه خودت می‌فهمی موج چقدر خوابیده.'
    },
    breath: {
      title: 'تنفس آرام ۱۰ ثانیه‌ای (۴ دم / ۶ بازدم)',
      body: 'بدون اجبار و خشک‌بودن، ۴ ثانیه آروم نفس بکش تو، ۶ ثانیه آروم بده بیرون. طولانی‌بودن بازدم به سیستم عصبی پاراسمپاتیک علامت امنیت می‌ده تا ضربان قلب بیاد پایین و مغز از حالت حمله و فرار خارج بشه.'
    },
    halt: {
      title: 'چک کردن ریشهٔ لحظه با HALT (ویژهٔ PRO)',
      body: 'خیلی وقت‌ها چیزی که حس می‌کنی هوس جنس نیست؛ یا گرسنه‌ای (Hungry)، یا عصبی و کلافه‌ای (Angry)، یا تنهایی (Lonely)، یا از بی‌پایانی کار خسته‌ای (Tired). اپ توی نسخهٔ طلایی PRO با مربی تطبیقی از داده‌های ۹۰ روز خودت دقیقاً نشون می‌ده الان کدوم یکی فعاله.'
    },
    lapse: {
      title: 'حالت زمین‌گیر شدن بعد از لغزش (POST_LAPSE_GROUNDING)',
      body: 'اگه همین چند دقیقه پیش لغزش داشتی، سپر SOS حالت اختصاصی بدون سرزنش داره که همون لحظه جلوی اثر «حالا که همه‌چیز خراب شد» رو می‌گیره. دانش فاز ۰ تا ۲ روش آسان سر جاش می‌مونه و فردا بدون شرم مسیر رو ادامه می‌دی.'
    }
  };

  var sosBtns = Array.prototype.slice.call(document.querySelectorAll('[data-sos-step]'));
  var sosTitle = document.getElementById('hz-sos-title');
  var sosBody = document.getElementById('hz-sos-body');

  sosBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-sos-step');
      var info = sosSteps[key];
      if (!info) return;
      sosBtns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      if (sosTitle) sosTitle.textContent = info.title;
      if (sosBody) sosBody.textContent = info.body;
    });
  });

  var breathBtn = document.getElementById('hz-sos-breath-btn');
  var breathOrb = document.getElementById('hz-breath-orb');
  if (breathBtn && breathOrb) {
    breathBtn.addEventListener('click', function () {
      var active = breathOrb.classList.toggle('is-breathing');
      breathBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
      breathBtn.textContent = active ? 'توقف ریتم تنفس' : 'شروع دم ۴ث / بازدم ۶ث';
      breathOrb.textContent = active ? '۴ دم · ۶ بازدم' : 'مکث ۵ دقیقه';
    });
  }

  /* Free vs PRO Matrix Filter */
  var proFilterBtns = Array.prototype.slice.call(document.querySelectorAll('[data-pro-filter]'));
  var proRows = Array.prototype.slice.call(document.querySelectorAll('[data-pro-tier]'));
  proFilterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tier = btn.getAttribute('data-pro-filter');
      proFilterBtns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      proRows.forEach(function (row) {
        var rowTier = row.getAttribute('data-pro-tier');
        var show = tier === 'all' || rowTier === tier;
        row.classList.toggle('hz-hidden-row', !show);
      });
    });
  });

  /* ------------------------------------------------------------------------
     13. Interactive Orbital Bottom Dock & Expandable Command Sheet
     ------------------------------------------------------------------------ */
  var mobileDock = document.querySelector('.hz-mobile-dock');
  var dockHubBtn = document.getElementById('hz-dock-hub-btn');

  if (mobileDock && dockHubBtn) {
    var atlasPages = [
      { href: '/index.html', label: 'صفحهٔ اصلی' },
      { href: '/features.html', label: 'معرفی اپلیکیشن' },
      { href: '/privacy.html', label: 'حریم خصوصی' },
      { href: '/tark-porn.html', label: 'ترک پورن' },
      { href: '/tark-khod-arzaei.html', label: 'ترک خودارضایی' },
      { href: '/porn-brain.html', label: 'مغز و دوپامین' },
      { href: '/relapse.html', label: 'پروتکل لغزش' },
      { href: '/habits.html', label: 'عادت و CSBD' }
    ];

    var currentPath = window.location.pathname || '/index.html';
    if (currentPath === '/') currentPath = '/index.html';

    // Discover major headings/sections on current page dynamically
    var sectionItems = [];
    var discovered = Array.prototype.slice.call(document.querySelectorAll('main section[id], article section[id]'));
    discovered.forEach(function (sec, idx) {
      var sid = sec.getAttribute('id');
      if (!sid) return;
      var heading = sec.querySelector('h1, h2, h3');
      var text = heading ? heading.textContent.trim() : sid;
      if (text.length > 46) text = text.slice(0, 44) + '…';
      sectionItems.push({ id: sid, num: persianDigitsMap[idx + 1] || String(idx + 1), label: text });
    });
    if (!sectionItems.length) {
      sectionItems.push({ id: 'main-content', num: '۱', label: 'ابتدای راهنمای صفحه' });
    }

    var backdrop = document.createElement('div');
    backdrop.className = 'hz-dock-backdrop';
    backdrop.id = 'hz-dock-backdrop';

    var sheet = document.createElement('section');
    sheet.className = 'hz-dock-sheet';
    sheet.id = 'hz-dock-sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', 'قطب‌نمای سریع و دسترسی‌های حاکم ذهن');
    sheet.setAttribute('aria-hidden', 'true');

    var outlineHtml = sectionItems
      .slice(0, 6)
      .map(function (item) {
        return (
          '<a class="hz-dock-outline-item" href="#' +
          item.id +
          '"><span>' +
          item.label +
          '</span><span>پرش ↙</span></a>'
        );
      })
      .join('');

    var atlasHtml = atlasPages
      .map(function (p) {
        var active = currentPath === p.href;
        return (
          '<a class="hz-dock-atlas-link' +
          (active ? ' is-current' : '') +
          '" href="' +
          p.href +
          '"><span>' +
          p.label +
          '</span><span>←</span></a>'
        );
      })
      .join('');

    sheet.innerHTML =
      '<div class="hz-dock-sheet-head">' +
      '<div class="hz-dock-sheet-brand">' +
      '<img src="/assets/icon-sm.webp" width="28" height="28" alt="نشان حاکم ذهن" referrerpolicy="no-referrer" />' +
      '<div><strong class="hz-dock-sheet-title">قطب‌نمای سریع حاکم ذهن</strong>' +
      '<span class="hz-dock-sheet-progress" id="hz-dock-sheet-progress">در حال آماده‌سازی ردیاب مطالعه...</span></div>' +
      '</div>' +
      '<button type="button" class="hz-dock-sheet-close" id="hz-dock-sheet-close" aria-label="بستن قطب‌نما">×</button>' +
      '</div>' +
      '<div class="hz-dock-sheet-tabs" role="tablist">' +
      '<button type="button" class="hz-dock-sheet-tab is-active" data-dock-pane="outline" role="tab" aria-selected="true">بخش‌های صفحه</button>' +
      '<button type="button" class="hz-dock-sheet-tab" data-dock-pane="atlas" role="tab" aria-selected="false">کل مرجع و اپ</button>' +
      '</div>' +
      '<div class="hz-dock-pane is-active" data-dock-panel="outline"><div class="hz-dock-outline-list">' +
      outlineHtml +
      '</div></div>' +
      '<div class="hz-dock-pane" data-dock-panel="atlas"><div class="hz-dock-atlas-grid">' +
      atlasHtml +
      '</div>' +
      '<a class="hz-dock-outline-item" style="margin-bottom:12px" href="/guides.html"><span>مرکز همهٔ راهنماها و منابع علمی</span><span>مشاهده ←</span></a>' +
      '</div>';

    document.body.appendChild(backdrop);
    document.body.appendChild(sheet);
    updateReadingProgress();

    function openDockSheet() {
      sheet.classList.add('is-open');
      backdrop.classList.add('is-open');
      sheet.setAttribute('aria-hidden', 'false');
      dockHubBtn.setAttribute('aria-expanded', 'true');
      dockHubBtn.classList.add('is-active');
      updateReadingProgress();
    }

    function closeDockSheet() {
      sheet.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      sheet.setAttribute('aria-hidden', 'true');
      dockHubBtn.setAttribute('aria-expanded', 'false');
      dockHubBtn.classList.remove('is-active');
    }

    dockHubBtn.addEventListener('click', function () {
      if (sheet.classList.contains('is-open')) {
        closeDockSheet();
      } else {
        openDockSheet();
      }
    });

    backdrop.addEventListener('click', closeDockSheet);
    var closeBtn = document.getElementById('hz-dock-sheet-close');
    if (closeBtn) closeBtn.addEventListener('click', closeDockSheet);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet.classList.contains('is-open')) {
        closeDockSheet();
      }
    });

    // Sheet tab switching
    var sheetTabs = Array.prototype.slice.call(sheet.querySelectorAll('[data-dock-pane]'));
    var sheetPanels = Array.prototype.slice.call(sheet.querySelectorAll('[data-dock-panel]'));
    sheetTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var pane = tab.getAttribute('data-dock-pane');
        sheetTabs.forEach(function (t) {
          var active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        sheetPanels.forEach(function (p) {
          p.classList.toggle('is-active', p.getAttribute('data-dock-panel') === pane);
        });
      });
    });

    // Smooth jump to anchor links from outline list & close sheet
    sheet.querySelectorAll('.hz-dock-outline-item').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (href && href.charAt(0) === '#') {
          var target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            closeDockSheet();
            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     14. Interactive Glass Card Pointer Spotlight (--mx / --my)
     ------------------------------------------------------------------------ */
  if (!prefersReducedMotion && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
    var spotlightCards = document.querySelectorAll(
      '.hz-library-card, .hz-cluster-link-card, .hz-step-card, .hz-belief-card'
    );
    spotlightCards.forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left).toFixed(1) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top).toFixed(1) + 'px');
      });
    });
  }
  /* ------------------------------------------------------------------------
     15. Flagship /features.html Hero Phone Cockpit & Day-by-Day Companion Timeline
     ------------------------------------------------------------------------ */
  var cockpitScreens = {
    dashboard: {
      step: '۰۱ / ۰۵',
      badge: 'شروع با ریتم خودت · آرام‌تر، آگاه‌تر، قدرتمندتر',
      headline: 'هر روزت با «حدیث روز»، تمرکز و ثبت مستقل شروع می‌شود',
      insight:
        'تفکیک پاک‌ماندن از پورن و خودارضایی، انتخاب شروع از قدم اول یا واردکردن روز فعلی، ۱۶ عادت رشد و ۳ عادت صبحگاهی.',
      src: '/assets/dashboard.webp',
      alt: 'نمای واقعی صفحه داشبورد اپلیکیشن حاکم ذهن ۱٫۸ با روز ۱ از ۱۴۰، تمرکز امروز و عادت‌های روزانه',
      overlayMode: 'none'
    },
    sos: {
      step: '۰۲ / ۰۵',
      badge: 'قانون ۵ دقیقه · بدون اجبار و سرزنش',
      headline: 'وسط شب که فشار میاد، لازم نیست برای کل عمرت تصمیم بگیری',
      insight:
        'سه حالت ورود («معمولی»، «الان نمی‌تونم فکر کنم»، «زمین‌گیر شدن بعد از لغزش») + تنفس ۴-۶ و چک HALT در PRO.',
      src: '/assets/sos-preview.webp',
      alt: 'نمای واقعی صفحه پناه SOS اپلیکیشن حاکم ذهن: لازم نیست همین حالا تصمیم بگیری',
      overlayMode: 'none'
    },
    journey: {
      step: '۰۳ / ۰۵',
      badge: 'یک کتاب، یک سفر درونی · ۳۰ فصل',
      headline: 'کتاب روش آسان روی جادهٔ کوهستانی ۳۰ قله',
      insight:
        'چهار بخش «مسیر · حقایق · تأمل · SOS» با گام‌های صفحه به صفحه (۵ فصل اول همیشه رایگان).',
      src: '/assets/app-journey-mountain.jpg',
      alt: 'نمایی از مسیر کوهستانی ۳۰ فصل روش آسان در اپلیکیشن حاکم ذهن ۱٫۸',
      overlayMode: 'journey'
    },
    cortex: {
      step: '۰۴ / ۰۵',
      badge: 'کالیبراسیون ۲ دقیقه‌ای · ۱۴۰ گره',
      headline: 'نقشهٔ ۳بعدی کورتکس با پالس‌های کنترل اجرایی',
      insight:
        'چرخاندن لمسی و تطبیق رادار وسوسه با ساعات خطر خودت (سنجش پزشکی مغز نیست).',
      src: '/assets/app-neural-cortex.jpg',
      alt: 'نمای کورتکس سه بعدی و پالس های سیناپسی در نقشه مغز اپلیکیشن حاکم ذهن ۱٫۸',
      overlayMode: 'cortex'
    },
    mirror: {
      step: '۰۵ / ۰۵',
      badge: 'تحلیل ۳۰ و ۹۰ روز خودت · شناخت من',
      headline: 'ببین دقیقاً کدوم اقدامت، موج وسوسه رو از ۵ به ۲ پایین آورد',
      insight:
        'مقایسهٔ واقعی قبل و بعد اقدام (ثبت سریع این لحظه، خواب و گوشی کنار تخت) روی گوشی خودت؛ بدون آمارهای جعلی.',
      src: '/assets/analytics-preview.webp',
      alt: 'نمای واقعی بخش شناخت من و آینه رفتاری اپلیکیشن حاکم ذهن با مقایسه قبل و بعد اقدام',
      overlayMode: 'none'
    }
  };

  var cockpitBtns = Array.prototype.slice.call(document.querySelectorAll('[data-cockpit-screen]'));
  var cockpitBezel = document.getElementById('hz-cockpit-bezel');
  var cockpitImg = document.getElementById('hz-cockpit-screen-img');
  var cockpitCaptionBox = document.getElementById('hz-cockpit-caption-box');
  var cockpitBadge = document.getElementById('hz-cockpit-badge');
  var cockpitStep = document.getElementById('hz-cockpit-step');
  var cockpitHeadline = document.getElementById('hz-cockpit-headline');
  var cockpitInsight = document.getElementById('hz-cockpit-insight');

  cockpitBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-cockpit-screen');
      var spec = cockpitScreens[key];
      if (!spec) return;
      cockpitBtns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      if (cockpitBadge) cockpitBadge.textContent = spec.badge;
      if (cockpitStep && spec.step) cockpitStep.textContent = spec.step;
      if (cockpitHeadline) cockpitHeadline.textContent = spec.headline;
      if (cockpitInsight) cockpitInsight.textContent = spec.insight;
      if (cockpitImg) {
        cockpitImg.setAttribute('src', spec.src);
        cockpitImg.setAttribute('alt', spec.alt);
      }
      if (cockpitBezel) {
        cockpitBezel.classList.toggle('is-journey-mode', spec.overlayMode === 'journey');
        cockpitBezel.classList.toggle('is-cortex-mode', spec.overlayMode === 'cortex');
        cockpitBezel.classList.remove('is-switching');
        void cockpitBezel.offsetWidth;
        cockpitBezel.classList.add('is-switching');
      }
      if (cockpitCaptionBox) {
        cockpitCaptionBox.classList.remove('is-switching');
        void cockpitCaptionBox.offsetWidth;
        cockpitCaptionBox.classList.add('is-switching');
      }
    });
  });

  var companionMilestones = {
    night1: {
      phaseLabel: 'فاز ۱ · سم‌زدایی پایه (روز ۱ تا ۴۹)',
      progressPercent: 4,
      litNodes: 3,
      title: 'ورود بدون ثبت‌نام، بدون شمارهٔ تلفن و بدون قضاوت',
      body: 'ذهن عادت دارد شب اول دنبال وعدهٔ سنگین یا فرار از کلافگی باشد. تمرکز امشب فقط «نصب آرامش و بستن درزهای فوری» است.',
      app: 'چک شارژر بیرون از اتاق، تنظیم ریتم امروز، خواندن فصل ۱ کتاب روش آسان (رایگان) و آماده‌باش کامل دکمهٔ SOS با قانون ۵ دقیقه.',
      safety: 'اگر امشب خسته شدی، به جای قول‌های یک‌ساله فقط مکث ۵ دقیقه‌ای را بزن.'
    },
    day7: {
      phaseLabel: 'فاز ۱ · سم‌زدایی پایه (روز ۱ تا ۴۹)',
      progressPercent: 14,
      litNodes: 14,
      title: 'عبور از موج‌های بی‌قراری اولیه و شناخت ساعت خطر خودت',
      body: 'در هفتهٔ اول سطح دوپامین به نبود سوخت فراهنجار واکنش نشان می‌دهد؛ ممکن است موج‌های کوتاه هوس یا بی‌حوصلگی بیاید.',
      app: 'تکمیل وظایف فاز ۰ تا ۲ روش آسان، ثبت مستقل روزهای پاکِ پورن و خودارضایی و روشن‌شدن اولین رگه‌های الگو در بخش «شناخت من».',
      safety: 'حتی اگر در خودارضایی لغزشی بود، شمارش دوری از پورن و دانش فاز ۰–۲ پاک نمی‌شود.'
    },
    day28: {
      phaseLabel: 'فاز ۱ · سم‌زدایی پایه (روز ۱ تا ۴۹)',
      progressPercent: 32,
      litNodes: 42,
      title: 'آب‌شدن «هیولای کوچک» از ۱۰۰ به ۰ و بیدارشدن لذت‌های واقعی',
      body: 'وابستگی شیمیایی لحظه‌ای («هیولای کوچک») ظرف ۲۸ روز افت محسوسی می‌کند و کیفیت خواب و تمرکز صبحگاهی به شکل ملموسی بالا می‌آید.',
      app: 'فصل‌های عمیق روش آسان، جایگزینی با ۱۶ عادت رشد (مطالعه، ورزش سبک، تغذیه) و بررسی ۳۰ روزهٔ ماشه‌ها در آینهٔ رفتاری.',
      safety: 'اگر وسوسه از تنهایی یا خستگی آمد، چک HALT و قانون ۵ دقیقه سریع ریشه را جدا می‌کند.'
    },
    day49: {
      phaseLabel: 'پایان فاز ۱ ← ورود به فاز ۲ (بازسازی عصبی)',
      progressPercent: 52,
      litNodes: 68,
      title: 'عبور موفق از ۷ هفتهٔ اول و ورود به فاز دوم بازسازی',
      body: 'عادت‌های شبانه جایگزین شده‌اند، اسکرول بی‌هدف دیگر حکم خودکار ندارد و قشر پیش‌پیشانی فرصت نظم‌دهی دوباره پیدا کرده است.',
      app: 'تثبیت کارهای روزهای ۴۰ و نزدیک‌شدن به چالش‌های رشد، فعال‌شدن بیش از نیمی از گره‌های ناحیهٔ پیشانی و آهیانه‌ای در نقشهٔ پیشرفت.',
      safety: 'فراموشی فریب «یه بار که اشکال نداره» با مرور یادداشت‌های شخصی روزهای سخت گذشته.'
    },
    day98: {
      phaseLabel: 'پایان فاز ۲ ← ورود به فاز ۳ (تثبیت و تسلط)',
      progressPercent: 78,
      litNodes: 112,
      title: 'آرامش عصبی ۹۰ روزه و کاهش چشمگیر قدرت محرک‌های قبلی',
      body: 'محرک‌های قدیمی دیگر مثل آژیر خطر عمل نمی‌کنند؛ بین فکر گذرا و اقدام عملی یک فاصلهٔ امن و خودآگاه شکل گرفته است.',
      app: 'همبستگی‌های ۹۰ روزه در آینهٔ رفتاری، تکمیل وظایف رشد تا روز ۸۰ به بعد، و ثبات ۳ عادت صبحگاهی بدون نیاز به جنگ ذهنی.',
      safety: 'مسیر ۱۴۰ روزه یادآوری می‌کند ثبات بدون سخت‌گیری خشک از دل ریتم آرام ساخته می‌شود.'
    },
    day140: {
      phaseLabel: 'فاز ۳ کامل · پایان هفتهٔ ۲۰ (حاکمیت ذهن)',
      progressPercent: 100,
      litNodes: 140,
      title: 'حاکمیت ذهن: آزادی پایدار بدون حس محرومیت یا شمردن روزها',
      body: 'دیگر احساس نمی‌کنی چیزی را باخته‌ای یا با خودت می‌جنگی؛ ذهن به تعادل طبیعی پاداش‌های واقعی زندگی برگشته است.',
      app: 'تکمیل هر ۱۴۰ گره در ۷ ناحیهٔ نقشهٔ همراهی رفتارها، اتمام کل ۳ فاز ۷ هفته‌ای و نگهداری امن دستاوردهای رمزنگاری‌شدهٔ `.hzbackup`.',
      safety: 'حاکم ذهن همراه همیشگی تو در جیب می‌ماند؛ حتی پس از اتمام دورهٔ ۱۴۰ روزه.'
    }
  };

  var dayBtns = Array.prototype.slice.call(document.querySelectorAll('[data-companion-day]'));
  var tlPhaseEl = document.getElementById('hz-timeline-phase');
  var tlNodesEl = document.getElementById('hz-timeline-nodes');
  var tlFillEl = document.getElementById('hz-timeline-fill');
  var tlReadoutEl = document.getElementById('hz-companion-readout');
  var tlTitleEl = document.getElementById('hz-companion-title');
  var tlBodyEl = document.getElementById('hz-companion-body');
  var tlAppEl = document.getElementById('hz-companion-app');
  var tlSafetyEl = document.getElementById('hz-companion-safety');

  function toPersianDigits(num) {
    var map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, function (d) {
      return map[Number(d)];
    });
  }

  dayBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dayKey = btn.getAttribute('data-companion-day');
      var info = companionMilestones[dayKey];
      if (!info) return;
      dayBtns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      if (tlPhaseEl) tlPhaseEl.textContent = info.phaseLabel;
      if (tlNodesEl) tlNodesEl.textContent = toPersianDigits(info.litNodes) + ' از ۱۴۰ گره فعال در مسیر همراهی';
      if (tlFillEl) tlFillEl.style.width = info.progressPercent + '%';
      if (tlTitleEl) tlTitleEl.textContent = info.title;
      if (tlBodyEl) tlBodyEl.textContent = info.body;
      if (tlAppEl) tlAppEl.textContent = info.app;
      if (tlSafetyEl) tlSafetyEl.textContent = info.safety;
      if (tlReadoutEl) {
        tlReadoutEl.classList.remove('is-switching');
        void tlReadoutEl.offsetWidth;
        tlReadoutEl.classList.add('is-switching');
      }
    });
  });
})();




