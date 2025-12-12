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

// Carousel setup
const carouselImages = [
  'assets/carousel/carousel-1.svg',
  'assets/carousel/carousel-2.svg',
  'assets/carousel/carousel-3.svg',
  'assets/carousel/carousel-4.svg'
];

function initCarousel() {
  const track = document.querySelector('[data-carousel-track]');
  const dotsContainer = document.querySelector('[data-carousel-dots]');

  if (!track || !dotsContainer || !carouselImages.length) return;

  const slides = carouselImages.map((src, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel__slide';
    if (index === 0) slide.classList.add('is-active');

    const img = document.createElement('img');
    img.src = src;
    img.alt = `Carousel Bild ${index + 1}`;
    img.loading = 'lazy';
    slide.appendChild(img);
    track.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'carousel__dot' + (index === 0 ? ' is-active' : '');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Bild ${index + 1} anzeigen`);
    dotsContainer.appendChild(dot);

    return { slide, dot };
  });

  let currentIndex = 0;
  let carouselTimer = setInterval(nextSlide, 4000);

  function goToSlide(index) {
    const safeIndex = (index + slides.length) % slides.length;
    slides[currentIndex].slide.classList.remove('is-active');
    slides[currentIndex].dot.classList.remove('is-active');
    slides[safeIndex].slide.classList.add('is-active');
    slides[safeIndex].dot.classList.add('is-active');
    currentIndex = safeIndex;
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  dotsContainer.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    const index = slides.findIndex((entry) => entry.dot === event.target);
    if (index >= 0) {
      goToSlide(index);
      clearInterval(carouselTimer);
      carouselTimer = setInterval(nextSlide, 4000);
    }
  });
}

initCarousel();
