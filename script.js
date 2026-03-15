// Smooth scrolling for navigation
document.querySelectorAll('.nav-link, .hero-actions a').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const rect = target.getBoundingClientRect();
        const offset = rect.top + window.scrollY - 80;
        window.scrollTo({
          top: offset < 0 ? 0 : offset,
          behavior: 'smooth',
        });
      }
      const navLinks = document.querySelector('.nav-links');
      navLinks?.classList.remove('open');
    }
  });
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll('main [id]');
const navItems = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  let current = '';
  const offset = 140;

  sections.forEach((section) => {
    const top = section.offsetTop - offset;
    if (window.scrollY >= top) {
      current = section.getAttribute('id') || '';
    }
  });

  if (!current) return;

  navItems.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href === `#${current}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

// Scroll reveal
const revealSections = document.querySelectorAll('[data-section]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealSections.forEach((section) => observer.observe(section));

// Subtle tilt effect for cards
function attachTiltEffect() {
  const tiltElements = document.querySelectorAll('[data-tilt]');

  tiltElements.forEach((el) => {
    const strength = 8;

    function handleMove(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateY = ((x - midX) / midX) * strength;
      const rotateX = ((midY - y) / midY) * strength;

      el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
        2
      )}deg) translateY(-2px)`;
    }

    function reset() {
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    }

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', reset);
  });
}

attachTiltEffect();

// Education timeline: switch detail panel when clicking a timeline card
(function initEducationTimeline() {
  const cards = document.querySelectorAll('.edu-timeline-card');
  const contents = document.querySelectorAll('.edu-detail-content');
  if (!cards.length || !contents.length) return;

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const index = card.getAttribute('data-edu-index');
      if (index == null) return;
      cards.forEach((c) => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
      contents.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      card.setAttribute('aria-pressed', 'true');
      const detail = document.querySelector(`.edu-detail-content[data-edu-index="${index}"]`);
      if (detail) detail.classList.add('active');
    });
  });
})();

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

// Neural network particle background
(function initNeuralBackground() {
  const canvas = document.getElementById('neural-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    createParticles();
  });

  const config = {
    nodeColor: '#FFFFFF',
    lineColor: '#CCCCCC',
    maxOpacity: 0.4,
    nodeCount: 70,
    maxDistance: 170,
  };

  let particles = [];

  function createParticles() {
    particles = [];
    const density = width < 768 ? 0.55 : 1;
    const count = Math.floor(config.nodeCount * density);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.3 + 0.4,
      });
    }
  }

  createParticles();

  let mouse = { x: width / 2, y: height / 3, active: false };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  function step() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw nodes
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const influenceRadius = 160;
        if (dist < influenceRadius) {
          const force = (influenceRadius - dist) / influenceRadius;
          p.vx += (dx / dist) * force * 0.02;
          p.vy += (dy / dist) * force * 0.02;
        }
      }

      ctx.beginPath();
      ctx.fillStyle = config.nodeColor;
      ctx.globalAlpha = config.maxOpacity;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;
        const maxDistSq = config.maxDistance * config.maxDistance;

        if (distSq < maxDistSq) {
          const ratio = 1 - distSq / maxDistSq;
          ctx.beginPath();
          ctx.strokeStyle = config.lineColor;
          ctx.globalAlpha = config.maxOpacity * ratio;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
})();

// Certificate modal interactions
(function initCertificateModal() {
  const modal = document.getElementById('cert-modal');
  const img = document.getElementById('cert-image');
  const closeBtn = document.getElementById('cert-close');
  const backdrop = modal ? modal.querySelector('.cert-modal-backdrop') : null;

  if (!modal || !img || !closeBtn || !backdrop) return;

  function openModal(src) {
    img.src = src;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    img.src = '';
  }

  document.querySelectorAll('.cert-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-cert-image');
      if (src) openModal(src);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
})();

