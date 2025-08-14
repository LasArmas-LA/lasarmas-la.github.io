/* ===== Swiper 初期化（全スライド5秒） ===== */
const heroSwiper = new Swiper('.hero-slider', {
  loop: true,
  speed: 700,
  autoplay: {
    delay: 5000,                 // 全スライド5秒
    disableOnInteraction: false, // 手動後も自動再開
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
    init(sw){ handleSlideMedia(sw); equalizeHeroTextHeights(); },
    slideChangeTransitionEnd(sw){ handleSlideMedia(sw); equalizeHeroTextHeights(); }
  }
});

/* ===== 動画スライド：到達ごとに0秒から再生＆5秒で次へ ===== */
let videoAdvanceTimer = null;

function handleSlideMedia(swiper){
  // 既存タイマー解除
  if (videoAdvanceTimer){ clearTimeout(videoAdvanceTimer); videoAdvanceTimer = null; }

  // すべての動画を停止＆リセット
  document.querySelectorAll('.hero-slide video').forEach(v => {
    try { v.pause(); v.currentTime = 0; } catch(e){}
  });

  const active = swiper.slides[swiper.activeIndex];
  if (!active) return;

  const video = active.querySelector('video');
  if (!video){
    // 画像スライド：autoplay任せ
    if (!swiper.autoplay.running) swiper.autoplay.start();
    return;
  }

  // 動画スライド：5秒で次へ（全体のテンポ統一）
  if (swiper.autoplay.running) swiper.autoplay.stop();

  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.setAttribute('muted','');
  video.setAttribute('playsinline','');

  // 0秒から再生
  try { video.currentTime = 0; } catch(e){}
  video.play().catch(()=>{ /* 自動再生失敗は無視（muted/playsinline推奨） */ });

  // 5秒後に次へ & autoplay再開
  videoAdvanceTimer = setTimeout(() => {
    swiper.slideNext();
    swiper.autoplay.start();
  }, 5000);
}

/* ===== .hero-text の高さを最長に統一 ===== */
let eqTimer = null;

function equalizeHeroTextHeights(){
  if (eqTimer) cancelAnimationFrame(eqTimer);
  eqTimer = requestAnimationFrame(() => {
    const boxes = Array.from(document.querySelectorAll('.hero-text'));
    if (!boxes.length) return;

    // いったん自然高さに戻す
    boxes.forEach(b => b.style.height = 'auto');

    // 最大高さを測る
    const max = boxes.reduce((m, b) => Math.max(m, b.offsetHeight), 0);

    // すべてに適用
    boxes.forEach(b => b.style.height = max + 'px');
  });
}

/* 画像や動画の読み込みタイミングでも再計測 */
window.addEventListener('load', equalizeHeroTextHeights);
window.addEventListener('resize', () => {
  if (eqTimer) cancelAnimationFrame(eqTimer);
  eqTimer = requestAnimationFrame(equalizeHeroTextHeights);
});

/* スライダー内の画像・動画にロードイベントを張って、読み込み後に再計測 */
document.querySelectorAll('.hero-slide img').forEach(img => {
  if (img.complete) return; // 既に読み込まれていれば無視
  img.addEventListener('load', equalizeHeroTextHeights, { once:true });
});
document.querySelectorAll('.hero-slide video').forEach(v => {
  // メタ情報が入ったら高さ計測（ポスター表示分も含めて）
  v.addEventListener('loadedmetadata', equalizeHeroTextHeights, { once:true });
});
