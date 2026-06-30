import './styles.css';

const contactEmail = 'mirokejicompany@gmail.com';

const games = [
  {
    title: 'Chongbao Escape',
    name: '虫宝大逃亡',
    genre: '休闲闯关 / 轻度冒险',
    status: '重点作品',
    image: '/chongbao-dataowang.png',
    description: '可爱萌虫搭配经典华容道玩法，解压又治愈~'
  }
];

const gameGrid = document.querySelector('[data-game-grid]');
const yearTarget = document.querySelector('[data-year]');
const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const emailLink = document.querySelector('[data-email-link]');

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (emailLink) {
  emailLink.href = `mailto:${contactEmail}`;
  emailLink.textContent = contactEmail;
}

if (gameGrid) {
  games.forEach((game) => {
    const card = document.createElement('article');
    card.className = 'game-card reveal-item';
    card.innerHTML = `
      <div class="game-cover">
        <img src="${game.image}" alt="${game.name}" />
      </div>
      <div class="game-body">
        <div class="game-meta">
          <span>${game.status}</span>
          <span>${game.genre}</span>
        </div>
        <h3>${game.name}</h3>
        <p class="game-code">${game.title}</p>
        <p>${game.description}</p>
      </div>
    `;
    gameGrid.appendChild(card);
  });
}

window.addEventListener('scroll', () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 24);
}, { passive: true });

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.hidden = isOpen;
    document.body.classList.toggle('menu-open', !isOpen);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
      document.body.classList.remove('menu-open');
    });
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('.section, .reveal-item').forEach((item) => {
  revealObserver.observe(item);
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.querySelector('#signal-canvas');

if (canvas) {
  const ctx = canvas.getContext('2d');
  const pointer = { x: 0.5, y: 0.5, active: false };
  const palette = ['#00a1e9', '#ff4f54', '#6fd35f', '#ffb84d', '#9db6d4'];
  let particles = [];
  let width = 0;
  let height = 0;
  let frameId = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = width < 720 ? 36 : 72;
    particles = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      size: Math.random() * 1.8 + 0.7,
      color: palette[index % palette.length],
      pulse: Math.random() * Math.PI * 2
    }));
  };

  const drawBackground = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f7fbff';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(20, 55, 90, 0.055)';
    ctx.lineWidth = 1;

    const grid = width < 720 ? 42 : 56;
    for (let x = 0; x <= width; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const render = (time = 0) => {
    drawBackground();
    const pointerX = pointer.x * width;
    const pointerY = pointer.y * height;

    particles.forEach((particle, index) => {
      if (!prefersReducedMotion) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (pointer.active) {
          const dx = pointerX - particle.x;
          const dy = pointerY - particle.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance < 200) {
            particle.x -= (dx / distance) * 0.16;
            particle.y -= (dy / distance) * 0.16;
          }
        }

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;
      }

      for (let j = index + 1; j < particles.length; j += 1) {
        const other = particles[j];
        const dx = other.x - particle.x;
        const dy = other.y - particle.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 122) {
          ctx.globalAlpha = (1 - distance / 122) * 0.22;
          ctx.strokeStyle = particle.color;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 0.68 + Math.sin(time * 0.002 + particle.pulse) * 0.14;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    if (!prefersReducedMotion) {
      frameId = requestAnimationFrame(render);
    }
  };

  canvas.addEventListener('pointermove', (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width;
    pointer.y = (event.clientY - rect.top) / rect.height;
    pointer.active = true;
  });

  canvas.addEventListener('pointerleave', () => {
    pointer.active = false;
  });

  window.addEventListener('resize', () => {
    cancelAnimationFrame(frameId);
    resize();
    render();
  });

  resize();
  render();
}
