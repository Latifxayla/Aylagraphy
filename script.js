// ===== Aylagraphy – Seitenlogik =====
// Seitenwechsel passieren ohne Neuladen (nur der Inhalt wird getauscht),
// damit die Hintergrundmusik weiterläuft und die Logo-Animation nicht bei jedem Menü-Klick erscheint.

// Aufräum-Funktionen der aktuellen Seite (Timer, globale Listener), laufen vor jedem Seitenwechsel
let pageCleanups = [];

function onCleanup(fn) {
  pageCleanups.push(fn);
}

function runCleanups() {
  pageCleanups.forEach((fn) => fn());
  pageCleanups = [];
}

// ----- Logo-Animation (Page-Loader) -----
// Erscheint beim Öffnen/Neuladen der Website, aber nicht beim Seitenwechsel über das Menü.
let isFirstPage = true;

function initPageLoader() {
  const pageLoader = document.querySelector('.page-loader');
  if (!pageLoader) return;

  if (!isFirstPage) {
    pageLoader.remove();
    return;
  }

  const hide = () => window.setTimeout(() => pageLoader.classList.add('is-hidden'), 4800);
  if (document.readyState === 'complete') hide();
  else window.addEventListener('load', hide, { once: true });
}

// ----- Navigation -----
function initNav() {
  const navToggle = document.querySelector('.nav__toggle');
  const navLinksGroups = document.querySelectorAll('.nav__links');
  const navBar = document.querySelector('.nav');

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
  onCleanup(() => {
    window.removeEventListener('resize', closeNavOnResize);
    window.removeEventListener('scroll', handleNavScroll);
  });
  handleNavScroll();
}

function initAccordions() {
  document.querySelectorAll('[data-accordion]').forEach((group) => {
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
}

function initPortfolioHoverLabels() {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;

  const namesByCategory = {
    'reportage-1': 'Emma & Dilsin',
    'reportage-2': 'Simay & Koray',
    'reportage-3': 'Hielay & Oguzhan',
    'reportage-4': 'Frank & Ebru',
    'reportage-5': 'Paris',
    'reportage-6': 'Elif',
    'reportage-7': 'Melania & Jan-Luca',
    'reportage-8': 'Paris'
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

  function onKeydown(event) {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(currentIndex - 1);
    if (event.key === 'ArrowRight') show(currentIndex + 1);
  }
  document.addEventListener('keydown', onKeydown);
  onCleanup(() => document.removeEventListener('keydown', onKeydown));
}

function initPortfolioFilter() {
  const coverButtons = document.querySelectorAll('.portfolio-cover');
  const gallery = document.querySelector('.gallery');
  // Übersicht mit allen Galerie-Kacheln (Hochzeiten + Destinations)
  const coverGrid = document.querySelector('.portfolio-overview') || document.querySelector('.portfolio-covers');
  if (!gallery) return;

  const images = Array.from(gallery.querySelectorAll('img'));

  function showFilter(filter) {
    images.forEach((img) => {
      const show = img.dataset.category === filter;
      img.parentElement.hidden = !show;
      img.parentElement.style.display = show ? 'block' : 'none';
    });

    coverButtons.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.filter === filter);
    });

    // In einer geöffneten Galerie nur die Bilder zeigen, keine Cover
    if (coverGrid) coverGrid.hidden = Boolean(filter);

    gallery.classList.add('is-visible');
  }

  // Zurück-Pfeil: erscheint in einer geöffneten Galerie und führt zur Übersicht aller Galerien
  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'portfolio-back';
  backButton.hidden = true;
  backButton.innerHTML = '<span aria-hidden="true">&larr;</span> Alle Galerien';
  coverGrid?.parentNode.insertBefore(backButton, coverGrid);

  function showOverview() {
    images.forEach((img) => {
      img.parentElement.hidden = true;
      img.parentElement.style.display = 'none';
    });
    coverButtons.forEach((btn) => btn.classList.remove('is-active'));
    if (coverGrid) coverGrid.hidden = false;
    gallery.classList.remove('is-visible');
    backButton.hidden = true;
    (coverGrid || gallery).scrollIntoView({ behavior: 'smooth', block: 'start' });
    backButton.innerHTML = '<span aria-hidden="true">&larr;</span> Alle Galerien';
  }

  backButton.addEventListener('click', showOverview);

  coverButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      const name = btn.querySelector('strong')?.textContent || '';
      showFilter(filter);
      backButton.innerHTML = `<span aria-hidden="true">&larr;</span> Alle Galerien${name ? `<em>${name}</em>` : ''}`;
      backButton.hidden = false;
      backButton.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

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
      clearInterval(timer);
      timer = setInterval(next, 4200);
    });

    const onResize = () => render(false);
    window.addEventListener('resize', onResize);
    onCleanup(() => {
      clearInterval(timer);
      window.removeEventListener('resize', onResize);
    });
  });
}

