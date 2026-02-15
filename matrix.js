(() => {
  const canvas = document.getElementById('matrix');
  const ctx = canvas.getContext('2d');

  // Visual tuning
  const fontSize = 16;
  const KATAKANA = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワンガギグゲゴザジズゼゾダヂデドバビブベボパ";

  let columns = 0;
  let drops = [];
  let speeds = [];
  let streamLengths = [];

  // Initialize/rescale canvas for DPR and density
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    
    // CSS pixels, but physical canvas uses DPR for crisp rendering
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    columns = Math.floor(w / fontSize) + 1;
    drops = new Array(columns);
    speeds = new Array(columns);
    streamLengths = new Array(columns);
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -20) - 5;
      speeds[i] = 1 + Math.floor(Math.random() * 3);
      streamLengths[i] = 6 + Math.floor(Math.random() * 14);
    }
  }

  // Katakana random character
  function randKatakana() {
    const idx = Math.floor(Math.random() * KATAKANA.length);
    return KATAKANA.charAt(idx);
  }

  // Main render loop
  function draw() {
    // Fade previous frame to create trails
    ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Draw each column's stream
    for (let i = 0; i < columns; i++) {
      const x = i * fontSize;
      const yHead = drops[i] * fontSize;

      // Tail gradient: draw from head down to tail
      for (let k = streamLengths[i]; k >= 0; k--) {
        const y = yHead - k * fontSize;
        if (y < 0) continue;
        
        const ch = randKatakana();
        
        if (k === 0) {
          // Head: bright white with glow
          ctx.fillStyle = "#fff";
          ctx.shadowBlur = 18;
          ctx.shadowColor = "rgba(180, 255, 180, 0.95)";
        } else {
          // Tail: dark green gradient fading to transparent
          const t = k / (streamLengths[i] + 1);
          const green = 50 + Math.floor(80 * (1 - t));
          const alpha = 0.3 + (1 - t) * 0.7;
          ctx.fillStyle = "rgba(0, " + green + ", 0, " + alpha + ")";
          ctx.shadowBlur = 8;
          ctx.shadowColor = "rgba(0, 150, 0, 0.8)";
        }
        
        ctx.font = fontSize + "px monospace";
        ctx.fillText(ch, x, y);
      }
    }

    // Update per-column speeds for variety
    for (let i = 0; i < columns; i++) {
      drops[i] += speeds[i] * 0.3;
      
      if (drops[i] * fontSize > window.innerHeight + 10) {
        // Reset column when it falls off screen
        drops[i] = Math.floor(Math.random() * -20);
        speeds[i] = 1 + Math.floor(Math.random() * 3);
        streamLengths[i] = 6 + Math.floor(Math.random() * 14);
      }
    }

    requestAnimationFrame(draw);
  }

  // Debounced resize handler
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  });

  // Init and start
  resize();
  requestAnimationFrame(draw);
})();
