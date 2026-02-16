window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) navbar.classList.add('solid');
  else navbar.classList.remove('solid');
});

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
      scrub: 1.5,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

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

  (function() {
    const slides = gsap.utils.toArray('.image-slide');
    const total = slides.length;
    const currentEl = document.getElementById('currentSlide');
    const totalEl = document.getElementById('totalSlides');
    const dotsWrap = document.getElementById('galleryDots');
    if (!slides.length || !currentEl || !totalEl || !dotsWrap) return;

    totalEl.innerText = String(total).padStart(2,'0');

    slides.forEach((s,i)=>{
      const btn = document.createElement('button');
      btn.className = 'dot' + (i===0 ? ' active' : '');
      btn.setAttribute('aria-label', `Go to slide ${i+1}`);
      btn.addEventListener('click', () => {
        const totalScroll = getTotalWidth();
        const targetX = (totalScroll / (total - 1)) * i;
        const scrollTween = gsap.to(window, {scrollTo: {y: targetX + gallery.offsetTop}, duration: 1});
      });
      dotsWrap.appendChild(btn);
    });

    const dots = dotsWrap.querySelectorAll('.dot');

    ScrollTrigger.create({
      trigger: gallery,
      start: "top top",
      end: () => "+=" + getTotalWidth(),
      scrub: true,
      onUpdate(self) {
        const idx = Math.round(self.progress * (total - 1));
        slides.forEach((sl,i)=> sl.classList.toggle('active', i === idx));
        currentEl.innerText = String(idx + 1).padStart(2,'0');
        dots.forEach((d,i)=> d.classList.toggle('active', i === idx));
      },
      invalidateOnRefresh: true
    });

  })();

});


// Allow default link behavior (keeps right-click / middle-click working)
document.querySelectorAll('header nav a').forEach(link => {
  link.addEventListener('click', (e) => {
  });
});



