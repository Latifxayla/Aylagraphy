const slider = document.querySelector('.auto-slider');
const slides = slider ? Array.from(slider.querySelectorAll('.slide')) : [];
const rotationDelay = 5000;
let currentIndex = 0;

function showSlide(index) {
  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === index);
  });
}

function startSlider() {
  if (slides.length <= 1) return;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }, rotationDelay);
}

if (slides.length) {
  showSlide(currentIndex);
  startSlider();
}
