// main.js — Scrollytelling site
// Vanilla JS + GSAP, no framework

// ─── Legislation button click-to-lock ────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.leg-btn-wrap').forEach(wrap => {
    wrap.addEventListener('click', e => {
      if (e.target.closest('.leg-popup-cite')) return;
      const isOpen = wrap.classList.contains('locked');
      document.querySelectorAll('.leg-btn-wrap.locked').forEach(w => w.classList.remove('locked'));
      if (!isOpen) wrap.classList.add('locked');
      e.stopPropagation();
    });
  });
  document.addEventListener('click', e => {
    if (e.target.closest('.leg-popup-cite')) return;
    document.querySelectorAll('.leg-btn-wrap.locked').forEach(w => w.classList.remove('locked'));
  });
});

// ─── Use case card data ──────────────────────────────────────
const USE_CASES = [
  {
    title: 'Medical delivery',
    desc: 'Drones deliver insulin, blood, and vaccines to remote communities. Zipline operates in Rwanda and Ghana, cutting delivery time from hours to minutes.',
    icon: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="6" width="8" height="16" rx="3" fill="#DFE2CF"/>
      <rect x="12" y="12" width="20" height="8" rx="3" fill="#DFE2CF" opacity="0.6"/>
      <path d="M10 28c3.3-4 9.7-6 12-6s8.7 2 12 6" stroke="#DFE2CF" stroke-width="2" stroke-linecap="round"/>
      <circle cx="22" cy="36" r="3" fill="#DFE2CF"/>
    </svg>`
  },
  {
    title: 'Pipeline monitoring',
    desc: 'Autonomous underwater vehicles inspect thousands of miles of infrastructure. Earlier deployment could have flagged the Nord Stream anomalies before the 2022 sabotage.',
    icon: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 22h36" stroke="#DFE2CF" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M4 18h36" stroke="#DFE2CF" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
      <path d="M4 26h36" stroke="#DFE2CF" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
      <circle cx="22" cy="22" r="5" fill="#DFE2CF" opacity="0.9"/>
      <circle cx="22" cy="22" r="2" fill="#4A5043"/>
    </svg>`
  },
  {
    title: 'Disaster response',
    desc: 'After earthquakes and floods, drones map damage and locate survivors in hours — reaching terrain no human team can safely access.',
    icon: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 6L38 38H6L22 6Z" stroke="#DFE2CF" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M22 18v10" stroke="#DFE2CF" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="22" cy="32" r="1.5" fill="#DFE2CF"/>
    </svg>`
  },
  {
    title: 'Environmental sensing',
    desc: 'LiDAR-equipped drones map coral reef die-off, track deforestation rates, and monitor air quality — data that changes environmental policy.',
    icon: `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="22" cy="22" rx="17" ry="9" stroke="#DFE2CF" stroke-width="2.5"/>
      <path d="M5 22h34" stroke="#DFE2CF" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
      <path d="M12 14.5c2.5 3.5 5.5 7.5 10 7.5s7.5-4 10-7.5" stroke="#DFE2CF" stroke-width="1.5" stroke-linecap="round"/>
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

// ─── Continent outlines (simplified, [lon, lat] pairs) ──────
const CONTINENT_DATA = [
  // North America
  [[-168,71],[-140,60],[-130,54],[-124,48],[-117,32],[-110,23],
   [-85,10],[-77,8],[-82,27],[-80,25],[-80,32],[-75,35],[-76,38],
   [-70,43],[-66,44],[-60,47],[-53,47],[-56,52],[-64,63],
   [-80,62],[-95,60],[-120,60],[-138,60],[-160,60],[-168,71]],
  // South America
  [[-75,12],[-60,12],[-50,0],[-35,-5],[-35,-10],[-40,-20],
   [-48,-28],[-53,-33],[-65,-55],[-70,-50],[-72,-42],
   [-70,-30],[-72,-18],[-75,0],[-75,12]],
  // Europe
  [[-10,36],[0,43],[5,44],[8,46],[10,54],[12,56],[18,60],
   [25,65],[28,71],[18,70],[8,62],[5,58],[-3,54],[-5,43],
   [-9,39],[-10,36]],
  // Africa (full coastline including sub-Saharan cone)
  [[-5,35],[-13,33],[-17,21],[-18,16],[-17,10],[-15,5],
   [-8,5],[0,5],[10,5],[9,2],[10,-5],[12,-18],
   [16,-29],[18,-28],[27,-34],[33,-35],
   [36,-25],[40,-10],[40,10],[45,12],[42,20],[37,22],
   [32,30],[32,37],[25,37],[10,37],[5,36],[-5,35]],
  // Asia (mainland — without India, which is separate)
  [[30,70],[60,75],[100,72],[140,68],[170,63],[180,58],
   [170,50],[145,45],[130,35],[120,30],[110,18],[100,5],
   [105,-2],[115,-7],[120,12],[116,22],[110,22],[95,25],
   [90,28],[88,26],[97,28],[93,22],[83,12],[78,8],
   [72,18],[68,23],[60,25],[50,25],[43,15],[40,12],
   [37,22],[32,37],[36,42],[42,42],[60,55],[80,60],[100,72]],
  // India peninsula
  [[68,23],[72,22],[77,28],[84,28],[88,26],[97,28],
   [93,22],[83,12],[78,8],[72,18],[68,23]],
  // Japan — Honshu (main island)
  [[131,34],[132,35],[134,36],[136,37],[138,39],[140,40],
   [141,41],[142,40],[141,38],[140,36],[138,35],[136,34],
   [134,34],[131,34]],
  // Japan — Hokkaido
  [[141,42],[143,44],[145,43],[144,42],[141,42]],
  // Japan — Kyushu
  [[129,32],[131,34],[132,33],[130,31],[129,32]],
  // Australia
  [[115,-22],[120,-18],[128,-14],[135,-12],[140,-17],
   [148,-20],[152,-25],[154,-28],[150,-36],[144,-38],
   [135,-36],[129,-33],[117,-35],[115,-28],[115,-22]],
  // Greenland
  [[-45,60],[-20,60],[-15,70],[-25,75],[-45,83],
   [-65,83],[-70,75],[-55,65],[-45,60]],
];

// ─── Globe data (slide 7, index 6) ──────────────────────────
const GLOBE_PLATES = [
  {
    lat: 36, lon: 138,
    region: 'Japan', food: 'Bento',
    emoji: '🍱', color: '#c2614f',
    thesis: 'A meal is a way to slow down during or after a hectic day, to savor flavors and company. The Japanese bento box embodies this philosophy by turning a simple meal into a mindful experience.'
  },
  {
    lat: 20, lon: 78,
    region: 'India', food: 'Thali',
    emoji: '🍽️', color: '#c27a2e',
    thesis: 'A meal is a way to connect with your culture and heritage. The Indian thali, with its variety of dishes served together, reflects the diversity and richness of Indian cuisine and culture.'
  },
  {
    lat: 23, lon: -100,
    region: 'Mexico', food: 'Mole & Tortilla',
    emoji: '🌮', color: '#5a9e62',
    thesis: 'A meal is a way to preserve history. The Mexican mole sauce, with its complex blend of indigenous and Spanish ingredients, tells the story of centuries of cultural fusion and resilience.'
  },
  {
    lat: 9, lon: 40,
    region: 'Ethiopia', food: 'Injera & Wat',
    emoji: '🫓', color: '#8b5e3c',
    thesis: 'A meal is a way to bring people together. The Ethiopian injera and wat, traditionally eaten communally, foster a sense of unity and shared experience among diners.'
  },
  {
    lat: 42, lon: 13,
    region: 'Italy', food: 'Pasta al Ragù',
    emoji: '🍝', color: '#b84a4a',
    thesis: 'A meal is a way to celebrate life. The Italian pasta al ragù, with its rich tomato-based sauce and tender meat, represents joy and warmth.'
  }
];

// Target rotation per step (brings that region's longitude to the front)
// rot → (lon + rot) ≈ 0 so that point faces the viewer
const GLOBE_TARGET_ROTATIONS = [20, -130, -72, 105, -35, -10];
// Index 0 = idle (mid-Atlantic); 1–5 = each plate

// ─── State ───────────────────────────────────────────────────
let currentSlide  = 0;
let isAnimating   = false;
const SLIDE_DURATION  = 0.65;
const SCROLL_COOLDOWN = 850; // ms
let scrollLocked  = false;

// Globe state
let globeRotation  = GLOBE_TARGET_ROTATIONS[0];
let globeTargetRot = GLOBE_TARGET_ROTATIONS[0];
let globeStep      = 0;
const GLOBE_STEPS  = GLOBE_PLATES.length; // 5
let globeRAF       = null;
let globeCanvas    = null;
let globeCtx       = null;
let globeSize      = 400;

// ─── DOM ready ───────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots   = [];

  // Initial slide visibility
  slides.forEach((slide, i) => {
    gsap.set(slide, { display: i === 0 ? 'flex' : 'none', yPercent: 0, opacity: 1 });
  });

  // ── Progress dots ─────────────────────────────────────────
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
    // Dark dots on cream/blush slides (0-indexed):
    // 2 = slide-3 (cream), 4 = slide-4 (blush-sand), 6 = slide-5 (cream), 7 = slide-7 (blush-sand)
    const lightSlides = [2, 4, 6, 7];
    dotsNav.classList.toggle('on-light', lightSlides.includes(idx));
  }

  // ── Slide transition ──────────────────────────────────────
  function goTo(idx) {
    if (isAnimating || idx === currentSlide || idx < 0 || idx >= slides.length) return;
    isAnimating = true;
    const dir      = idx > currentSlide ? 1 : -1;
    const leaving  = slides[currentSlide];
    const entering = slides[idx];
    const prevIdx  = currentSlide;

    gsap.set(entering, { display: 'flex', yPercent: dir * 100, opacity: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(leaving, { display: 'none' });
        isAnimating   = false;
        currentSlide  = idx;
        syncDots(idx);
        animateContent(idx);
        if (idx === 4) animatePipeline(); // Slide 5 (0-indexed 4)

        // Globe slide is index 6
        if (prevIdx === 5) stopGlobeLoop();
        if (idx === 5)     { initGlobe(); startGlobeLoop(); }
      }
    });

    tl.to(leaving,  { yPercent: dir * -100, opacity: 0, duration: SLIDE_DURATION, ease: 'power2.inOut' }, 0)
      .to(entering, { yPercent: 0,          opacity: 1, duration: SLIDE_DURATION, ease: 'power2.inOut' }, 0);
  }

  // Expose goTo so globe scroll handler (defined later) can call it
  window._goTo = goTo;

  function animateContent(idx) {
    const slide = slides[idx];
    const els = slide.querySelectorAll(
      'h1, h2, .pull-quote, .attribution, .subtext, .big-thesis, ' +
      '.use-case-card, .cta-list li, .echobird-note, .stat, ' +
      '.apl-stat, .diagram-hint, .pipeline-caption, .echobird-author, ' +
      '.slide-subtitle, .scroll-hint, .globe-hint'
    );
    if (!els.length) return;
    gsap.fromTo(els,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', delay: 0.1 }
    );
  }

  animateContent(0);

  // ── Input handlers ────────────────────────────────────────
  // Wheel
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (scrollLocked) return;
    scrollLocked = true;
    setTimeout(() => { scrollLocked = false; }, SCROLL_COOLDOWN);

    const dir = e.deltaY > 0 ? 1 : -1;

    // Globe slide (index 5) intercepts scroll to spin the globe
    if (currentSlide === 5) {
      const next = globeStep + dir;
      if (next >= 0 && next <= GLOBE_STEPS) {
        advanceGlobe(next);
        return;
      }
      // Exhausted globe steps — fall through to navigate
    }

    if (e.deltaY > 0) goTo(currentSlide + 1);
    else              goTo(currentSlide - 1);
  }, { passive: false });

  // Arrow keys
  document.addEventListener('keydown', (e) => {
    const fwd = e.key === 'ArrowRight' || e.key === 'ArrowDown';
    const bwd = e.key === 'ArrowLeft'  || e.key === 'ArrowUp';
    if (!fwd && !bwd) return;
    const dir = fwd ? 1 : -1;

    if (currentSlide === 5) {
      const next = globeStep + dir;
      if (next >= 0 && next <= GLOBE_STEPS) { advanceGlobe(next); return; }
    }

    if (fwd) goTo(currentSlide + 1);
    if (bwd) goTo(currentSlide - 1);
  });

  // Touch swipe
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchend', (e) => {
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) < 45) return;
    const dir = diff > 0 ? 1 : -1;

    if (currentSlide === 5) {
      const next = globeStep + dir;
      if (next >= 0 && next <= GLOBE_STEPS) { advanceGlobe(next); return; }
    }

    if (diff > 0) goTo(currentSlide + 1);
    else          goTo(currentSlide - 1);
  }, { passive: true });

  // ── Build interactive elements ────────────────────────────
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

  const NS  = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 400 310');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Top-down diagram of a quadcopter drone with labeled components');
  svg.style.width  = '100%';
  svg.style.height = '100%';

  const mk = (tag, attrs) => {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  };

  // Arms
  [[200,155,108,80],[200,155,292,80],[200,155,108,228],[200,155,292,228]].forEach(([x1,y1,x2,y2]) => {
    svg.appendChild(mk('line', { x1, y1, x2, y2, stroke: '#4A5043', 'stroke-width': 6, 'stroke-linecap': 'round' }));
  });

  // Body
  svg.appendChild(mk('rect', { x: 167, y: 122, width: 66, height: 66, rx: 8, fill: '#4A5043' }));

  // Rotors
  [[108,80],[292,80],[108,228],[292,228]].forEach(([cx,cy]) => {
    svg.appendChild(mk('circle', { cx, cy, r: 30, fill: 'none', stroke: '#9BA694', 'stroke-width': 2.5 }));
    svg.appendChild(mk('line',   { x1: cx-22, y1: cy, x2: cx+22, y2: cy, stroke: '#9BA694', 'stroke-width': 4.5, 'stroke-linecap': 'round' }));
    svg.appendChild(mk('line',   { x1: cx, y1: cy-22, x2: cx, y2: cy+22, stroke: '#9BA694', 'stroke-width': 4.5, 'stroke-linecap': 'round' }));
  });

  const tooltip  = document.getElementById('drone-tooltip');
  const ttLabel  = tooltip.querySelector('.tt-label');
  const ttMil    = tooltip.querySelector('.tt-military');
  const ttCiv    = tooltip.querySelector('.tt-civilian');

  DRONE_COMPONENTS.forEach(({ id, cx, cy, label, military, civilian, lx, ly, anchor }) => {
    svg.appendChild(mk('line', {
      x1: lx, y1: ly - 4, x2: cx, y2: cy,
      stroke: '#E2856E', 'stroke-width': 1, 'stroke-dasharray': '3 3', opacity: 0.6
    }));

    const text = mk('text', {
      x: lx, y: ly,
      'text-anchor': anchor,
      'font-size': 11, 'font-family': 'Inter, sans-serif',
      fill: '#4A5043', 'font-weight': '600'
    });
    text.textContent = label;
    svg.appendChild(text);

    const dot = mk('circle', { id, cx, cy, r: 6, fill: '#E2856E', class: 'component-dot' });
    dot.addEventListener('mouseenter', (e) => {
      ttLabel.textContent = label;
      ttMil.textContent   = military;
      ttCiv.textContent   = civilian;
      tooltip.classList.add('visible');
      positionTooltip(e.clientX, e.clientY);
    });
    dot.addEventListener('mousemove',  (e) => positionTooltip(e.clientX, e.clientY));
    dot.addEventListener('mouseleave', ()  => tooltip.classList.remove('visible'));
    svg.appendChild(dot);
  });

  container.appendChild(svg);
}