function initContactForm() {
  const form = document.querySelector('.contact .form');
  if (!form) return;

  // Ausgewählte Fotos als Liste unter dem Upload-Feld anzeigen
  const photoInput = form.querySelector('#photos');
  const photoList = form.querySelector('.form__upload-files');
  photoInput?.addEventListener('change', () => {
    const names = Array.from(photoInput.files).map((file) => file.name);
    if (photoList) photoList.textContent = names.length ? names.join(', ') : '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const photoNames = photoInput ? Array.from(photoInput.files).map((file) => file.name) : [];
    const subject = `Anfrage von ${data.get('name') || 'Website'}`;
    const bodyLines = [
      `Name: ${data.get('name') || ''}`,
      `E-Mail: ${data.get('email') || ''}`,
      `Datum: ${data.get('date') || ''}`,
      `Ort: ${data.get('location') || ''}`,
      `Stundenanzahl: ${data.get('hours') || ''}`,
      `Instagram: ${data.get('instagram') || ''}`,
      '',
      data.get('message') || '',
    ];
    // Per E-Mail-Link können Dateien nicht automatisch mitgeschickt werden
    if (photoNames.length) {
      bodyLines.push('', `Fotos (bitte an diese E-Mail anhängen): ${photoNames.join(', ')}`);
    }
    const mailto = `mailto:aylagraphy@outlook.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    window.location.href = mailto;
  });
}

// ----- Titelbilder (Home, Portfolio, Preise): Bild gleitet beim Scrollen sanft nach oben und blendet leicht aus -----
function initHeroParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const heroes = Array.from(document.querySelectorAll('.hero'))
    .map((hero) => ({ hero, image: hero.querySelector('.hero__image') }))
    .filter((item) => item.image);
  if (!heroes.length) return;

  let ticking = false;
  function update() {
    ticking = false;
    heroes.forEach(({ hero, image }) => {
      const height = hero.offsetHeight || 1;
      // Wie weit ist das Titelbild schon aus dem Bildschirm gescrollt?
      const scrolled = Math.min(Math.max(-hero.getBoundingClientRect().top, 0), height);
      const progress = scrolled / height;
      // Bild bewegt sich langsamer als die Seite (wirkt wie sanftes Hochgleiten) und wird blasser
      image.style.transform = `translateY(${scrolled * 0.45}px) scale(1.06)`;
      image.style.opacity = String(1 - progress * 0.55);
    });
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onCleanup(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  });
  update();
}

// ----- Home & Über uns: Texte erscheinen beim Runterscrollen Stück für Stück von unten -----
function initScrollReveal() {
  if (!['home', 'ueber-uns'].includes(document.body.dataset.page)) return;
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const items = document.querySelectorAll(
    'main .eyebrow, main h2, main p, main .story__names, main .service-item, main .callout .btn, main .insta-link'
  );

  const observer = new IntersectionObserver((entries) => {
    // Was gleichzeitig ins Bild kommt, erscheint nacheinander (kleine Verzögerung pro Element)
    let order = 0;
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.transitionDelay = `${order * 0.15}s`;
      order += 1;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  items.forEach((el) => {
    // Elemente innerhalb eines bereits animierten Blocks nicht doppelt animieren
    if (el.parentElement.closest('.reveal')) return;
    el.classList.add('reveal');
    observer.observe(el);
  });

  onCleanup(() => observer.disconnect());
}

// ----- Über uns: die beiden Kreise („Ay“ + „La“) fahren je nach Scrollposition zusammen -----
function initCircleJoin() {
  const mark = document.querySelector('.story__mark');
  if (!mark) return;
  const left = mark.querySelector('.story__mark-left');
  const right = mark.querySelector('.story__mark-right');
  const name = mark.querySelector('.story__mark-name');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const maxShift = 46; // Abstand je Kreis im getrennten Zustand (SVG-Einheiten)
  let ticking = false;

  function update() {
    ticking = false;
    const rect = mark.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    // 0 = Zeichen taucht unten auf, 1 = Mitte des Zeichens hat die Bildschirmmitte erreicht
    const start = vh;
    const end = vh * 0.5;
    const center = rect.top + rect.height / 2;
    const progress = Math.min(Math.max((start - center) / (start - end), 0), 1);
    const eased = 1 - Math.pow(1 - progress, 2);

    const shift = (1 - eased) * maxShift;
    left.style.transform = `translateX(${-shift}px)`;
    right.style.transform = `translateX(${shift}px)`;
    left.style.opacity = right.style.opacity = String(0.4 + 0.6 * eased);
    // Name erscheint erst im letzten Stück
    name.style.opacity = String(Math.min(Math.max((progress - 0.75) / 0.25, 0), 1));
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onCleanup(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  });
  update();
}

// ----- Impressum (und weitere Rechtstexte) als Fenster im Footer -----
function initLegalDialogs() {
  document.querySelectorAll('[data-open-dialog]').forEach((button) => {
    const dialog = document.getElementById(button.dataset.openDialog);
    if (!dialog || typeof dialog.showModal !== 'function') return;
    button.addEventListener('click', () => dialog.showModal());
    dialog.querySelectorAll('[data-close-dialog]').forEach((close) => {
      close.addEventListener('click', () => dialog.close());
    });
    // Klick auf den abgedunkelten Hintergrund schließt das Fenster
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
}

// ----- Startseite: Bild mit Regler zwischen Schwarz-Weiß und Farbe -----
function initCompareSliders() {
  document.querySelectorAll('[data-compare]').forEach((compare) => {
    const range = compare.querySelector('.compare__range');
    if (!range) return;
    const update = () => compare.style.setProperty('--pos', `${range.value}%`);
    range.addEventListener('input', update);
    update();
  });
}

// Alles, was pro Seite neu eingerichtet werden muss
function initPage() {
  initPageLoader();
  initNav();
  initAccordions();
  initPortfolioHoverLabels();
  initLightbox();
  initPortfolioFilter();
  initTeaserCarousels();
  initContactForm();
  initHeroParallax();
  initScrollReveal();
  initCircleJoin();
  initLegalDialogs();
  initCompareSliders();
}

// ===== Ruhige Hintergrundmusik (assets/audio/hintergrund.mp3) =====
// Startet nur über den Musik-Button unten rechts und pausiert, sobald der Tab nicht sichtbar ist.
// Button und Musik bleiben beim Seitenwechsel bestehen.
let musicButton = null;

function initBackgroundMusic() {
  const audio = new Audio('assets/audio/hintergrund.mp3');
  audio.loop = true;
  audio.volume = 0.4;
  audio.preload = 'auto';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'music-toggle';
  button.setAttribute('aria-label', 'Musik abspielen');
  button.innerHTML = '<span class="music-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>';
  document.body.appendChild(button);
  musicButton = button;
  audio.addEventListener('error', () => {
    button.remove();
    musicButton = null;
  });

  let wanted = false; // hat der Besuchende die Musik eingeschaltet?
  try {
    wanted = sessionStorage.getItem('music-on') === '1';
    audio.currentTime = parseFloat(sessionStorage.getItem('music-time')) || 0;
  } catch (e) {}

  function setState(on) {
    button.classList.toggle('is-playing', on);
    button.setAttribute('aria-label', on ? 'Musik pausieren' : 'Musik abspielen');
  }

  function remember() {
    try {
      sessionStorage.setItem('music-on', wanted ? '1' : '0');
      sessionStorage.setItem('music-time', String(audio.currentTime));
    } catch (e) {}
  }

  function play() {
    audio.play().then(() => setState(true)).catch(() => setState(false));
  }

  button.addEventListener('click', () => {
    wanted = audio.paused;
    if (wanted) play();
    else {
      audio.pause();
      setState(false);
    }
    remember();
  });

  // Nach einem echten Neuladen (z. B. Pakete-Seite) weiterspielen, wenn die Musik vorher an war
  if (wanted) play();

  // Nur hörbar, solange die Website sichtbar ist
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) audio.pause();
    else if (wanted) play();
  });

  window.addEventListener('pagehide', remember);
}

// ===== Seitenwechsel ohne Neuladen =====
function isSoftNavLink(link, event) {
  if (!link || event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (link.target && link.target !== '_self') return false;
  if (link.hasAttribute('download')) return false;
  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  if (!/\.html$/.test(url.pathname)) return false;
  // Pakete-Seite hat ein eigenes Passwort-Skript → normal laden
  if (/pakete-details\.html$/.test(url.pathname)) return false;
  // Nur ein Anker auf derselben Seite → Browser übernimmt
  if (url.pathname === window.location.pathname && url.hash) return false;
  return true;
}

async function softNavigate(url, push) {
  let html;
  try {
    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) throw new Error(String(res.status));
    html = await res.text();
  } catch (e) {
    window.location.href = url; // Fallback: normal laden
    return;
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');
  runCleanups();

  document.title = doc.title;
  const meta = document.querySelector('meta[name="description"]');
  const newMeta = doc.querySelector('meta[name="description"]');
  if (meta && newMeta) meta.setAttribute('content', newMeta.getAttribute('content'));

  // Body-Attribute (z. B. data-page für die Startseite) übernehmen
  Array.from(document.body.attributes).forEach((attr) => document.body.removeAttribute(attr.name));
  Array.from(doc.body.attributes).forEach((attr) => document.body.setAttribute(attr.name, attr.value));

  // Inhalt tauschen – Skripte weglassen, Musik-Button behalten
  doc.body.querySelectorAll('script').forEach((s) => s.remove());
  const fragment = document.createDocumentFragment();
  Array.from(doc.body.childNodes).forEach((node) => fragment.appendChild(document.adoptNode(node)));
  Array.from(document.body.childNodes).forEach((node) => {
    if (node !== musicButton) node.remove();
  });
  document.body.insertBefore(fragment, musicButton);

  if (push) history.pushState({ softNav: true }, '', url);
  const hash = new URL(url, window.location.href).hash;
  const target = hash && document.querySelector(hash);
  if (target) target.scrollIntoView();
  else window.scrollTo(0, 0);

  isFirstPage = false;
  initPage();
}

function initSoftNavigation() {
  if (!window.fetch || !window.DOMParser || !history.pushState) return;
  history.replaceState({ softNav: true }, '', window.location.href);

  document.addEventListener('click', (event) => {
    const link = event.target.closest && event.target.closest('a[href]');
    if (!isSoftNavLink(link, event)) return;
    event.preventDefault();
    if (link.href === window.location.href) return;
    softNavigate(link.href, true);
  });

  window.addEventListener('popstate', () => {
    softNavigate(window.location.href, false);
  });
}

initPage();
initBackgroundMusic();
initSoftNavigation();
