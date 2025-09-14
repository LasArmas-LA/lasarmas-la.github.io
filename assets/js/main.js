async function inject(targetId, partialPath) {
  const mount = document.getElementById(targetId);
  if (!mount) return;

  const v = document.currentScript?.dataset?.v || "v0";
  const url = new URL(partialPath, location.origin);

  const res = await fetch(url.pathname + `?${v}`, { cache: "no-store" });
  if (!res.ok) return;

  mount.innerHTML = await res.text();

  // 動的year
  const y = mount.querySelector("#year");
  if (y) y.textContent = new Date().getFullYear();

  // 現在ページに active を付与（/index.html と末尾 / を同一視）
  const here = location.pathname
    .replace(/\/index\.html$/, "")
    .replace(/\/$/, "");

  mount.querySelectorAll('nav a[href]').forEach(a => {
    const p = new URL(a.getAttribute("href"), location.origin).pathname
      .replace(/\/index\.html$/, "")
      .replace(/\/$/, "");
    if (p === here) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });
}

// 注入（どの階層から読んでもOK）
inject("header", "/partials/header.html");
inject("footer", "/partials/footer.html");

// クリック不能対策（Hero画像が覆う事故の保険）
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".hero img, .hero video").forEach(el => {
    el.style.pointerEvents = "none";
  });
});