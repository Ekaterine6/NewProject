// NAVBAR SCROLL
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if(window.scrollY > 50) navbar.classList.add('solid');
  else navbar.classList.remove('solid');
});

// COUNTER ANIMATION
const counters = document.querySelectorAll('.count');
const options = { threshold: 0.5 };
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const updateCount = (el) => {
        const target = +el.getAttribute('data-target');
        const count = +el.innerText;
        const increment = target / 200;
        if(count < target){
          el.innerText = Math.ceil(count + increment);
          setTimeout(() => updateCount(el), 10);
        } else {
          el.innerText = target;
        }
      };
      updateCount(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, options);
counters.forEach(counter => observer.observe(counter));

// HORIZONTAL SCROLL
const gallerySection = document.getElementById('horizontal-gallery');
const galleryImages = document.querySelector('.gallery-images');
const galleryContainer = document.querySelector('.gallery-container');

window.addEventListener('scroll', () => {
  const rect = gallerySection.getBoundingClientRect();
  if(rect.top <= 0 && rect.bottom >= 0){
    const scrollAmount = Math.min(window.scrollY - gallerySection.offsetTop, galleryImages.scrollWidth - gallerySection.offsetWidth);
    galleryImages.style.transform = `translateX(-${scrollAmount}px)`;
  }
});

// SCROLL-REVEAL TEXT
const textBlocks = document.querySelectorAll('.text-block');
window.addEventListener('scroll', () => {
  textBlocks.forEach(block => {
    const rect = block.getBoundingClientRect();
    if(rect.top < window.innerHeight - 100){
      block.style.opacity = 1;
      block.style.transform = 'translateY(0)';
    }
  });
});
