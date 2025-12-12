const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
const accordionGroups = document.querySelectorAll('[data-accordion]');
const navBar = document.querySelector('.nav');

function closeNavOnResize() {
  if (window.innerWidth > 960) {
    navLinks?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
}

function handleNavScroll() {
  if (!navBar) return;
  navBar.classList.toggle('nav--scrolled', window.scrollY > 8);
}

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

window.addEventListener('resize', closeNavOnResize);
window.addEventListener('scroll', handleNavScroll);
handleNavScroll();

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

// (Carousel removed)

// (Hero slider removed)
