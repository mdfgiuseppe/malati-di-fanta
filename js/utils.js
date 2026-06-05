// UTILS - Funzioni di utilità
const Utils = {
  setStorage(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  getStorage(key) { const item = localStorage.getItem(key); return item ? JSON.parse(item) : null; },
  removeStorage(key) { localStorage.removeItem(key); },
  setTheme(theme) { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('theme', theme); },
  getTheme() { return localStorage.getItem('theme') || 'dark'; }
};
