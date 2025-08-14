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
