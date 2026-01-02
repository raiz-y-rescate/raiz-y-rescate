// --- PWA ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/raiz-y-rescate/sw.js").catch(() => {});
  });
}

// --- Language Toggle (EN/ES) ---
(function () {
  const saved = localStorage.getItem("ryr_lang");
  const initial = saved || "en";
  document.documentElement.setAttribute("data-ui-lang", initial);

  function setLang(lang) {
    document.documentElement.setAttribute("data-ui-lang", lang);
    localStorage.setItem("ryr_lang", lang);

    const enBtn = document.querySelector('[data-set-lang="en"]');
    const esBtn = document.querySelector('[data-set-lang="es"]');
    if (enBtn) enBtn.setAttribute("aria-pressed", String(lang === "en"));
    if (esBtn) esBtn.setAttribute("aria-pressed", String(lang === "es"));
  }

  window.addEventListener("DOMContentLoaded", () => {
    const enBtn = document.querySelector('[data-set-lang="en"]');
    const esBtn = document.querySelector('[data-set-lang="es"]');
    if (enBtn) enBtn.addEventListener("click", () => setLang("en"));
    if (esBtn) esBtn.addEventListener("click", () => setLang("es"));
    setLang(initial);
  });
})();
