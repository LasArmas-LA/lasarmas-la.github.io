// Hero slider（基本は5秒、自動。動画スライドでは動画が終わるまで停止）
const heroSwiper = new Swiper('.hero-slider', {
  loop: true,
  speed: 700,
  autoplay: {
    delay: 5000,                 // 画像スライドは5秒
    disableOnInteraction: false, // 手動後も自動再開
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
  keyboard: { enabled: true },
  a11y: { enabled: true },
  on: {
    init(swiper){ handleVideoSlide(swiper); },
    slideChangeTransitionStart(swiper){ handleVideoSlide(swiper); }
  }
});

let videoTimer = null;

function handleVideoSlide(swiper){
  // 既存タイマーをクリア
  if (videoTimer){ clearTimeout(videoTimer); videoTimer = null; }

  // すべての動画を停止＆巻き戻し
  document.querySelectorAll('.hero-slide video').forEach(v => {
    v.pause();
    try { v.currentTime = 0; } catch(e){}
  });

  const active = swiper.slides[swiper.activeIndex];
  if (!active) return;

  const video = active.querySelector('video');
  if (!video){
    // 画像スライドなら通常の自動再生を確保
    if (!swiper.autoplay.running) swiper.autoplay.start();
    return;
  }

  // 動画スライド：自動再生を止め、動画を再生して終了後に次へ
  if (swiper.autoplay.running) swiper.autoplay.stop();

  // iOS対策：muted + playsinline 必須（HTML側で付与済み）
  const startPlay = () => {
    video.play().catch(()=>{ /* 失敗しても黙って進む */ });

    const fallbackMs = 5000; // 10秒の動画想定
    const durationMs = (isFinite(video.duration) && video.duration > 0)
      ? Math.round(video.duration * 1000)
      : fallbackMs;

    // 動画が終わったら次へ
    const onEnded = () => {
      cleanup();
      swiper.slideNext();
      swiper.autoplay.start();
    };
    video.addEventListener('ended', onEnded, { once: true });

    // 念のためのタイムアウト（duration 未取得や ended 未発火に備える）
    videoTimer = setTimeout(onEnded, durationMs + 200);

    function cleanup(){
      video.removeEventListener('ended', onEnded);
      if (videoTimer){ clearTimeout(videoTimer); videoTimer = null; }
    }
  };

  if (isFinite(video.duration) && video.duration > 0){
    startPlay();
  } else {
    // メタデータ取得後に正確な再生時間で開始
    video.addEventListener('loadedmetadata', startPlay, { once: true });
    // 最悪メタデータが来なくても10秒で進む
    videoTimer = setTimeout(() => {
      swiper.slideNext();
      swiper.autoplay.start();
    }, 10200);
  }
}
