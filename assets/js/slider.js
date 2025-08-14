const heroSwiper = new Swiper('.hero-slider', {
  loop: true,
  speed: 700,
  autoplay: {
    delay: 5000, // 全スライド共通 5秒
    disableOnInteraction: false,
    pauseOnMouseEnter: true
  },
  pagination: { el: '.hero-slider .swiper-pagination', clickable: true },
  navigation: {
    nextEl: '.hero-slider .swiper-button-next',
    prevEl: '.hero-slider .swiper-button-prev'
  },
  keyboard: { enabled: true },
  a11y: { enabled: true },
  on: {
    init(swiper){ handleVideoSlide(swiper); },
    slideChangeTransitionEnd(swiper){ handleVideoSlide(swiper); }
  }
});

function handleVideoSlide(swiper){
  // 全動画停止＆リセット
  document.querySelectorAll('.hero-slide video').forEach(v => {
    try {
      v.pause();
      v.currentTime = 0;
    } catch(e){}
  });

  const active = swiper.slides[swiper.activeIndex];
  if (!active) return;

  const video = active.querySelector('video');
  if (video) {
    // 動画スライドはループ＆即再生
    swiper.autoplay.stop(); // スライド切替は手動に
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('muted','');
    video.setAttribute('playsinline','');

    // ゼロから再生
    video.currentTime = 0;
    video.play().catch(()=>{});

    // 5秒後に次のスライドへ
    setTimeout(() => {
      swiper.slideNext();
      swiper.autoplay.start();
    }, 5000);

  } else {
    // 通常スライドは autoplay に任せる
    if (!swiper.autoplay.running) swiper.autoplay.start();
  }
}
