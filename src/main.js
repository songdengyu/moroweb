import './styles.css';

const contactEmail = 'business@miro-game.com';

const games = [
  {
    title: 'Project Starforge',
    name: '星铸远征',
    genre: '轻度策略 / Roguelike',
    status: '研发中',
    theme: 'solar',
    description: '面向碎片化时间的星际探索项目，强调随机事件、成长构筑与短局成就感。'
  },
  {
    title: 'Project Pulse',
    name: '节奏工坊',
    genre: '休闲竞技 / 音游派对',
    status: '测试中',
    theme: 'pulse',
    description: '以节奏反馈和多人互动为核心，适合社交传播、活动运营和直播内容。'
  },
  {
    title: 'Project Mirage',
    name: '幻境档案',
    genre: '互动叙事 / 解谜',
    status: '概念验证',
    theme: 'mirage',
    description: '通过轻量剧情、场景探索和选择分支，构建适合长期更新的故事宇宙。'
  }
];

const gameGrid = document.querySelector('[data-game-grid]');
const yearTarget = document.querySelector('[data-year]');
const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const contactForm = document.querySelector('[data-contact-form]');
const formNote = document.querySelector('[data-form-note]');
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
    card.className = `game-card theme-${game.theme} reveal-item`;
    card.innerHTML = `
      <div class="game-cover" aria-hidden="true">
        <span class="cover-lane lane-a"></span>
        <span class="cover-lane lane-b"></span>
        <span class="cover-node node-a"></span>
        <span class="cover-node node-b"></span>
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

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get('name')?.toString().trim() || '未填写';
    const email = data.get('email')?.toString().trim() || '未填写';
    const topic = data.get('topic')?.toString().trim() || '合作沟通';
    const message = data.get('message')?.toString().trim() || '您好，我想了解合作事宜。';
    const subject = encodeURIComponent(`[官网咨询] ${topic} - ${name}`);
    const body = encodeURIComponent(`姓名：${name}\n邮箱：${email}\n合作类型：${topic}\n\n留言：\n${message}`);

    if (formNote) {
      formNote.textContent = '正在打开邮件客户端，请确认收件人与内容后发送。';
    }

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
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
  const palette = ['#00a1e9', '#ff4f54', '#b9f24b', '#ffbf4b', '#ffffff'];
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

    const count = width < 720 ? 46 : 88;
    particles = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.42,
      vy: (Math.random() - 0.5) * 0.42,
      size: Math.random() * 1.9 + 0.7,
      color: palette[index % palette.length],
      pulse: Math.random() * Math.PI * 2
    }));
  };

  const drawBackground = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#07080c';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
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
          if (distance < 220) {
            particle.x -= (dx / distance) * 0.2;
            particle.y -= (dy / distance) * 0.2;
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
        if (distance < 132) {
          ctx.globalAlpha = (1 - distance / 132) * 0.32;
          ctx.strokeStyle = particle.color;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 0.75 + Math.sin(time * 0.002 + particle.pulse) * 0.18;
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
