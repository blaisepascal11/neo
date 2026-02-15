(() => {
  const canvas = document.getElementById('matrix');
  const ctx = canvas.getContext('2d');

  // Classic Matrix configuration
  const fontSize = 14;
  const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワンガギグゲゴザジズゼゾダヂデドバビブベボパ0123456789";

  let columns = 0;
  let drops = [];
  let speeds = [];
  let active = [];

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const prevColumns = columns;
    columns = Math.floor(w / fontSize);
    
    if (columns !== prevColumns) {
      const newDrops = new Array(columns);
      const newSpeeds = new Array(columns);
      const newActive = new Array(columns);
      
      for (let i = 0; i < columns; i++) {
        if (i < prevColumns) {
          newDrops[i] = drops[i];
          newSpeeds[i] = speeds[i];
          newActive[i] = active[i];
        } else {
          newDrops[i] = Math.random() * -100;
          newSpeeds[i] = 1 + Math.random() * 2;
          newActive[i] = Math.random() > 0.02;
        }
      }
      
      drops = newDrops;
      speeds = newSpeeds;
      active = newActive;
    }
  }

  function getChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  let lastTime = 0;
  const frameInterval = 1000 / 20; // 20 FPS for that classic Matrix feel

  function draw(currentTime) {
    requestAnimationFrame(draw);
    
    const deltaTime = currentTime - lastTime;
    if (deltaTime < frameInterval) return;
    lastTime = currentTime - (deltaTime % frameInterval);

    // Fade with black overlay (classic trail effect)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < columns; i++) {
      if (!active[i]) {
        if (Math.random() > 0.995) active[i] = true;
        continue;
      }

      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Head - bright white-green
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(0, 255, 70, 1)';
      ctx.fillText(getChar(), x, y);

      // Body - bright green
      if (drops[i] > 0) {
        ctx.fillStyle = '#0f0';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 255, 0, 0.8)';
        ctx.fillText(getChar(), x, y - fontSize);
      }

      // Tail - fading green
      for (let j = 2; j < 8; j++) {
        const tailY = y - j * fontSize;
        if (tailY < 0) break;
        
        const alpha = Math.max(0, 0.8 - j * 0.12);
        ctx.fillStyle = `rgba(0, ${Math.floor(200 - j * 15)}, 0, ${alpha})`;
        ctx.shadowBlur = 0;
        ctx.fillText(getChar(), x, tailY);
      }

      // Update position
      drops[i] += speeds[i];

      // Reset when off screen
      if (y > window.innerHeight && Math.random() > 0.975) {
        drops[i] = 0;
        speeds[i] = 0.5 + Math.random() * 1.5;
        active[i] = Math.random() > 0.05;
      }
    }
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 200);
  });

  resize();
  requestAnimationFrame(draw);
})();
