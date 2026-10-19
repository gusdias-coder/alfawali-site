const selector = document.querySelector<HTMLSelectElement>('[data-theme-select]');
if (selector) {
  selector.value = document.documentElement.dataset.theme || 'system';
  selector.closest<HTMLElement>('[data-theme-control]')!.hidden = false;
  selector.addEventListener('change', () => {
    const preference = selector.value;
    if (preference === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = preference;
    // Sem atributo, prefers-color-scheme acompanha mudanças do dispositivo.
    try {
      if (preference === 'system') localStorage.removeItem('alfawali:theme');
      else localStorage.setItem('alfawali:theme', preference);
    } catch { /* A escolha continua funcionando nesta página. */ }
  });
}
