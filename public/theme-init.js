// Executado antes da primeira pintura. Mantém a CSP sem scripts inline.
(() => {
  try {
    const preference = localStorage.getItem('alfawali:theme');
    if (preference === 'light' || preference === 'dark') document.documentElement.dataset.theme = preference;
  } catch { /* Sem armazenamento, o CSS acompanha o dispositivo. */ }
})();
