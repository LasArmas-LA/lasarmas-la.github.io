// Hero slider
const heroSwiper = new Swiper('.hero-slider', {
  loop: true,
  speed: 700,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true
  },
  pagination: {
    el: '.hero-slider .swiper-pagination',
    clickable: true
  },
  navigation: {
    nextEl: '.hero-slider .swiper-button-next',
    prevEl: '.hero-slider .swiper-button-prev'
  },
  // スマホでもスワイプ、キーボードも許可
  keyboard: { enabled: true },
  a11y: { enabled: true }
});