function positionTooltip(x, y) {
  const tooltip = document.getElementById('drone-tooltip');
  const pad = 16;
  let left = x + pad;
  let top  = y - 10;
  const tw = tooltip.offsetWidth  || 220;
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

  const NS  = 'http://www.w3.org/2000/svg';
  const mk  = (tag, attrs) => {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k, v));
    return el;
  };

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 640 140');
  svg.style.width  = '100%';
  svg.style.height = '100%';

  const defs   = document.createElementNS(NS, 'defs');
  const marker = document.createElementNS(NS, 'marker');
  marker.setAttribute('id',           'pipe-arrow');
  marker.setAttribute('markerWidth',  '10');
  marker.setAttribute('markerHeight', '7');
  marker.setAttribute('refX',         '9');
  marker.setAttribute('refY',         '3.5');
  marker.setAttribute('orient',       'auto');
  marker.appendChild(mk('polygon', { points: '0 0, 10 3.5, 0 7', fill: '#E2856E' }));
  defs.appendChild(marker);
  svg.appendChild(defs);

  const nodes = [
    { label: 'Hopkins\nEE / MechE / CS', x: 100,  fill: '#4A5043' },
    { label: 'JHU APL',                  x: 320,  fill: '#140D4F' },
    { label: 'Lockheed · Raytheon\nNorthrop Grumman', x: 540, fill: '#2A2C24' },
  ];

  [[nodes[0].x + 70, nodes[1].x - 70], [nodes[1].x + 70, nodes[2].x - 70]].forEach(([x1, x2]) => {
    svg.appendChild(mk('path', {
      d: `M ${x1} 70 C ${x1+30} 70, ${x2-30} 70, ${x2} 70`,
      stroke: '#E2856E', 'stroke-width': 2.5, fill: 'none',
      'marker-end': 'url(#pipe-arrow)',
      'stroke-dasharray': 180, 'stroke-dashoffset': 180,
      class: 'pipeline-arrow'
    }));
  });

  nodes.forEach(({ label, x, fill }) => {
    svg.appendChild(mk('rect', { x: x-70, y: 40, width: 140, height: 60, rx: 8, fill }));
    label.split('\n').forEach((line, li) => {
      const text = document.createElementNS(NS, 'text');
      text.setAttribute('x',           x);
      text.setAttribute('y',           66 + li * 18);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size',   '13');
      text.setAttribute('font-family', 'Inter, sans-serif');
      text.setAttribute('fill',        '#DFE2CF');
      text.setAttribute('font-weight', '600');
      text.textContent = line;
      svg.appendChild(text);
    });
  });

  container.appendChild(svg);
}

