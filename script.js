const navbar = document.getElementById('navbar');
const hero = document.querySelector('.hero');

const updateNavbar = () => {
  const heroHeight = hero?.offsetHeight || 0;
  if (window.scrollY > heroHeight * 0.25) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};

document.addEventListener('scroll', updateNavbar);
window.addEventListener('resize', updateNavbar);

// Rotating gallery images
const galleryImages = [
  'https://images.unsplash.com/photo-1524255684952-d7185b509571?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519744346366-d4e89eebf524?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1520854221050-0f4caff449fb?auto=format&fit=crop&w=1200&q=80'
];

const uniqueImages = [...new Set(galleryImages)];
const imageElement = document.getElementById('highlight-image');
const bulletsContainer = document.getElementById('image-bullets');
let activeIndex = 0;
let intervalId;

const renderBullets = () => {
  bulletsContainer.innerHTML = '';
  uniqueImages.forEach((_, idx) => {
    const button = document.createElement('button');
    if (idx === activeIndex) button.classList.add('active');
    button.addEventListener('click', () => {
      activeIndex = idx;
      updateImage();
      restartInterval();
    });
    bulletsContainer.appendChild(button);
  });
};

const updateImage = () => {
  imageElement.style.opacity = 0.35;
  setTimeout(() => {
    imageElement.src = uniqueImages[activeIndex];
    imageElement.onload = () => {
      imageElement.style.opacity = 1;
    };
    renderBullets();
  }, 180);
};

const nextImage = () => {
  activeIndex = (activeIndex + 1) % uniqueImages.length;
  updateImage();
};

const restartInterval = () => {
  clearInterval(intervalId);
  intervalId = setInterval(nextImage, 4000);
};

if (uniqueImages.length > 0) {
  renderBullets();
  restartInterval();
}

updateNavbar();
