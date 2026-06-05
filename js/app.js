// Main app logic

const app = {
  isAdmin: false,
  isDark: true,
  currentSection: 'dashboard',
  logoClickCount: 0,
  logoClickTimer: null,

  init: () => {
    // Load theme
    const savedTheme = Utils.getTheme();
    app.isDark = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    app.updateThemeButton();

    // Render initial dashboard
    UI.renderDashboard();
  },

  enterApp: () => {
    Utils.removeClass('splash', 'active');
    Utils.addClass('main-app', 'active');
    app.init();
  },

  selectSection: (section) => {
    app.currentSection = section;

    // Update sidebar
    document.querySelectorAll('.sidebar-item').forEach(btn => {
      Utils.removeClass(btn, 'active');
    });
    event.target.closest('.sidebar-item')?.classList.add('active');

    // Render section
    if (section === 'dashboard') {
      UI.renderDashboard();
    } else {
      document.getElementById('main-content').innerHTML = `
        <div class="dashboard">
          <div class="page-header">
            <h2>${section.toUpperCase()}</h2>
            <p class="header-sub">In arrivo...</p>
          </div>
        </div>
      `;
    }
  },

  showLeagues: (torneoId) => {
    const torneo = UI.tornei.find(t => t.id === torneoId);
    if (!torneo) return;

    const leaguesHtml = `
      <div style="margin-top: 40px; padding-top: 40px; border-top: 2px solid var(--border);">
        <div class="page-header">
          <h2>${torneo.name} - LEGHE</h2>
        </div>
        <div class="cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
          ${torneo.leghe.map(lega => `
            <div class="card">
              <div class="card-logo" style="background: linear-gradient(135deg, ${torneo.color}40, ${torneo.color}20); height: 60px;">
                <div style="font-size: 32px;">⚽</div>
              </div>
              <div class="card-header">
                <h3 style="font-size: 12px;">${lega.name}</h3>
              </div>
              <div class="card-stats">
                <div class="stat">
                  <span class="stat-label">Squadre</span>
                  <span class="stat-value">${lega.squadre}</span>
                </div>
              </div>
              <div class="card-actions">
                <button class="action-btn primary" style="font-size: 10px; padding: 8px;" onclick="alert('Entra in: ${lega.name}')">
                  ENTRA
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const mainContent = document.getElementById('main-content');
    const leaguesSection = mainContent.querySelector('[data-leagues-section]');

    if (leaguesSection) {
      leaguesSection.innerHTML = leaguesHtml.replace('<div style="margin-top: 40px; padding-top: 40px; border-top: 2px solid var(--border);">', '<div>');
    } else {
      const newSection = document.createElement('div');
      newSection.setAttribute('data-leagues-section', 'true');
      newSection.innerHTML = leaguesHtml;
      mainContent.appendChild(newSection);
    }
  },

  handleLogoClick: () => {
    app.logoClickCount++;
    clearTimeout(app.logoClickTimer);

    if (app.logoClickCount === 3) {
      app.logoClickCount = 0;
      app.openLoginModal();
    }

    app.logoClickTimer = setTimeout(() => {
      app.logoClickCount = 0;
    }, 500);
  },

  toggleTheme: () => {
    app.isDark = !app.isDark;
    const theme = app.isDark ? 'dark' : 'light';
    Utils.setTheme(theme);
    app.updateThemeButton();
  },

  updateThemeButton: () => {
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.textContent = app.isDark ? '☀️' : '🌙';
      btn.title = app.isDark ? 'Tema chiaro' : 'Tema scuro';
    }
  },

  toggleAdmin: () => {
    if (!app.isAdmin) {
      app.openLoginModal();
    } else {
      app.isAdmin = false;
      app.updateAccediButton();
      UI.showSidebar();
      UI.renderDashboard();
    }
  },

  openLoginModal: () => {
    Utils.show('login-modal');
    setTimeout(() => {
      document.getElementById('password-input')?.focus();
    }, 100);
  },

  closeLoginModal: () => {
    Utils.hide('login-modal');
    document.getElementById('password-input').value = '';
    const errorMsg = document.getElementById('error-msg');
    if (errorMsg) Utils.hide(errorMsg);
  },

  submitLogin: () => {
    const password = document.getElementById('password-input').value;
    if (password === 'admin') {
      app.isAdmin = true;
      app.updateAccediButton();
      UI.hideSidebar();
      app.closeLoginModal();
      // Render admin panel (TBD)
      document.getElementById('main-content').innerHTML = `
        <div class="dashboard">
          <div class="page-header">
            <h2>PANNELLO ADMIN</h2>
            <p class="header-sub">In arrivo...</p>
          </div>
        </div>
      `;
    } else {
      const errorMsg = document.getElementById('error-msg');
      errorMsg.textContent = 'Password errata';
      Utils.show(errorMsg);
      document.getElementById('password-input').value = '';
    }
  },

  updateAccediButton: () => {
    const btn = document.getElementById('accedi-btn');
    if (app.isAdmin) {
      btn.textContent = '✓ ACCEDI';
      Utils.addClass(btn, 'active');
    } else {
      btn.textContent = '🔐 ACCEDI';
      Utils.removeClass(btn, 'active');
    }
  },
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Page system
  document.querySelectorAll('.page').forEach(page => {
    Utils.addClass(page, 'hidden');
  });
  Utils.addClass('splash', 'active');
});