function animatePipeline() {
  document.querySelectorAll('.pipeline-arrow').forEach((arrow, i) => {
    gsap.to(arrow, { strokeDashoffset: 0, duration: 1.1, delay: i * 0.55, ease: 'power2.inOut' });
  });
}

// ─── Globe: init & canvas setup ──────────────────────────────
function initGlobe() {
  globeCanvas = document.getElementById('globe-canvas');
  if (!globeCanvas) return;

  const DPR  = window.devicePixelRatio || 1;
  const stage = globeCanvas.parentElement;
  globeSize   = Math.min(stage.offsetWidth, stage.offsetHeight, 400);

  globeCanvas.width        = globeSize * DPR;
  globeCanvas.height       = globeSize * DPR;
  globeCanvas.style.width  = globeSize + 'px';
  globeCanvas.style.height = globeSize + 'px';

  globeCtx = globeCanvas.getContext('2d');
  globeCtx.scale(DPR, DPR);

  buildGlobePins();
}

function buildGlobePins() {
  const container = document.getElementById('globe-pins');
  if (!container) return;
  container.innerHTML = '';

  GLOBE_PLATES.forEach((plate, i) => {
    const pin = document.createElement('div');
    pin.className   = 'globe-pin';
    pin.dataset.idx = i;
    pin.innerHTML   = `
      <div class="globe-pin-plate">
        <div class="globe-pin-img-ph" style="background:${plate.color}">${plate.emoji}</div>
        <div class="globe-pin-line"></div>
        <span class="globe-pin-label">${plate.region}</span>
      </div>
      <div class="globe-pin-dot"></div>
    `;
    container.appendChild(pin);
  });
}

