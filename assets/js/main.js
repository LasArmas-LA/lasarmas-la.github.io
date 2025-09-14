// /assets/js/main.js
async function inject(id, path) {
  const mount = document.getElementById(id);
  if (!mount) return;

  const v = document.currentScript?.dataset?.v || Date.now();
  const url = new URL(path, location.origin); // ここが重要（どこからでも同じオリジンに取りにいく）
  const res = await fetch(url.pathname + `?v=${v}`, { cache: "no-store" });

  if (!res.ok) { mount.innerHTML = ""; return; }
  mount.innerHTML = await res.text();

  // ナビのactive付与（/index.html を同一視／末尾スラッシュも吸収）
  const here = location.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "");
  mount.querySelectorAll('nav a[href]').forEach(a => {
    const p = new URL(a.getAttribute('href'), location.origin).pathname
                 .replace(/\/index\.html$/, "").replace(/\/$/, "");
    if (p === here) { a.setAttribute("aria-current", "page"); a.classList.add("active"); }
  });
}

inject("header", "/partials/header.html");
inject("footer", "/partials/footer.html");
