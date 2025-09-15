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

(function themeBoot(){
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");          // "light" | "dark" | null
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

  // 初期テーマ
  if (saved === "light")      root.setAttribute("data-theme", "light");
  else if (saved === "dark")  root.setAttribute("data-theme", "dark");
  else                        root.removeAttribute("data-theme"); // OSに従う

  // トグル
  function apply(theme){      // "light" or "dark"
    if (theme === "light"){ root.setAttribute("data-theme","light"); localStorage.setItem("theme","light"); }
    else{ root.setAttribute("data-theme","dark"); localStorage.setItem("theme","dark"); }
    // a11y状態
    const btn = document.getElementById("theme-toggle");
    if (btn){ btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false"); btn.textContent = theme === "dark" ? "🌙" : "☀️"; }
    // Chart.js などの再配色用カスタムイベント（必要なページだけ拾えばOK）
    window.dispatchEvent(new CustomEvent("themechange", { detail:{ theme } }));
  }

  // ヘッダー注入後にボタンへイベント付与
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    // 初期表示のアイコン
    const now = root.getAttribute("data-theme") || (prefersLight ? "light":"dark");
    btn.setAttribute("aria-pressed", now === "dark" ? "true" : "false");
    btn.textContent = now === "dark" ? "🌙" : "☀️";

    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || (prefersLight ? "light":"dark");
      apply(current === "light" ? "dark" : "light");
    });
  });
})();

// 注入（どの階層から読んでもOK）
inject("header", "/partials/header.html");
inject("footer", "/partials/footer.html");

// クリック不能対策（Hero画像が覆う事故の保険）
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".hero img, .hero video").forEach(el => {
    el.style.pointerEvents = "none";
  });
});