// ─── Globe: draw ─────────────────────────────────────────────
function drawGlobeFrame(rot) {
  if (!globeCtx) return;
  const S   = globeSize;
  const cx  = S / 2, cy = S / 2;
  const R   = S * 0.455;
  const ctx = globeCtx;

  ctx.clearRect(0, 0, S, S);

  // Ocean sphere gradient
  const oceanGrad = ctx.createRadialGradient(cx - R*0.3, cy - R*0.35, 0, cx, cy, R);
  oceanGrad.addColorStop(0,   '#3a3870');
  oceanGrad.addColorStop(0.4, '#1e1a60');
  oceanGrad.addColorStop(0.8, '#140D4F');
  oceanGrad.addColorStop(1,   '#080630');
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI*2);
  ctx.fillStyle = oceanGrad;
  ctx.fill();

  // Continent land masses
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.clip(); // keep everything inside the sphere

  for (const polygon of CONTINENT_DATA) {
    // Project each vertex; collect contiguous front-face runs
    const projected = polygon.map(([lon, lat]) => {
      const phi    = lat * Math.PI / 180;
      const lambda = ((lon + rot) % 360) * Math.PI / 180;
      const depth  = Math.cos(phi) * Math.cos(lambda);
      const x      = cx + R * Math.cos(phi) * Math.sin(lambda);
      const y      = cy - R * Math.sin(phi);
      return { x, y, depth };
    });

    // Gather contiguous visible segments, then fill each as a closed shape
    let seg = [];
    const flush = () => {
      if (seg.length < 2) { seg = []; return; }
      ctx.beginPath();
      ctx.moveTo(seg[0].x, seg[0].y);
      for (let i = 1; i < seg.length; i++) ctx.lineTo(seg[i].x, seg[i].y);
      ctx.closePath();
      ctx.fillStyle   = 'rgba(74, 80, 67, 0.85)';
      ctx.strokeStyle = 'rgba(155, 166, 148, 0.55)';
      ctx.lineWidth   = 0.7;
      ctx.fill();
      ctx.stroke();
      seg = [];
    };

    // Walk the polygon (wrap last→first to close the outline)
    for (let i = 0; i <= projected.length; i++) {
      const pt = projected[i % projected.length];
      if (pt.depth > 0) {
        seg.push(pt);
      } else {
        flush();
      }
    }
    flush();
  }
  ctx.restore();

  // Latitude grid lines (parallels — drawn as ellipses)
  ctx.lineWidth = 0.6;
  for (let lat = -75; lat <= 75; lat += 15) {
    const phi = lat * Math.PI / 180;
    const y   = cy - R * Math.sin(phi);
    const rx  = R  * Math.cos(phi);
    const ry  = rx * 0.28; // perspective squish
    if (rx < 2) continue;
    ctx.strokeStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath();
    ctx.ellipse(cx, y, rx, ry, 0, 0, Math.PI*2);
    ctx.stroke();
  }

  // Longitude grid lines (meridians — drawn parametrically)
  for (let lon = 0; lon < 360; lon += 20) {
    const lambda = ((lon + rot) % 360) * Math.PI / 180;
    const cosL   = Math.cos(lambda);
    ctx.strokeStyle = cosL > 0 ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.03)';
    ctx.lineWidth   = 0.6;
    ctx.beginPath();
    let first = true;
    for (let lat = -90; lat <= 90; lat += 4) {
      const phi = lat * Math.PI / 180;
      const x   = cx + R * Math.cos(phi) * Math.sin(lambda);
      const y   = cy - R * Math.sin(phi);
      if (first) { ctx.moveTo(x, y); first = false; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Rim vignette
  const rimGrad = ctx.createRadialGradient(cx, cy, R*0.65, cx, cy, R);
  rimGrad.addColorStop(0, 'transparent');
  rimGrad.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI*2);
  ctx.fillStyle = rimGrad;
  ctx.fill();

  // Specular highlight (top-left)
  const specGrad = ctx.createRadialGradient(cx - R*0.33, cy - R*0.33, 0, cx - R*0.33, cy - R*0.33, R*0.55);
  specGrad.addColorStop(0, 'rgba(255,255,255,0.14)');
  specGrad.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI*2);
  ctx.fillStyle = specGrad;
  ctx.fill();
}

