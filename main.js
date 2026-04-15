// main.js — Scrollytelling drone site
// Vanilla JS + GSAP, no framework

// ─── Use case card data ──────────────────────────────────────
const USE_CASES = [
  {
    title: 'Medical delivery',
    desc: 'Drones deliver insulin, blood, and vaccines to remote communities. Zipline operates in Rwanda and Ghana, cutting delivery time from hours to minutes.',
    icon: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="6" width="8" height="16" rx="3" fill="#FAF6F0"/>
      <rect x="12" y="12" width="20" height="8" rx="3" fill="#FAF6F0" opacity="0.6"/>
      <path d="M10 28c3.3-4 9.7-6 12-6s8.7 2 12 6" stroke="#FAF6F0" stroke-width="2" stroke-linecap="round"/>
      <circle cx="22" cy="36" r="3" fill="#FAF6F0"/>
    </svg>`
  },
  {
    title: 'Pipeline monitoring',
    desc: 'Autonomous underwater vehicles inspect thousands of miles of infrastructure. Earlier deployment could have flagged the Nord Stream anomalies before the 2022 sabotage.',
    icon: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 22h36" stroke="#FAF6F0" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M4 18h36" stroke="#FAF6F0" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
      <path d="M4 26h36" stroke="#FAF6F0" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
      <circle cx="22" cy="22" r="5" fill="#FAF6F0" opacity="0.9"/>
      <circle cx="22" cy="22" r="2" fill="#1B4F52"/>
    </svg>`
  },
  {
    title: 'Disaster response',
    desc: 'After earthquakes and floods, drones map damage and locate survivors in hours — reaching terrain no human team can safely access.',
    icon: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 6L38 38H6L22 6Z" stroke="#FAF6F0" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M22 18v10" stroke="#FAF6F0" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="22" cy="32" r="1.5" fill="#FAF6F0"/>
    </svg>`
  },
  {
    title: 'Environmental sensing',
    desc: 'LiDAR-equipped drones map coral reef die-off, track deforestation rates, and monitor air quality — data that changes environmental policy.',
    icon: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="22" cy="22" rx="17" ry="9" stroke="#FAF6F0" stroke-width="2.5"/>
      <path d="M5 22h34" stroke="#FAF6F0" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
      <path d="M12 14.5c2.5 3.5 5.5 7.5 10 7.5s7.5-4 10-7.5" stroke="#FAF6F0" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`
  }
];

// ─── Drone diagram components ────────────────────────────────
const DRONE_COMPONENTS = [
  {
    id: 'rotor-fl', cx: 108, cy: 80,
    label: 'Rotors',
    military: 'Precision strike positioning',
    civilian: 'Stable hover for delivery & photography',
    lx: 58, ly: 68, anchor: 'end'
  },
  {
    id: 'lidar', cx: 200, cy: 128,
    label: 'LiDAR sensor',
    military: 'Terrain mapping for targeting',
    civilian: 'Mapping coral reef die-off',
    lx: 215, ly: 118, anchor: 'start'
  },
  {
    id: 'fc', cx: 200, cy: 155,
    label: 'Flight controller',
    military: 'Autonomous strike coordination',
    civilian: 'Route planning, obstacle avoidance',
    lx: 215, ly: 155, anchor: 'start'
  },
  {
    id: 'camera', cx: 200, cy: 182,
    label: 'Camera / payload',
    military: 'Targeting camera, weapons bay',
    civilian: 'Search and rescue, crop mapping',
    lx: 215, ly: 190, anchor: 'start'
  },
  {
    id: 'imu', cx: 108, cy: 228,
    label: 'IMU',
    military: 'Inertial guidance for munitions',
    civilian: 'Stable flight in wind, precision landing',
    lx: 58, ly: 240, anchor: 'end'
  }
];

// ─── State ───────────────────────────────────────────────────
let currentSlide = 0;
let isAnimating = false;
const SLIDE_DURATION = 0.65;
const SCROLL_COOLDOWN = 850; // ms
let scrollLocked = false;

