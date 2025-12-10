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

updateNavbar();
