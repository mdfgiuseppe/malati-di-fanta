// UI rendering

const UI = {
  // Tournament data (hardcoded for now - will load from GSheets)
  tornei: [
    {
      id: 1,
      name: 'Tana dei Mister',
      color: '#3b82f6',
      tags: ['TDM', 'CLASSIC'],
      clubCount: 120,
      leghe: [
        { id: 1, name: 'Lega 1', squadre: 8 },
        { id: 2, name: 'Lega 2', squadre: 8 },
        { id: 3, name: 'Lega 3', squadre: 8 },
      ]
    },
    {
      id: 2,
      name: 'Scudetto Slim',
      color: '#10b981',
      tags: ['SLIM', 'MANTRA'],
      clubCount: 80,
      leghe: [
        { id: 4, name: 'Lega Principale', squadre: 12 },
        { id: 5, name: 'Lega B', squadre: 12 },
      ]
    },
    {
      id: 3,
      name: 'Torneo Semi Manageriale',
      color: '#f59e0b',
      tags: ['TSM', 'CLASSIC'],
      clubCount: 10,
      leghe: [
        { id: 6, name: 'Principale', squadre: 10 },
      ]
    },
  ],

  menuItems: [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'leghe', name: 'Leghe', icon: '⚽' },
    { id: 'tornei', name: 'Tornei', icon: '🏆' },
    { id: 'coppe', name: 'Coppe', icon: '👑' },
  ],

  renderDashboard: () => {
    const html = `
      <div class="dashboard">
        <div class="page-header">
          <h2>SCEGLI IL TORNEO</h2>
          <p class="header-sub">Seleziona un torneo per visualizzare le leghe disponibili · Solo su invito</p>
        </div>
        <div class="cards-grid" id="tornei-grid">
          ${UI.tornei.map(torneo => UI.renderTournamentCard(torneo)).join('')}
        </div>
      </div>
    `;
    document.getElementById('main-content').innerHTML = html;
  },

  renderTournamentCard: (torneo) => {
    return `
      <div class="card" style="border-top-color: ${torneo.color}">
        <div class="card-logo" style="background: linear-gradient(135deg, ${torneo.color}40, ${torneo.color}20)">
          <img src="logo.png" alt="${torneo.name}">
        </div>
        <div class="card-header">
          <h3>${torneo.name}</h3>
          <div class="card-tags">
            ${torneo.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
        <div class="card-stats">
          <div class="stat">
            <span class="stat-label">Leghe</span>
            <span class="stat-value">${torneo.leghe.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Club partecipanti</span>
            <span class="stat-value">${torneo.clubCount}</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="action-btn primary" onclick="app.showLeagues(${torneo.id})">
            📊 VISUALIZZA LEGHE →
          </button>
          <div class="action-row">
            <button class="action-btn secondary">📋 REGOLAMENTO</button>
            <button class="action-btn secondary">🏆 ALBO D'ORO</button>
          </div>
        </div>
      </div>
    `;
  },

  renderSidebar: () => {
    const menu = document.getElementById('sidebar-menu');
    menu.innerHTML = UI.menuItems.map(item => `
      <button class="sidebar-item${item.id === 'dashboard' ? ' active' : ''}" onclick="app.selectSection('${item.id}')">
        ${item.icon} ${item.name}
      </button>
    `).join('');
  },

  hideSidebar: () => {
    Utils.hide('sidebar');
  },

  showSidebar: () => {
    Utils.show('sidebar');
  },
};

// Initialize sidebar
document.addEventListener('DOMContentLoaded', () => {
  UI.renderSidebar();
});
