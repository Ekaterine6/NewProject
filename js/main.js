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


// HORIZONTAL GALLERY — wheel-driven carousel with snapping + pointer/touch drag
(function() {
  const gallerySection = document.getElementById('horizontal-gallery');
  const viewport = document.getElementById('galleryViewport'); // .gallery-images (overflow:hidden)
  const track = document.getElementById('imagesTrack'); // the inner track
  const textCol = document.getElementById('galleryText');

  if (!gallerySection || !viewport || !track) return;

  // state
  let pos = 0; // current translateX in px
  let isTicking = false;
  let maxScroll = 0;
  let slideWidth = 0;
  let slides = Array.from(track.children);
  let isPointerDown = false;
  let startX = 0;
  let lastX = 0;
  let velocity = 0;
  let snapTimeout = null;

  function recalc() {
    slideWidth = viewport.clientWidth; // each slide is 100% of viewport-right area
    maxScroll = Math.max(0, track.scrollWidth - slideWidth);
    pos = Math.min(Math.max(0, pos), maxScroll);
    updateVisuals(true);
  }
  window.addEventListener('resize', recalc);
  // initial calc after images load (in case images change sizes)
  window.addEventListener('load', () => {
    // small delay to ensure sizes
    setTimeout(recalc, 50);
  });

  // smooth visual update with RAF
  function updateVisuals(skipTransition) {
    if (skipTransition) {
      track.style.transition = 'none';
      textCol.style.transition = 'none';
      // force layout then remove transition-none to keep future transitions working
      track.style.transform = `translateX(-${pos}px)`;
      requestAnimationFrame(() => {
        track.style.transition = '';
        textCol.style.transition = '';
      });
    } else {
      track.style.transform = `translateX(-${pos}px)`;
    }

    // sync the text: slide the text left slightly as user scrolls (0..30% shift)
    if (maxScroll > 0) {
      const t = pos / maxScroll; // 0..1
      const textTranslate = t * 25; // max translate 25% to the left
      textCol.style.transform = `translateY(-50%) translateX(-${textTranslate}%)`;
      textCol.style.opacity = `${1 - Math.min(0.25, t * 0.5)}`; // slight fade
    } else {
      textCol.style.transform = `translateY(-50%) translateX(0)`;
      textCol.style.opacity = '1';
    }
  }

  // wheel handler: when pointer is over gallery, hijack vertical wheel
  function onWheel(e) {
    // only hijack if the gallery is visible on screen
    const rect = gallerySection.getBoundingClientRect();
    if (rect.top >= window.innerHeight || rect.bottom <= 0) return;

    // prevent default vertical page scroll
    e.preventDefault();

    // move pos by deltaY — multiply for sensitivity
    const delta = e.deltaY;
    const sensitivity = 1.2; // tweak this to taste
    pos += delta * sensitivity;

    // clamp
    pos = Math.max(0, Math.min(pos, maxScroll));

    // throttle updates with requestAnimationFrame
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(() => {
        updateVisuals();
        isTicking = false;
      });
    }

    // snap after 120ms of no wheel events
    clearTimeout(snapTimeout);
    snapTimeout = setTimeout(() => snapToClosest(), 120);
  }

  // snapping to the nearest slide
  function snapToClosest() {
    if (slideWidth <= 0) return;
    const idx = Math.round(pos / slideWidth);
    const target = idx * slideWidth;
    // animate to target
    track.style.transition = 'transform 0.45s cubic-bezier(.22,.9,.35,1)';
    textCol.style.transition = 'transform 0.45s cubic-bezier(.22,.9,.35,1), opacity 0.45s';
    pos = Math.max(0, Math.min(target, maxScroll));
    updateVisuals();
    // clear transitions after finishing
    setTimeout(() => {
      track.style.transition = '';
      textCol.style.transition = '';
    }, 500);
  }

  // pointer/touch dragging for natural feel
  function onPointerDown(e) {
    isPointerDown = true;
    viewport.classList.add('dragging');
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    lastX = startX;
    velocity = 0;
    track.style.transition = 'none';
    clearTimeout(snapTimeout);
    // capture pointer for mouse
    if (e.pointerId) viewport.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!isPointerDown) return;
    const curX = (e.touches ? e.touches[0].clientX : e.clientX);
    const dx = curX - lastX;
    lastX = curX;
    // move pos opposite to pointer movement (drag left => move right)
    pos = Math.max(0, Math.min(pos - dx, maxScroll));
    velocity = dx;
    updateVisuals();
  }
  function onPointerUp(e) {
    if (!isPointerDown) return;
    isPointerDown = false;
    viewport.classList.remove('dragging');
    // flick momentum: if velocity significant, push a bit then snap
    if (Math.abs(velocity) > 10) {
      pos = Math.max(0, Math.min(pos - velocity * 6, maxScroll));
    }
    // snap
    snapToClosest();
    // release pointer
    try { if (e.pointerId) viewport.releasePointerCapture(e.pointerId); } catch (err) {}
  }

  // when mouse is over the gallery, prevent page wheel default (attach on mouseenter)
  function addWheelHijack() {
    // use passive:false so we can preventDefault
    gallerySection.addEventListener('wheel', onWheel, { passive: false });
  }
  function removeWheelHijack() {
    gallerySection.removeEventListener('wheel', onWheel);
  }

  // add pointer listeners (supports touch too)
  viewport.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  // fallback for touch events
  viewport.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // start/stop hijack on enter/leave
  gallerySection.addEventListener('mouseenter', addWheelHijack);
  gallerySection.addEventListener('mouseleave', removeWheelHijack);

  // ensure initial sizes
  recalc();

  // accessibility: allow keyboard arrows to navigate slides when focused
  gallerySection.setAttribute('tabindex', '0');
  gallerySection.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      pos = Math.min(pos + slideWidth, maxScroll);
      updateVisuals();
      snapToClosest();
    } else if (e.key === 'ArrowLeft') {
      pos = Math.max(pos - slideWidth, 0);
      updateVisuals();
      snapToClosest();
    }
  });

  // expose for debug if needed
  window.__galleryDebug = { recalc, snapToClosest };
})();
