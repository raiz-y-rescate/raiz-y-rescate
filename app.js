// Minimal PWA/Offline prep
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/raiz-y-rescate/sw.js").catch(() => {});
  });
}
