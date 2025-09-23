/* ===== Swiper 蛻晄悄蛹厄ｼ亥・繧ｹ繝ｩ繧､繝・遘抵ｼ・===== */
const heroSwiper = new Swiper('.hero-slider', {
  loop: true,
  speed: 700,
  autoplay: {
    delay: 5000,                 // 蜈ｨ繧ｹ繝ｩ繧､繝・遘・    disableOnInteraction: false, // 謇句虚蠕後ｂ閾ｪ蜍募・髢・    pauseOnMouseEnter: true
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

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches && heroSwiper.autoplay) {
  heroSwiper.autoplay.stop();
}
const handleMotionPreference = event => {
  if (!heroSwiper.autoplay) return;
  if (event.matches) {
    heroSwiper.autoplay.stop();
  } else {
    heroSwiper.autoplay.start();
  }
};
if (prefersReducedMotion.addEventListener) {
  prefersReducedMotion.addEventListener('change', handleMotionPreference);
} else if (prefersReducedMotion.addListener) {
  prefersReducedMotion.addListener(handleMotionPreference);
}

/* ===== 蜍慕判繧ｹ繝ｩ繧､繝会ｼ壼芦驕斐＃縺ｨ縺ｫ0遘偵°繧牙・逕滂ｼ・遘偵〒谺｡縺ｸ ===== */
let videoAdvanceTimer = null;

function handleSlideMedia(swiper){
  // 譌｢蟄倥ち繧､繝槭・隗｣髯､
  if (videoAdvanceTimer){ clearTimeout(videoAdvanceTimer); videoAdvanceTimer = null; }

  // 縺吶∋縺ｦ縺ｮ蜍慕判繧貞●豁｢・・Μ繧ｻ繝・ヨ
  document.querySelectorAll('.hero-slide video').forEach(v => {
    try { v.pause(); v.currentTime = 0; } catch(e){}
  });

  const active = swiper.slides[swiper.activeIndex];
  if (!active) return;

  const video = active.querySelector('video');
  if (!video){
    // 逕ｻ蜒上せ繝ｩ繧､繝会ｼ啾utoplay莉ｻ縺・    if (!swiper.autoplay.running) swiper.autoplay.start();
    return;
  }

  // 蜍慕判繧ｹ繝ｩ繧､繝会ｼ・遘偵〒谺｡縺ｸ・亥・菴薙・繝・Φ繝晉ｵｱ荳・・  if (swiper.autoplay.running) swiper.autoplay.stop();

  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.setAttribute('muted','');
  video.setAttribute('playsinline','');

  // 0遘偵°繧牙・逕・  try { video.currentTime = 0; } catch(e){}
  video.play().catch(()=>{ /* 閾ｪ蜍募・逕溷､ｱ謨励・辟｡隕厄ｼ・uted/playsinline謗ｨ螂ｨ・・*/ });

  // 5遘貞ｾ後↓谺｡縺ｸ & autoplay蜀埼幕
  videoAdvanceTimer = setTimeout(() => {
    swiper.slideNext();
    swiper.autoplay.start();
  }, 5000);
}

/* ===== .hero-text 縺ｮ鬮倥＆繧呈怙髟ｷ縺ｫ邨ｱ荳 ===== */
let eqTimer = null;

function equalizeHeroTextHeights(){
  if (eqTimer) cancelAnimationFrame(eqTimer);
  eqTimer = requestAnimationFrame(() => {
    const boxes = Array.from(document.querySelectorAll('.hero-text'));
    if (!boxes.length) return;

    // 縺・▲縺溘ｓ閾ｪ辟ｶ鬮倥＆縺ｫ謌ｻ縺・    boxes.forEach(b => b.style.height = 'auto');

    // 譛螟ｧ鬮倥＆繧呈ｸｬ繧・    const max = boxes.reduce((m, b) => Math.max(m, b.offsetHeight), 0);

    // 縺吶∋縺ｦ縺ｫ驕ｩ逕ｨ
    boxes.forEach(b => b.style.height = max + 'px');
  });
}

/* 逕ｻ蜒上ｄ蜍慕判縺ｮ隱ｭ縺ｿ霎ｼ縺ｿ繧ｿ繧､繝溘Φ繧ｰ縺ｧ繧ょ・險域ｸｬ */
window.addEventListener('load', equalizeHeroTextHeights);
window.addEventListener('resize', () => {
  if (eqTimer) cancelAnimationFrame(eqTimer);
  eqTimer = requestAnimationFrame(equalizeHeroTextHeights);
});

/* 繧ｹ繝ｩ繧､繝繝ｼ蜀・・逕ｻ蜒上・蜍慕判縺ｫ繝ｭ繝ｼ繝峨う繝吶Φ繝医ｒ蠑ｵ縺｣縺ｦ縲∬ｪｭ縺ｿ霎ｼ縺ｿ蠕後↓蜀崎ｨ域ｸｬ */
document.querySelectorAll('.hero-slide img').forEach(img => {
  if (img.complete) return; // 譌｢縺ｫ隱ｭ縺ｿ霎ｼ縺ｾ繧後※縺・ｌ縺ｰ辟｡隕・  img.addEventListener('load', equalizeHeroTextHeights, { once:true });
});
document.querySelectorAll('.hero-slide video').forEach(v => {
  // 繝｡繧ｿ諠・ｱ縺悟・縺｣縺溘ｉ鬮倥＆險域ｸｬ・医・繧ｹ繧ｿ繝ｼ陦ｨ遉ｺ蛻・ｂ蜷ｫ繧√※・・  v.addEventListener('loadedmetadata', equalizeHeroTextHeights, { once:true });
});