// ─── Globe: pin positions ─────────────────────────────────────
function updateGlobePins(rot) {
  const container = document.getElementById('globe-pins');
  if (!container) return;
  const S   = globeSize;
  const cx  = S / 2, cy = S / 2;
  const R   = S * 0.455;
  const activeIdx = globeStep - 1;

  container.querySelectorAll('.globe-pin').forEach((pin, i) => {
    const { lat, lon } = GLOBE_PLATES[i];
    const phi    = lat * Math.PI / 180;
    const lambda = ((lon + rot) % 360) * Math.PI / 180;
    const x      = cx + R * Math.cos(phi) * Math.sin(lambda);
    const y      = cy - R * Math.sin(phi);
    const depth  = Math.cos(phi) * Math.cos(lambda); // >0 = front hemisphere

    pin.style.left = (x / S * 100) + '%';
    pin.style.top  = (y / S * 100) + '%';
    pin.classList.toggle('back-face', depth < 0.08);
    pin.classList.toggle('active',    i === activeIdx);
  });
}

// ─── Globe: RAF loop ─────────────────────────────────────────
function startGlobeLoop() {
  if (globeRAF) return;
  function tick() {
    // Idle: slow eastward drift
    if (globeStep === 0) globeTargetRot += 0.07;
    // Lerp rotation toward target
    globeRotation += (globeTargetRot - globeRotation) * 0.07;
    drawGlobeFrame(globeRotation);
    updateGlobePins(globeRotation);
    globeRAF = requestAnimationFrame(tick);
  }
  globeRAF = requestAnimationFrame(tick);
}

