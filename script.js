const navToggle = document.querySelector('.nav__toggle');
const navLinksGroups = document.querySelectorAll('.nav__links');
const accordionGroups = document.querySelectorAll('[data-accordion]');
const navBar = document.querySelector('.nav');

const pageLoader = document.querySelector('.page-loader');
if (pageLoader) {
  window.addEventListener('load', () => {
    window.setTimeout(() => pageLoader.classList.add('is-hidden'), 4800);
  });
}

function closeNavOnResize() {
  if (window.innerWidth > 960) {
    navLinksGroups.forEach((g) => g.classList.remove('is-open'));
    navToggle?.setAttribute('aria-expanded', 'false');
  }
}

function handleNavScroll() {
  if (!navBar) return;
  navBar.classList.toggle('nav--scrolled', window.scrollY > 8);
}

navToggle?.addEventListener('click', () => {
  // Toggle all link groups for mobile
  let nextState = true;
  // Determine next state based on first group
  const first = navLinksGroups[0];
  if (first) nextState = !first.classList.contains('is-open');
  navLinksGroups.forEach((g) => g.classList.toggle('is-open', nextState));
  navToggle.setAttribute('aria-expanded', String(nextState));
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

function initPortfolioHoverLabels() {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;

  const namesByCategory = {
    'reportage-1': 'Emma & Dilsin',
    'reportage-2': 'Simay & Koray',
    'reportage-3': 'Hielay & Oguzhan',
    'reportage-4': 'Lina & Elias',
    'reportage-5': 'Jana & Noah'
  };

  Array.from(gallery.querySelectorAll('img')).forEach((img) => {
    const figure = img.closest('figure');
    if (!figure) {
      const wrapper = document.createElement('figure');
      wrapper.className = 'gallery__item';
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
    }

    const targetFigure = img.closest('figure');
    let caption = targetFigure.querySelector('figcaption');
    if (!caption) {
      caption = document.createElement('figcaption');
      targetFigure.appendChild(caption);
    }

    const category = img.dataset.category || 'reportage-1';
    const name = img.dataset.couple || namesByCategory[category] || 'Brautpaar';
    caption.textContent = name;
  });
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const gallery = document.querySelector('.gallery');
  if (!lightbox || !gallery) return;

  const image = lightbox.querySelector('.lightbox__image');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
  const nextBtn = lightbox.querySelector('.lightbox__nav--next');
  const overlay = lightbox.querySelector('.lightbox__overlay');
  let currentIndex = 0;

  function visibleItems() {
    return Array.from(gallery.querySelectorAll('img')).filter((img) => !img.hidden);
  }

  function show(index) {
    const items = visibleItems();
    if (!items.length) return;
    currentIndex = (index + items.length) % items.length;
    const target = items[currentIndex];
    image.src = target.src;
    image.alt = target.alt;
  }

  function open(img) {
    const items = visibleItems();
    currentIndex = items.indexOf(img);
    show(currentIndex);
    lightbox.classList.add('is-open');
  }

  function close() {
    lightbox.classList.remove('is-open');
    image.src = '';
  }

  gallery.addEventListener('click', (event) => {
    const img = event.target.closest('img');
    if (img && !img.hidden) open(img);
  });

  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);
  prevBtn?.addEventListener('click', () => show(currentIndex - 1));
  nextBtn?.addEventListener('click', () => show(currentIndex + 1));

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(currentIndex - 1);
    if (event.key === 'ArrowRight') show(currentIndex + 1);
  });
}

initLightbox();

function initPortfolioFilter() {
  const coverButtons = document.querySelectorAll('.portfolio-cover');
  const gallery = document.querySelector('.gallery');
  const coverGrid = document.querySelector('.portfolio-covers');
  if (!gallery) return;

  const images = Array.from(gallery.querySelectorAll('img'));

  function showFilter(filter) {
    images.forEach((img) => {
      const show = img.dataset.category === filter;
      img.parentElement.hidden = !show;
      img.parentElement.style.display = show ? 'block' : 'none';
    });

    coverButtons.forEach((btn) => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle('is-active', isActive);
      btn.hidden = Boolean(filter) && !isActive;
    });

    if (coverGrid) {
      coverGrid.classList.toggle('is-single', Boolean(filter));
    }

    gallery.classList.add('is-visible');
  }

  coverButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      showFilter(filter);
    });
  });
}

initPortfolioFilter();

function initTeaserCarousels() {
  const carousels = document.querySelectorAll('[data-teaser-carousel]');
  carousels.forEach((carousel) => {
    const viewport = carousel.querySelector('.teaser-carousel__viewport');
    const track = carousel.querySelector('.teaser-carousel__track');
    const prevBtn = carousel.querySelector('.teaser-carousel__control--prev');
    const nextBtn = carousel.querySelector('.teaser-carousel__control--next');
    if (!viewport || !track) return;

    const realSlides = Array.from(track.children);
    const n = realSlides.length;
    if (n < 2) return;

    function cloneSet() {
      return realSlides.map((slide) => {
        const clone = slide.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.tabIndex = -1;
        return clone;
      });
    }

    track.prepend(...cloneSet());
    track.append(...cloneSet());

    let index = n; // start at the first real slide

    function slideStep() {
      const first = track.children[0];
      const style = getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || '0');
      return first.getBoundingClientRect().width + gap;
    }

    function render(animate) {
      track.style.transition = animate ? '' : 'none';
      track.style.transform = `translateX(${-index * slideStep()}px)`;
      if (!animate) {
        track.getBoundingClientRect();
        track.style.transition = '';
      }
    }

    render(false);

    function next() {
      index += 1;
      render(true);
    }

    function prev() {
      if (index <= 0) {
        index = n;
        render(false);
      }
      index -= 1;
      render(true);
    }

    track.addEventListener('transitionend', (event) => {
      if (event.propertyName !== 'transform') return;
      if (index >= 2 * n) {
        index -= n;
        render(false);
      }
    });

    nextBtn?.addEventListener('click', next);
    prevBtn?.addEventListener('click', prev);

    let timer = setInterval(next, 4200);
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', () => {
      timer = setInterval(next, 4200);
    });

    window.addEventListener('resize', () => {
      render(false);
    });
  });
}

initTeaserCarousels();

function initContactForm() {
  const form = document.querySelector('.contact .form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = `Anfrage von ${data.get('name') || 'Website'}`;
    const bodyLines = [
      `Name: ${data.get('name') || ''}`,
      `E-Mail: ${data.get('email') || ''}`,
      `Datum: ${data.get('date') || ''}`,
      `Ort: ${data.get('location') || ''}`,
      '',
      data.get('message') || '',
    ];
    const mailto = `mailto:hallo@aylagraphy.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    window.location.href = mailto;
  });
}

initContactForm();

