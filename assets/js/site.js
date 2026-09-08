const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');

const closeNav = () => {
  if (!navToggle || !nav) return;
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.querySelector('.sr-only').textContent = 'Open navigation';
  nav.classList.remove('is-open');
  document.body.classList.remove('nav-open');
};

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.querySelector('.sr-only').textContent = isOpen ? 'Open navigation' : 'Close navigation';
    nav.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('nav-open', !isOpen);
  });
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeNav(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeNav(); });
}

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
document.querySelectorAll('[data-year]').forEach((element) => { element.textContent = new Date().getFullYear(); });

const rotatingPhrase = document.querySelector('[data-rotating-phrase]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const phrases = rotatingPhrase?.dataset.phrases?.split('|').filter(Boolean) ?? [];
const homeHero = document.querySelector('[data-home-hero]');
const heroVideo = document.querySelector('[data-hero-video]');

if (homeHero && heroVideo) {
  let heroIsVisible = true;

  const revealVideo = () => heroVideo.classList.add('is-ready');
  const pauseVideo = () => heroVideo.pause();
  const playVideo = () => {
    if (reduceMotion.matches || !heroIsVisible || document.hidden) return;
    heroVideo.play().catch(() => {});
  };
  const showStaticFrame = () => {
    pauseVideo();

    const seekToPosterFrame = () => {
      const posterTime = Number.isFinite(heroVideo.duration)
        ? Math.min(4.6, Math.max(0, heroVideo.duration - 0.15))
        : 0;

      if (Math.abs(heroVideo.currentTime - posterTime) < 0.05) {
        revealVideo();
        return;
      }

      heroVideo.addEventListener('seeked', revealVideo, { once: true });
      heroVideo.currentTime = posterTime;
    };

    if (heroVideo.readyState >= 1) seekToPosterFrame();
    else heroVideo.addEventListener('loadedmetadata', seekToPosterFrame, { once: true });
  };
  const updateMotionPreference = () => {
    if (reduceMotion.matches) showStaticFrame();
    else playVideo();
  };

  heroVideo.addEventListener('loadeddata', revealVideo, { once: true });

  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(([entry]) => {
      heroIsVisible = entry.isIntersecting && entry.intersectionRatio >= 0.12;
      if (heroIsVisible) playVideo();
      else pauseVideo();
    }, { threshold: [0, 0.12, 0.5] });
    videoObserver.observe(homeHero);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseVideo();
    else playVideo();
  });

  reduceMotion.addEventListener?.('change', updateMotionPreference);
  updateMotionPreference();
}

if (!reduceMotion.matches && 'IntersectionObserver' in window) {
  const revealSelectors = [
    '.split-heading',
    '.problem-grid > article',
    '.process-grid > li',
    '.assessment-outcome-copy',
    '.map-cell',
    '.service-grid > article',
    '.about-grid > *',
    '.booking-grid > *',
    '.construction-audit-grid > *',
    '.implementation-statement',
    '.about-compact-grid > *',
    '.closing-cta-grid > *'
  ];
  const revealItems = document.querySelectorAll(revealSelectors.join(','));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

  revealItems.forEach((element) => {
    const siblings = Array.from(element.parentElement?.children ?? []);
    const siblingIndex = Math.max(0, siblings.indexOf(element));
    element.classList.add('reveal-item');
    element.style.setProperty('--reveal-delay', `${Math.min(siblingIndex, 3) * 80}ms`);
    revealObserver.observe(element);
  });

  const progressionItems = document.querySelectorAll('.process-grid, .audit-detail-list');
  const progressionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-progress-visible');
      progressionObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  progressionItems.forEach((element) => progressionObserver.observe(element));
  document.body.classList.add('motion-ready');
}

if (rotatingPhrase && phrases.length > 1 && !reduceMotion.matches) {
  let phraseIndex = 0;

  window.setInterval(() => {
    rotatingPhrase.classList.add('is-changing');

    window.setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      rotatingPhrase.textContent = phrases[phraseIndex];
      rotatingPhrase.classList.remove('is-changing');
    }, 380);
  }, 4800);
}
