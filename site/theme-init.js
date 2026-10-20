// Apply a saved preference before styles are painted, including on direct visits.
(() => {
  let theme='dark';
  try { if(localStorage.getItem('rx-theme')==='light')theme='light'; } catch {}
  document.documentElement.dataset.theme=theme;
  document.documentElement.style.colorScheme=theme;
})();