function stopGlobeLoop() {
  if (globeRAF) { cancelAnimationFrame(globeRAF); globeRAF = null; }
}

// ─── Globe: advance step ─────────────────────────────────────
function advanceGlobe(step) {
  globeStep      = step;
  globeTargetRot = GLOBE_TARGET_ROTATIONS[step];

  const info = document.getElementById('globe-info');
  if (!info) return;

  if (step === 0) {
    info.classList.remove('visible');
  } else {
    const plate = GLOBE_PLATES[step - 1];
    info.querySelector('.globe-info-region').textContent = plate.region;
    info.querySelector('.globe-info-food').textContent   = plate.food;
    info.querySelector('.globe-info-thesis').textContent = plate.thesis;
    info.classList.add('visible');
  }
}

// ─── Health windows: click to pin popup ─────────────────────
document.querySelectorAll('.health-window').forEach(card => {
  card.addEventListener('click', e => {
    // Don't toggle if user clicked a link inside the popup
    if (e.target.closest('a')) return;

    const isOpen = card.classList.contains('pinned');
    // Close any other pinned cards
    document.querySelectorAll('.health-window.pinned').forEach(c => c.classList.remove('pinned'));
    if (!isOpen) card.classList.add('pinned');
  });
});

// Click outside any health-window closes pinned popup
document.addEventListener('click', e => {
  if (!e.target.closest('.health-window')) {
    document.querySelectorAll('.health-window.pinned').forEach(c => c.classList.remove('pinned'));
  }
});
