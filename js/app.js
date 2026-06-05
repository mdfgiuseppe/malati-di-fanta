// ═══════════════════════════════════════════════════════
// APP - Logica principale
// ═══════════════════════════════════════════════════════

const app = {
  isAdmin: false,
  logoClickCount: 0,
  logoClickTimer: null,

  // Dati locali (hardcoded per test, poi da GSheets)
  tornei: [
    {
      id: 1,
      name: 'Tana dei Mister',
      icon: '🏆',
      stats: [
        { label: 'Leghe', value: 3 },
        { label: 'Club', value: 120 }
      ]
    },
    {
      id: 2,
      name: 'Scudetto Slim',
      icon: '⚽',
      stats: [
        { label: 'Leghe', value: 2 },
        { label: 'Club', value: 80 }
      ]
    },
    {
      id: 3,
      name: 'TSM',
      icon: '👑',
      stats: [
        { label: 'Leghe', value: 1 },
        { label: 'Club', value: 10 }
      ]
    }
  ],

  init() {
    console.log('📱 App inizializzato');

    // Event listeners
    document.getElementById('logo-btn').addEventListener('click', () => this.handleLogoClick());
    document.getElementById('theme-btn').addEventListener('click', () => this.toggleTheme());

    // Sidebar
    document.querySelectorAll('.sidebar-item').forEach(btn => {
      btn.addEventListener('click', (e) => this.selectSection(e.target.getAttribute('data-section')));
    });

    // Enter key in login
    document.getElementById('login-pwd').addEventListener('keyup', (e) => {
      if (e.key === 'Enter') this.submitLogin();
    });

    // Render dashboard
    this.showDashboard();
  },

  handleLogoClick() {
    this.logoClickCount++;
    clearTimeout(this.logoClickTimer);

    if (this.logoClickCount === 3) {
      this.openLogin();
    }

    this.logoClickTimer = setTimeout(() => {
      this.logoClickCount = 0;
    }, 500);
  },

  toggleTheme() {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    document.getElementById('theme-btn').textContent = theme === 'dark' ? '☀️' : '🌙';
  },

  selectSection(section) {
    // Update sidebar
    document.querySelectorAll('.sidebar-item').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Update sections
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`section-${section}`).classList.add('active');

    // Render content
    if (section === 'dashboard') {
      this.showDashboard();
    } else if (section === 'leghe') {
      // Passa primo torneo come default
      this.showLeghe(this.tornei[0]);
    } else if (section === 'admin') {
      this.showAdmin();
    }
  },

  showDashboard() {
    const grid = document.getElementById('tornei-grid');
    grid.innerHTML = this.tornei.map(t => `
      <div class="card" onclick="app.selectTorneo(${t.id})">
        <div class="card-logo">
          <span style="font-size: 48px;">${t.icon}</span>
        </div>
        <div class="card-body">
          <div class="card-name">${t.name}</div>
          ${t.stats.map(s => `
            <div class="card-stat">
              <span>${s.label}</span>
              <strong>${s.value}</strong>
            </div>
          `).join('')}
          <button class="card-action" onclick="app.selectTorneo(${t.id}); event.stopPropagation();">
            Visualizza Leghe →
          </button>
        </div>
      </div>
    `).join('');
  },

  selectTorneo(torneoId) {
    const torneo = this.tornei.find(t => t.id === torneoId);
    document.querySelector('[data-section="leghe"]').click();
  },

  showLeghe(torneo) {
    document.getElementById('leghe-title').textContent = `Leghe - ${torneo.name}`;
    const grid = document.getElementById('leghe-grid');
    grid.innerHTML = `
      <div style="grid-column: 1/-1; padding: 20px; background: var(--bg3); border-radius: 12px; text-align: center;">
        <p style="color: var(--text2); margin-bottom: 12px;">Leghe di <strong>${torneo.name}</strong></p>
        <p style="font-size: 12px; color: var(--text3);">In arrivo...</p>
      </div>
    `;
  },

  showAdmin() {
    if (!this.isAdmin) {
      document.getElementById('admin-content').innerHTML = '<p style="color: var(--text2);">Accedi per vedere il pannello admin</p>';
      return;
    }

    document.getElementById('admin-content').innerHTML = `
      <div style="background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 16px;">
        <p style="color: var(--text2);">Benvenuto admin! 🎉</p>
        <p style="font-size: 12px; color: var(--text3); margin-top: 8px;">Sezioni: Utenti, Richieste, Squadre, Dati</p>
      </div>
    `;
  },

  openLogin() {
    document.getElementById('login-modal').style.display = 'flex';
    document.getElementById('login-pwd').focus();
  },

  closeLogin() {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('login-pwd').value = '';
    document.getElementById('login-error').textContent = '';
  },

  submitLogin() {
    const pwd = document.getElementById('login-pwd').value;

    if (pwd === 'admin') {
      this.isAdmin = true;
      this.closeLogin();
      this.showAdmin();
      console.log('✅ Admin attivato');
    } else {
      document.getElementById('login-error').textContent = 'Password errata';
    }
  }
};

// Init quando DOM è pronto
document.addEventListener('DOMContentLoaded', () => app.init());
