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



// WEBFLOW-STYLE "WHILE SCROLLING IN VIEW" HORIZONTAL EFFECT
gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {

  const gallery = document.querySelector("#horizontal-gallery");
  const images = document.querySelector(".gallery-images");
  const text = document.querySelector(".gallery-text");

  if (!gallery || !images) return;

  function getTotalWidth() {
    return images.scrollWidth - images.offsetWidth;
  }

  gsap.to(images, {
    x: () => -getTotalWidth(),
    ease: "none",
    scrollTrigger: {
      trigger: gallery,
      start: "top top",
      end: () => "+=" + getTotalWidth(),
      scrub: 1.5,     // smooth cinematic feel
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  // subtle text movement
  gsap.to(text, {
    x: -120,
    opacity: 0.85,
    scrollTrigger: {
      trigger: gallery,
      start: "top top",
      end: () => "+=" + getTotalWidth(),
      scrub: 1.5,
      invalidateOnRefresh: true
    }
  });

});
