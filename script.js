document.addEventListener('DOMContentLoaded', () => {

  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 1000,
    once: true,
    offset: 50,
    easing: 'ease-out-cubic'
  });

  // Initialize Swiper for Retrospective Section
  const retroSwiper = new Swiper('.retro-swiper', {
    slidesPerView: 1.2,
    spaceBetween: 20,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2.5,
        spaceBetween: 30,
        centeredSlides: false,
      },
      1024: {
        slidesPerView: 3.5,
        spaceBetween: 40,
        centeredSlides: false,
      },
    }
  });

  // Placeholder for 3D Statue logic or other interactions
  console.log('Oscar 2026 Page Loaded');

  // Simple Parallax Effect for Hero
  const heroBg = document.querySelector('.hero-bg');
  const heroContent = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY < window.innerHeight) {
      // Background moves slower (distance * 0.5)
      if (heroBg) heroBg.style.transform = `translateY(${scrollY * 0.5}px)`;

      // Content moves slightly faster/fades (optional, but requested in layout)
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
        heroContent.style.opacity = 1 - (scrollY / 700);
      }
    }
  });

});