// ─── DOM ready ───────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots = [];

  // Initial slide visibility
  slides.forEach((slide, i) => {
    gsap.set(slide, { display: i === 0 ? 'flex' : 'none', yPercent: 0, opacity: 1 });
  });

  // ── Progress dots ────────────────────────────────────────
  const dotsNav = document.getElementById('progress-dots');
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    dotsNav.appendChild(btn);
    dots.push(btn);
  });

  function syncDots(idx) {
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    // Use dark dots on light-background slides
    const lightSlides = [2, 3, 4, 6]; // 0-indexed
    dotsNav.classList.toggle('on-light', lightSlides.includes(idx));
  }

  // ── Slide transition ─────────────────────────────────────
  function goTo(idx) {
    if (isAnimating || idx === currentSlide || idx < 0 || idx >= slides.length) return;
    isAnimating = true;
    const dir = idx > currentSlide ? 1 : -1;
    const leaving = slides[currentSlide];
    const entering = slides[idx];

    gsap.set(entering, { display: 'flex', yPercent: dir * 100, opacity: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(leaving, { display: 'none' });
        isAnimating = false;
        currentSlide = idx;
        syncDots(idx);
        animateContent(idx);
        if (idx === 3) animatePipeline(); // Slide 4
      }
    });

    tl.to(leaving,  { yPercent: dir * -100, opacity: 0, duration: SLIDE_DURATION, ease: 'power2.inOut' }, 0)
      .to(entering, { yPercent: 0,          opacity: 1, duration: SLIDE_DURATION, ease: 'power2.inOut' }, 0);
  }

  function animateContent(idx) {
    const slide = slides[idx];
    const els = slide.querySelectorAll(
      'h1, h2, .pull-quote, .attribution, .subtext, .big-thesis, ' +
      '.use-case-card, .cta-list li, .echobird-note, .stat, ' +
      '.apl-stat, .diagram-hint, .pipeline-caption, .echobird-author, .slide-subtitle, .scroll-hint'
    );
    if (!els.length) return;
    gsap.fromTo(els,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', delay: 0.1 }
    );
  }

  animateContent(0);

  // ── Input handlers ───────────────────────────────────────
  // Scroll wheel (debounced)
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (scrollLocked) return;
    scrollLocked = true;
    setTimeout(() => { scrollLocked = false; }, SCROLL_COOLDOWN);
    if (e.deltaY > 0) goTo(currentSlide + 1);
    else              goTo(currentSlide - 1);
  }, { passive: false });

  // Arrow & directional keys
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(currentSlide + 1);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(currentSlide - 1);
  });

  // Touch swipe
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchend', (e) => {
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 45) {
      if (diff > 0) goTo(currentSlide + 1);
      else          goTo(currentSlide - 1);
    }
  }, { passive: true });

  // ── Audio toggle ─────────────────────────────────────────
  const audio = document.getElementById('drone-audio');
  const audioBtn = document.getElementById('audio-toggle');
  let audioOn = false;
  audioBtn.textContent = '♪';
  audioBtn.addEventListener('click', () => {
    audioOn = !audioOn;
    audioBtn.classList.toggle('active', audioOn);
    audio.muted = !audioOn;
    if (audioOn) audio.play().catch(() => {});
    else         audio.pause();
  });

  // ── Build interactive elements ───────────────────────────
  buildUseCaseCards();
  buildDroneDiagram();
  buildPipelineFlow();
});

// ─── Use case cards ──────────────────────────────────────────
function buildUseCaseCards() {
  const container = document.querySelector('.use-cases');
  if (!container) return;
  USE_CASES.forEach(({ title, desc, icon }) => {
    const card = document.createElement('div');
    card.className = 'use-case-card';
    card.innerHTML = `<div class="card-icon">${icon}</div><h3>${title}</h3><p>${desc}</p>`;
    container.appendChild(card);
  });
}

// ─── Drone SVG diagram ───────────────────────────────────────
function buildDroneDiagram() {
  const container = document.getElementById('drone-diagram');
  if (!container) return;

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 400 310');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Top-down diagram of a quadcopter drone with labeled components');
  svg.style.width = '100%';
  svg.style.height = '100%';

  const mk = (tag, attrs) => {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  };

  // Arms
  const armPositions = [[200,155,108,80],[200,155,292,80],[200,155,108,228],[200,155,292,228]];
  armPositions.forEach(([x1,y1,x2,y2]) => {
    svg.appendChild(mk('line', { x1, y1, x2, y2, stroke: '#1B4F52', 'stroke-width': 6, 'stroke-linecap': 'round' }));
  });

  // Body
  svg.appendChild(mk('rect', { x: 167, y: 122, width: 66, height: 66, rx: 8, fill: '#1B4F52' }));

  // Rotors
  [[108,80],[292,80],[108,228],[292,228]].forEach(([cx,cy]) => {
    svg.appendChild(mk('circle', { cx, cy, r: 30, fill: 'none', stroke: '#5BA8A0', 'stroke-width': 2.5 }));
    svg.appendChild(mk('line',   { x1: cx-22, y1: cy, x2: cx+22, y2: cy, stroke: '#5BA8A0', 'stroke-width': 4.5, 'stroke-linecap': 'round' }));
    svg.appendChild(mk('line',   { x1: cx, y1: cy-22, x2: cx, y2: cy+22, stroke: '#5BA8A0', 'stroke-width': 4.5, 'stroke-linecap': 'round' }));
  });

  // Tooltip reference
  const tooltip = document.getElementById('drone-tooltip');
  const ttLabel = tooltip.querySelector('.tt-label');
  const ttMil   = tooltip.querySelector('.tt-military');
  const ttCiv   = tooltip.querySelector('.tt-civilian');

  // Component dots + labels
  DRONE_COMPONENTS.forEach(({ id, cx, cy, label, military, civilian, lx, ly, anchor }) => {
    // Leader line from label to dot
    const line = mk('line', {
      x1: lx, y1: ly - 4, x2: cx, y2: cy,
      stroke: '#D4705A', 'stroke-width': 1, 'stroke-dasharray': '3 3', opacity: 0.6
    });
    svg.appendChild(line);

    // Label text
    const text = mk('text', {
      x: lx, y: ly,
      'text-anchor': anchor,
      'font-size': 11, 'font-family': 'Inter, sans-serif',
      fill: '#1B4F52', 'font-weight': '600'
    });
    text.textContent = label;
    svg.appendChild(text);

    // Dot
    const dot = mk('circle', {
      id, cx, cy, r: 6,
      fill: '#D4705A', class: 'component-dot'
    });

    dot.addEventListener('mouseenter', (e) => {
      ttLabel.textContent = label;
      ttMil.textContent   = military;
      ttCiv.textContent   = civilian;
      tooltip.classList.add('visible');
      positionTooltip(e.clientX, e.clientY);
    });
    dot.addEventListener('mousemove', (e) => positionTooltip(e.clientX, e.clientY));
    dot.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));

    svg.appendChild(dot);
  });

  container.appendChild(svg);
}

