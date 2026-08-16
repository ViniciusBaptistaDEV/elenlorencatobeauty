(function () {
  const THEME = {
    bg: "247, 215, 232",      // rosa claro do site
    trailAlpha: 0.015,         // rastro mais curto = pontos de luz fluindo, não "pena longa"
    particleColors: [
      "201, 168, 106",         // dourado do botão
      "232, 176, 196",         // rosa petala
      "214, 150, 130",         // rosé mais quente, pra dar variação sem cair no branco
    ],
  };

  // Menos partículas em mobile para não pesar a performance (elegante, não carregado)
  const PARTICLE_COUNT = window.innerWidth < 768 ? 110 : 180;

  function fieldAngle(x, y, t) {
    const s = 0.0022;
    return (
      Math.sin(x * s + t * 0.0004) * Math.PI +
      Math.cos(y * s + t * 0.0003) * Math.PI +
      Math.sin((x + y) * s * 0.5 + t * 0.0005) * Math.PI * 0.5
    );
  }

  function initFlowField(canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = 0, height = 0, animId = 0, time = 0, particles = [];

    const CYCLE_DURATION = 10000;
    const CLEAR_DURATION = 1500;
    const NORMAL_TRAIL_ALPHA = 0.065;
    const CLEAR_TRAIL_ALPHA = 0.18;

    let cycleStart = performance.now();
    let isClearing = false;

    function spawnParticle() {
      const maxLife = 400 + Math.floor(Math.random() * 400); // vida mais longa = fluxo mais calmo
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.6 + Math.random() * 0.7,
        color: THEME.particleColors[Math.floor(Math.random() * THEME.particleColors.length)],
        radius: 1 + Math.random() * 1.8,
        life: Math.floor(Math.random() * maxLife),
        maxLife,
      };
    }

    function resize() {
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      ctx.fillStyle = "rgb(" + THEME.bg + ")";
      ctx.fillRect(0, 0, width, height);

      particles = Array.from({ length: PARTICLE_COUNT }, spawnParticle);
    }

    function render() {
      const now = performance.now();
      const elapsed = now - cycleStart;

      if (!isClearing && elapsed >= CYCLE_DURATION) {
        isClearing = true;
      }

      if (isClearing && elapsed >= CYCLE_DURATION + CLEAR_DURATION) {
        particles = Array.from({ length: PARTICLE_COUNT }, spawnParticle);
        cycleStart = now;
        isClearing = false;
      }

      const currentTrailAlpha = isClearing ? CLEAR_TRAIL_ALPHA : NORMAL_TRAIL_ALPHA;

      time++;
      ctx.fillStyle = "rgba(" + THEME.bg + ", " + currentTrailAlpha + ")";
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        const angle = fieldAngle(p.x, p.y, time);
        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;
        p.life++;

        if (p.life > p.maxLife) {
          p.x = Math.random() * width;
          p.y = Math.random() * height;
          p.life = 0;
          continue;
        }

        if (p.x < 0) p.x += width; else if (p.x > width) p.x -= width;
        if (p.y < 0) p.y += height; else if (p.y > height) p.y -= height;

        const progress = p.life / p.maxLife;
        const fadeIn = Math.min(progress * 6, 1);
        const fadeOut = Math.min((1 - progress) * 5, 1);
        const alpha = fadeIn * fadeOut * 0.5; // bem sutil

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + p.color + ", " + alpha + ")";
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener("resize", resize);
    render();

    return function cleanup() {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("flow-field-canvas");
    if (canvas) initFlowField(canvas);
  });
})();