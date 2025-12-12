const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
const accordionGroups = document.querySelectorAll('[data-accordion]');

function closeNavOnResize() {
  if (window.innerWidth > 880) {
    navLinks?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
}

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

window.addEventListener('resize', closeNavOnResize);

accordionGroups.forEach((group) => {
  const triggers = group.querySelectorAll('.accordion__item');
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      const panel = trigger.nextElementSibling;
      if (panel && panel.classList.contains('accordion__panel')) {
        panel.hidden = expanded;
      }
    });
  });
});
