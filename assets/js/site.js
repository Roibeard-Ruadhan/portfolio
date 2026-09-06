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
const phrases = [
  'repetitive admin.',
  'slow follow-ups.',
  'disconnected systems.',
  "work that's become “just part of the job”."
];

if (rotatingPhrase && !reduceMotion.matches) {
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
