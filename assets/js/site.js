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
const operationalFlow = document.querySelector('[data-operational-flow]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const phrases = rotatingPhrase?.dataset.phrases?.split('|').filter(Boolean) ?? [];
const flowStates = ['admin', 'followup', 'disconnected', 'handoff', 'normal'];

const playOperationalFlowState = (state) => {
  if (!operationalFlow) return;
  operationalFlow.dataset.flowState = state;
  operationalFlow.classList.remove('is-playing');
  if (reduceMotion.matches) return;
  void operationalFlow.offsetWidth;
  operationalFlow.classList.add('is-playing');
};

playOperationalFlowState(flowStates[0]);

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
      playOperationalFlowState(flowStates[phraseIndex] ?? flowStates[0]);
      rotatingPhrase.classList.remove('is-changing');
    }, 380);
  }, 4800);
}
