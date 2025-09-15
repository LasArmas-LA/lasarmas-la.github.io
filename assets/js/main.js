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





/* ================================
   共通パーツ注入
================================ */
async function inject(targetId, path) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) return;
  el.innerHTML = await res.text();

  // 年号
  const y = el.querySelector("#year");
  if (y) y.textContent = new Date().getFullYear();

  // ナビ active
  const here = location.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "");
  el.querySelectorAll('nav a[href]').forEach(a => {
    const p = new URL(a.getAttribute("href"), location.origin).pathname
      .replace(/\/index\.html$/, "").replace(/\/$/, "");
    if (p === here) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  // ヘッダー注入完了後にテーマボタンを初期化
  if (targetId === "header") initThemeToggle();
}

// 呼び出し
inject("header", "/partials/header.html");
inject("footer", "/partials/footer.html");

/* ================================
   テーマ切替（ライト／ダーク）
   - ヘッダー注入後でも確実に初期化
================================ */
const root = document.documentElement;

function getStartTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);                 // CSS切替
  localStorage.setItem("theme", theme);                   // 保存
  const btn = document.getElementById("theme-toggle");    // UI更新
  if (btn) {
    btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    btn.textContent = theme === "dark" ? "🌙" : "☀️";
  }
  // グラフ等に通知したい場合のイベント
  window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
}

// ページ読込時にまずテーマを適用（ヘッダーより先にやってOK）
applyTheme(getStartTheme());

function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return; // ヘッダーまだ無い場合は何もしない
  // 初期表示
  const now = root.getAttribute("data-theme") || getStartTheme();
  btn.setAttribute("aria-pressed", now === "dark" ? "true" : "false");
  btn.textContent = now === "dark" ? "🌙" : "☀️";
  // クリックで切替
  btn.onclick = () => {
    const next = (root.getAttribute("data-theme") === "light") ? "dark" : "light";
    applyTheme(next);
  };
}

/* フォールバック：万一注入前にDOMContentLoadedが先に走っても、
   ヘッダー挿入後に initThemeToggle() が呼ばれるのでOK */