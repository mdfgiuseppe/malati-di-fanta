// Utility functions

const Utils = {
  // Show/hide elements
  show: (el) => {
    if (typeof el === 'string') el = document.getElementById(el);
    if (el) el.style.display = '';
  },

  hide: (el) => {
    if (typeof el === 'string') el = document.getElementById(el);
    if (el) el.style.display = 'none';
  },

  addClass: (el, className) => {
    if (typeof el === 'string') el = document.getElementById(el);
    if (el) el.classList.add(className);
  },

  removeClass: (el, className) => {
    if (typeof el === 'string') el = document.getElementById(el);
    if (el) el.classList.remove(className);
  },

  toggleClass: (el, className) => {
    if (typeof el === 'string') el = document.getElementById(el);
    if (el) el.classList.toggle(className);
  },

  // Storage
  setStorage: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  },

  getStorage: (key, defaultValue = null) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
      console.error('Storage error:', e);
      return defaultValue;
    }
  },

  removeStorage: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage error:', e);
    }
  },

  // Theme
  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    Utils.setStorage('theme', theme);
  },

  getTheme: () => {
    return Utils.getStorage('theme', 'dark');
  },

  // Debounce
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Format currency
  formatCurrency: (value) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  }
};
