const root = document.documentElement;
const versionToken = (() => {
  const script = document.currentScript;
  if (!script) return "v0";
  if (script.dataset?.v) return script.dataset.v;
  const src = script.getAttribute("src");
  if (src && src.includes("?")) return src.split("?")[1];
  return "v0";
})();

applyTheme(getStartTheme());
inject("header", "/partials/header.html");
inject("footer", "/partials/footer.html");

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".hero img, .hero video").forEach(el => {
    el.style.pointerEvents = "none";
  });
});

async function inject(targetId, partialPath) {
  const mount = document.getElementById(targetId);
  if (!mount) return;

  const url = new URL(partialPath, location.origin);
  const cacheKey = versionToken ? `${url.pathname}?${versionToken}` : url.pathname;
  const res = await fetch(cacheKey, { cache: "no-store" });
  if (!res.ok) return;

  mount.innerHTML = await res.text();
  hydratePartial(mount, targetId);
}

function hydratePartial(rootEl, targetId) {
  const year = rootEl.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  markActiveNav(rootEl);

  if (targetId === "header") initHeaderInteractions();
}

function markActiveNav(scope) {
  const here = location.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "");
  scope.querySelectorAll('nav a[href]').forEach(link => {
    const path = new URL(link.getAttribute("href"), location.origin).pathname
      .replace(/\/index\.html$/, "")
      .replace(/\/$/, "");
    if (path === here) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

let headerInitDone = false;
function initHeaderInteractions() {
  if (headerInitDone) return;
  headerInitDone = true;
  initThemeToggle();
  initNavToggle();
}

function getStartTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const button = document.getElementById("theme-toggle");
  if (button) {
    button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    button.textContent = theme === "dark" ? "🌙" : "☀️";
  }
  window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
}

function initThemeToggle() {
  const button = document.getElementById("theme-toggle");
  if (!button) return;
  const current = root.getAttribute("data-theme") || getStartTheme();
  button.setAttribute("aria-pressed", current === "dark" ? "true" : "false");
  button.textContent = current === "dark" ? "🌙" : "☀️";
  button.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
  });
}

function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  const mq = window.matchMedia("(min-width: 769px)");

  const setState = expanded => {
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    nav.dataset.collapsed = expanded ? "false" : "true";
  };

  setState(mq.matches);

  const handleMediaChange = event => setState(event.matches);
  if (mq.addEventListener) {
    mq.addEventListener("change", handleMediaChange);
  } else if (mq.addListener) {
    mq.addListener(handleMediaChange);
  }

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    setState(!expanded);
  });

  nav.querySelectorAll("a[href]").forEach(link => {
    link.addEventListener("click", () => {
      if (!mq.matches) setState(false);
    });
  });

  document.addEventListener("click", event => {
    if (mq.matches) return;
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
      setState(false);
    }
  });
}
if ('serviceWorker' in navigator && !window.__lasarmasSWRegistered) {
  window.__lasarmasSWRegistered = true;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
