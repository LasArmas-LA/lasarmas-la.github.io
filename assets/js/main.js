async function inject(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  const res = await fetch(url, { cache: "no-cache" });
  el.innerHTML = await res.text();
}
inject("header", "/partials/header.html").then(() => {
  // ここで現在ページのナビにactiveクラス付与なども可能
});
inject("footer", "/partials/footer.html").then(() => {
  const y = document.querySelector("#year");
  if (y) y.textContent = new Date().getFullYear();
});

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
