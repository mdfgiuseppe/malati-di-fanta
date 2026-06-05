const app = {
  users: [
    { nome: 'Mario Rossi', email: 'mario@example.com', ruolo: 'admin', stato: 'Attivo' },
    { nome: 'Giovanni Bianchi', email: 'giovanni@example.com', ruolo: 'utente', stato: 'Attivo' },
    { nome: 'Luca Verdi', email: 'luca@example.com', ruolo: 'utente', stato: 'Inattivo' }
  ],
  currentUser: null,
  pendingRequests: [],
  scriptsUrl: 'https://script.google.com/macros/s/AKfycbwJ3ekDa1nxHu0irViJhBFsFZTYubaC6hApb5z0eSVnuDbhJMiuzQcgyI1ANW7jItgQ/exec',

  init() {
    console.log('✅ Admin panel caricato');
    this.setupBurgerMenu();
    this.setupNavigation();
    this.setupLogin();
    this.setupAddUtente();
    this.renderUtenti();
    this.updateUI();
    this.loadPendingRequests();
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

  setupLogin() {
    const modal = document.getElementById('modal-login');
    const btnLogin = document.getElementById('btn-login');
    const btnLoginSubmit = document.getElementById('btn-login-submit');
    const btnLogout = document.getElementById('btn-logout');
    const togglePassword = document.getElementById('toggle-password');
    const loginPassword = document.getElementById('login-password');

    btnLogin?.addEventListener('click', () => {
      modal.style.display = 'flex';
    });

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
      }
    });

    togglePassword?.addEventListener('click', (e) => {
      e.preventDefault();
      const type = loginPassword.type === 'password' ? 'text' : 'password';
      loginPassword.type = type;
      togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });

    btnLoginSubmit?.addEventListener('click', () => {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      if (email && password) {
        this.currentUser = { email, nome: email.split('@')[0] };
        modal.style.display = 'none';
        this.updateUI();
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
      }
    });

    btnLogout?.addEventListener('click', () => {
      this.currentUser = null;
      this.updateUI();
    });
  },

  setupAddUtente() {
    const btn = document.getElementById('btn-add-utente');
    btn?.addEventListener('click', () => {
      const nome = document.getElementById('input-nome').value;
      const username = document.getElementById('input-username').value;
      const password = document.getElementById('input-password').value;
      const lega = document.getElementById('input-lega').value;

      if (nome && username && password && lega) {
        this.users.push({
          nome: nome,
          email: `${username}@malati-di-fanta.com`,
          ruolo: 'utente',
          stato: 'Attivo'
        });
        this.renderUtenti();
        document.getElementById('input-nome').value = '';
        document.getElementById('input-username').value = '';
        document.getElementById('input-password').value = '';
        document.getElementById('input-lega').value = '';
      }
    });
  },

  renderUtenti() {
    const html = this.users.map(u => `
      <tr>
        <td>${u.nome}</td>
        <td>${u.email}</td>
        <td>${u.ruolo}</td>
        <td>${u.stato}</td>
      </tr>
    `).join('');

    document.getElementById('utenti-list').innerHTML = html;
  },

  updateUI() {
    const btnLogin = document.getElementById('btn-login');
    const btnLogout = document.getElementById('btn-logout');
    const statusText = document.getElementById('status-text');

    if (this.currentUser) {
      btnLogin.style.display = 'none';
      btnLogout.style.display = 'block';
      statusText.textContent = 'online';
      statusText.parentElement.querySelector('span').style.background = '#10b981';
    } else {
      btnLogin.style.display = 'block';
      btnLogout.style.display = 'none';
      statusText.textContent = 'offline';
      statusText.parentElement.querySelector('span').style.background = '#6b7280';
    }
  },

  loadPendingRequests() {
    const script = document.createElement('script');
    script.src = this.scriptsUrl + '?callback=app.handlePendingRequests';
    document.head.appendChild(script);
  },

  handlePendingRequests(data) {
    this.pendingRequests = data;
    const count = document.getElementById('pending-count');
    const msg = document.getElementById('pending-msg');

    if (count) count.textContent = data.length;
    if (msg) {
      if (data.length === 0) {
        msg.textContent = 'Nessuna richiesta pendente';
      } else {
        msg.innerHTML = `<strong>${data.length}</strong> richiesta${data.length > 1 ? 'e' : ''} in sospeso`;
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => app.init());
window.app = app;
