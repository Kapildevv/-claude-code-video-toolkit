/* Claude Code Video Toolkit — script.js */

/* ─── CANVAS PARTICLE BACKGROUND ─── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], frames = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Particles
  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '99,102,241' : '14,165,233';
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  };

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  // Floating video-frame outlines
  function Frame() {
    this.reset();
  }
  Frame.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.w = Math.random() * 80 + 40;
    this.h = this.w * 0.5625;
    this.alpha = Math.random() * 0.06 + 0.02;
    this.vy = (Math.random() * 0.3 + 0.1) * (Math.random() > 0.5 ? 1 : -1);
    this.vx = (Math.random() - 0.5) * 0.2;
  };
  Frame.prototype.update = function () {
    this.y += this.vy;
    this.x += this.vx;
    if (this.y > H + 60) this.y = -60;
    if (this.y < -60) this.y = H + 60;
    if (this.x > W + 60) this.x = -60;
    if (this.x < -60) this.x = W + 60;
  };
  Frame.prototype.draw = function () {
    ctx.strokeStyle = `rgba(99,102,241,${this.alpha})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    // Play button inside
    ctx.beginPath();
    ctx.moveTo(this.x + this.w * 0.4, this.y + this.h * 0.3);
    ctx.lineTo(this.x + this.w * 0.65, this.y + this.h * 0.5);
    ctx.lineTo(this.x + this.w * 0.4, this.y + this.h * 0.7);
    ctx.closePath();
    ctx.fillStyle = `rgba(99,102,241,${this.alpha * 2})`;
    ctx.fill();
  };

  for (let i = 0; i < 12; i++) frames.push(new Frame());

  // Gradient orbs
  const orbs = [
    { x: 0.2, y: 0.3, r: 300, c: '99,102,241', a: 0.08 },
    { x: 0.8, y: 0.7, r: 250, c: '14,165,233', a: 0.06 },
    { x: 0.5, y: 0.1, r: 200, c: '139,92,246', a: 0.05 },
  ];

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Orbs
    orbs.forEach(o => {
      const grd = ctx.createRadialGradient(o.x * W, o.y * H, 0, o.x * W, o.y * H, o.r);
      grd.addColorStop(0, `rgba(${o.c},${o.a})`);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    });
    // Frames
    frames.forEach(f => { f.update(); f.draw(); });
    // Particles
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─── SCROLL REVEAL ─── */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => observer.observe(el));

/* ─── COPY TO CLIPBOARD ─── */
function copyCode(btn) {
  const pre = btn.closest('.code-block').querySelector('pre');
  navigator.clipboard.writeText(pre.innerText.trim()).then(() => {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  });
}

function copyInstall() {
  const cmd = 'git clone https://github.com/Kapildevv/-claude-code-video-toolkit.git';
  navigator.clipboard.writeText(cmd).then(() => {
    const btn = event.target;
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    setTimeout(() => btn.textContent = orig, 2000);
  });
}

/* ─── ACCORDION ─── */
function toggleAcc(trigger) {
  const body = trigger.nextElementSibling;
  const arrow = trigger.querySelector('.acc-arrow');
  const isOpen = body.classList.contains('open');
  // Close all
  document.querySelectorAll('.acc-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.acc-arrow').forEach(a => { a.textContent = '+'; a.style.transform = ''; });
  // Open clicked if was closed
  if (!isOpen) {
    body.classList.add('open');
    arrow.textContent = '−';
    arrow.style.transform = 'rotate(0deg)';
  }
}

/* ─── NAV ACTIVE LINK HIGHLIGHT ─── */
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--text)' : '';
  });
});

/* ─── 3D CARD TILT ─── */
document.querySelectorAll('.feat-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / rect.height) * 8;
    const rotY = (x / rect.width) * 8;
    card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
