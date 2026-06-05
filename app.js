const app = {
  init() {
    console.log('✅ Admin panel caricato');
    this.setupBurgerMenu();
    this.setupNavigation();
    this.renderUtenti();
  },

  setupBurgerMenu() {
    const burger = document.getElementById('burger-menu');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    burger?.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    });

    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });

    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
      });
    });
  },

  setupNavigation() {
    document.querySelectorAll('.sidebar-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const section = e.target.closest('button').getAttribute('data-section');
        this.selectSection(section);
      });
    });
  },

  selectSection(section) {
    document.querySelectorAll('.sidebar-item').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`section-${section}`).classList.add('active');
  },

  renderUtenti() {
    const utenti = [
      { nome: 'Mario Rossi', email: 'mario@example.com', ruolo: 'admin', stato: 'Attivo' },
      { nome: 'Giovanni Bianchi', email: 'giovanni@example.com', ruolo: 'utente', stato: 'Attivo' },
      { nome: 'Luca Verdi', email: 'luca@example.com', ruolo: 'utente', stato: 'Inattivo' }
    ];

    const html = utenti.map(u => `
      <tr>
        <td>${u.nome}</td>
        <td>${u.email}</td>
        <td>${u.ruolo}</td>
        <td>${u.stato}</td>
      </tr>
    `).join('');

    document.getElementById('utenti-list').innerHTML = html;
  }
};

document.addEventListener('DOMContentLoaded', () => app.init());