function positionTooltip(x, y) {
  const tooltip = document.getElementById('drone-tooltip');
  const pad = 16;
  let left = x + pad;
  let top  = y - 10;
  // Keep within viewport
  const tw = tooltip.offsetWidth || 220;
  const th = tooltip.offsetHeight || 90;
  if (left + tw > window.innerWidth  - 8) left = x - tw - pad;
  if (top  + th > window.innerHeight - 8) top  = y - th - pad;
  tooltip.style.left = left + 'px';
  tooltip.style.top  = top  + 'px';
}

// ─── Pipeline SVG ────────────────────────────────────────────
function buildPipelineFlow() {
  const container = document.getElementById('pipeline-flow');
  if (!container) return;

  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs) => {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k, v));
    return el;
  };

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 640 140');
  svg.style.width  = '100%';
  svg.style.height = '100%';

  // Arrowhead marker
  const defs = document.createElementNS(NS, 'defs');
  const marker = document.createElementNS(NS, 'marker');
  Object.assign(marker, {});
  marker.setAttribute('id', 'pipe-arrow');
  marker.setAttribute('markerWidth',  '10');
  marker.setAttribute('markerHeight', '7');
  marker.setAttribute('refX', '9');
  marker.setAttribute('refY', '3.5');
  marker.setAttribute('orient', 'auto');
  const arrowPoly = mk('polygon', { points: '0 0, 10 3.5, 0 7', fill: '#D4705A' });
  marker.appendChild(arrowPoly);
  defs.appendChild(marker);
  svg.appendChild(defs);

  const nodes = [
    { label: 'Hopkins\nEE / MechE / CS', x: 100, fill: '#1B4F52' },
    { label: 'JHU APL',                  x: 320, fill: '#8B2E2E' },
    { label: 'Lockheed · Raytheon\nNorthrop Grumman', x: 540, fill: '#1A1A18' },
  ];

  // Arrows (will be animated)
  [[nodes[0].x + 70, nodes[1].x - 70], [nodes[1].x + 70, nodes[2].x - 70]].forEach(([x1, x2]) => {
    const path = mk('path', {
      d: `M ${x1} 70 C ${x1+30} 70, ${x2-30} 70, ${x2} 70`,
      stroke: '#D4705A', 'stroke-width': 2.5, fill: 'none',
      'marker-end': 'url(#pipe-arrow)',
      'stroke-dasharray': 180, 'stroke-dashoffset': 180,
      class: 'pipeline-arrow'
    });
    svg.appendChild(path);
  });

  // Node boxes
  nodes.forEach(({ label, x, fill }) => {
    svg.appendChild(mk('rect', { x: x-70, y: 40, width: 140, height: 60, rx: 8, fill }));
    label.split('\n').forEach((line, li) => {
      const text = document.createElementNS(NS, 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', 66 + li * 18);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '13');
      text.setAttribute('font-family', 'Inter, sans-serif');
      text.setAttribute('fill', '#FAF6F0');
      text.setAttribute('font-weight', '600');
      text.textContent = line;
      svg.appendChild(text);
    });
  });

  container.appendChild(svg);
}

function animatePipeline() {
  document.querySelectorAll('.pipeline-arrow').forEach((arrow, i) => {
    gsap.to(arrow, {
      strokeDashoffset: 0,
      duration: 1.1,
      delay: i * 0.55,
      ease: 'power2.inOut'
    });
  });
}
