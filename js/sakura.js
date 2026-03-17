/**
 * Sakura Petals — Canvas animation
 * Simulates cherry blossom petals falling with realistic physics
 */
class SakuraCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.maxPetals = 60;
    this.mouse = { x: 0, y: 0 };
    this.animationId = null;

    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  createPetal() {
    const size = Math.random() * 12 + 6;
    return {
      x: Math.random() * this.width,
      y: -size * 2,
      size,
      speedY: Math.random() * 1.2 + 0.3,
      speedX: Math.random() * 0.8 - 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      oscillation: Math.random() * Math.PI * 2,
      oscillationSpeed: Math.random() * 0.02 + 0.01,
      oscillationDistance: Math.random() * 40 + 20,
      opacity: Math.random() * 0.5 + 0.3,
      color: this.getPetalColor(),
      scale: Math.random() * 0.5 + 0.5,
    };
  }

  getPetalColor() {
    const colors = [
      { r: 249, g: 168, b: 201 },  // sakura (rose clair doux)
      { r: 252, g: 212, b: 228 },  // sakura tres clair
      { r: 255, g: 220, b: 235 },  // rose pale
      { r: 248, g: 187, b: 208 },  // rose moyen doux
      { r: 255, g: 240, b: 245 },  // quasi blanc rose
      { r: 212, g: 175, b: 55 },   // gold (rare)
    ];
    const weights = [30, 25, 20, 15, 8, 2];
    const total = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    for (let i = 0; i < colors.length; i++) {
      rand -= weights[i];
      if (rand <= 0) return colors[i];
    }
    return colors[0];
  }

  init() {
    for (let i = 0; i < this.maxPetals / 3; i++) {
      const petal = this.createPetal();
      petal.y = Math.random() * this.height;
      this.petals.push(petal);
    }
  }

  drawPetal(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.scale(p.scale, p.scale);
    this.ctx.globalAlpha = p.opacity;

    // Petal shape (two bezier curves)
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.bezierCurveTo(
      p.size * 0.3, -p.size * 0.4,
      p.size * 0.7, -p.size * 0.5,
      p.size, 0
    );
    this.ctx.bezierCurveTo(
      p.size * 0.7, p.size * 0.5,
      p.size * 0.3, p.size * 0.4,
      0, 0
    );

    // Gradient fill
    const gradient = this.ctx.createRadialGradient(
      p.size * 0.4, 0, 0,
      p.size * 0.4, 0, p.size * 0.6
    );
    gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.9)`);
    gradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.3)`);

    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    // Subtle vein line
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(p.size * 0.8, 0);
    this.ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.15)`;
    this.ctx.lineWidth = 0.5;
    this.ctx.stroke();

    this.ctx.restore();
  }

  updatePetal(p) {
    // Gravity
    p.y += p.speedY;

    // Oscillation (wind sway)
    p.oscillation += p.oscillationSpeed;
    p.x += Math.sin(p.oscillation) * 0.5 + p.speedX;

    // Rotation
    p.rotation += p.rotationSpeed;

    // Mouse interaction — gentle repel
    const dx = p.x - this.mouse.x;
    const dy = p.y - this.mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      const force = (120 - dist) / 120 * 0.5;
      p.x += (dx / dist) * force;
      p.y += (dy / dist) * force;
      p.rotationSpeed += (Math.random() - 0.5) * 0.01;
    }

    // Remove and respawn if off screen
    if (p.y > this.height + 20 || p.x < -50 || p.x > this.width + 50) {
      Object.assign(p, this.createPetal());
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Gradually add petals
    if (this.petals.length < this.maxPetals && Math.random() < 0.1) {
      this.petals.push(this.createPetal());
    }

    this.petals.forEach(p => {
      this.updatePetal(p);
      this.drawPetal(p);
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    cancelAnimationFrame(this.animationId);
  }
}

// Auto-init when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new SakuraCanvas('sakura-canvas');
});
