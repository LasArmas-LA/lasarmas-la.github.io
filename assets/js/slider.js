const heroSwiper = new Swiper('.hero-slider', {
  loop: true,
  speed: 700,
  autoplay: {
    delay: 5000,
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
    slideChangeTransitionEnd(swiper){ handleVideoSlide(swiper); } // ←ここが大事
  }
});

let videoTimer = null;
function handleVideoSlide(swiper){
  if (videoTimer){ clearTimeout(videoTimer); videoTimer = null; }
  document.querySelectorAll('.hero-slide video').forEach(v => { try { v.pause(); v.currentTime = 0; } catch(e){}; });

  const active = swiper.slides[swiper.activeIndex];
  if (!active) return;
  const video = active.querySelector('video');
  if (!video){ if (!swiper.autoplay.running) swiper.autoplay.start(); return; }

  if (swiper.autoplay.running) swiper.autoplay.stop();

  video.muted = true;
  video.playsInline = true;
  video.setAttribute('muted','');
  video.setAttribute('playsinline','');

  const start = () => {
    video.play().catch(()=>{});
    const fallbackMs = 10000;
    const durationMs = (isFinite(video.duration) && video.duration > 0)
      ? Math.round(video.duration * 1000)
      : fallbackMs;

    const done = () => {
      cleanup();
      swiper.slideNext();
      swiper.autoplay.start();
    };
    video.addEventListener('ended', done, { once: true });
    videoTimer = setTimeout(done, durationMs + 200);

    function cleanup(){
      video.removeEventListener('ended', done);
      if (videoTimer){ clearTimeout(videoTimer); videoTimer = null; }
    }
  };

  if (isFinite(video.duration) && video.duration > 0){
    start();
  } else {
    const onMeta = () => { video.removeEventListener('loadedmetadata', onMeta); start(); };
    video.addEventListener('loadedmetadata', onMeta);
    // 最悪メタデータが来なくても進む保険
    videoTimer = setTimeout(() => {
      swiper.slideNext();
      swiper.autoplay.start();
    }, 10200);
    try { if (video.readyState < 1) video.load(); } catch(e){}
  }
}
