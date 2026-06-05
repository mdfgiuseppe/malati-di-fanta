// App - Versione 1 (Hello World)
const app = {
  tornei: [
    { id: 1, nome: 'Tana dei Mister', icon: '🏆' },
    { id: 2, nome: 'Scudetto Slim', icon: '⚽' },
    { id: 3, nome: 'TSM', icon: '👑' }
  ],

  init() {
    console.log('✅ App caricato');
    this.render();
  },

  render() {
    const html = `
      <div style="max-width: 600px;">
        ${this.tornei.map(t => `
          <div class="card">
            <span style="font-size: 32px;">${t.icon}</span>
            <div style="margin-top: 10px;"><strong>${t.nome}</strong></div>
            <button onclick="app.selectTorneo(${t.id})">Visualizza →</button>
          </div>
        `).join('')}
      </div>
    `;
    document.getElementById('app').innerHTML = html;
  },

  selectTorneo(id) {
    const torneo = this.tornei.find(t => t.id === id);
    alert('Hai selezionato: ' + torneo.nome);
  }
};

// Avvia quando DOM è pronto
document.addEventListener('DOMContentLoaded', () => app.init());
