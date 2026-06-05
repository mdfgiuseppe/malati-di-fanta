<template>
  <div class="dashboard">
    <div class="page-header">
      <h2>SCEGLI IL TORNEO</h2>
      <p class="header-sub">Seleziona un torneo per visualizzare le leghe disponibili · Solo su invito</p>
    </div>

    <!-- Empty state message -->
    <div v-if="tornei.length === 0" class="empty-state">
      <p>Nessun torneo disponibile</p>
    </div>

    <div class="tournaments-grid">
      <div v-for="torneo in tornei" :key="torneo.id" class="tournament-card" :style="{ borderTopColor: torneo.color, '--card-gradient': torneo.gradientBg }">
        <div class="card-logo" :style="{ background: `linear-gradient(135deg, ${torneo.color}40, ${torneo.color}20)` }">
          <img :src="torneo.logo" :alt="torneo.name">
        </div>

        <div class="card-header">
          <h3>{{ torneo.name }}</h3>
          <div class="card-tags">
            <span v-for="tag in torneo.tags" :key="tag" class="tag" :class="getTagClass(tag)">
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="card-stats">
          <div class="stat">
            <span class="stat-label">Leghe</span>
            <span class="stat-value">{{ torneo.leaguesList.length }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Club partecipanti</span>
            <span class="stat-value">{{ torneo.clubCount }}</span>
          </div>
        </div>

        <div class="card-actions">
          <button class="action-btn primary" @click="selectTournament(torneo)">
            📊 VISUALIZZA LEGHE →
          </button>
          <div class="action-row">
            <button class="action-btn secondary" title="Regolamento">
              📋 REGOLAMENTO
            </button>
            <button class="action-btn secondary" title="Albo d'oro">
              🏆 ALBO D'ORO
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SEZIONE LEGHE (quando si seleziona un torneo) -->
    <div v-if="selectedTournament" class="leagues-section">
      <div class="section-header">
        <button class="back-btn" @click="selectedTournament = null">← Indietro</button>
        <h2>{{ selectedTournament.name }} - LEGHE</h2>
      </div>

      <div class="leagues-grid">
        <div v-for="lega in selectedTournament.leghe" :key="lega.id" class="league-card">
          <div class="league-icon">⚽</div>
          <h4>{{ lega.name }}</h4>
          <p class="league-info">{{ lega.squadre }} squadre</p>
          <button class="league-btn" @click="selectLeague(selectedTournament, lega)">
            Entra
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const tornei = ref([
      {
        id: 1,
        name: 'Tana dei Mister',
        logo: '/logo.png',
        color: '#3b82f6',
        gradientBg: 'rgba(59, 130, 246, 0.1)',
        tags: ['TDM', 'CLASSIC'],
        clubCount: 120,
        leaguesList: [
          { id: 1, name: 'Lega 1', squadre: 8 },
          { id: 2, name: 'Lega 2', squadre: 8 },
          { id: 3, name: 'Lega 3', squadre: 8 },
          { id: 4, name: 'Lega 4', squadre: 8 },
          { id: 5, name: 'Lega 5', squadre: 8 },
        ]
      },
      {
        id: 2,
        name: 'Scudetto Slim',
        logo: '/logo.png',
        color: '#10b981',
        gradientBg: 'rgba(16, 185, 129, 0.1)',
        tags: ['SLIM', 'MANTRA'],
        clubCount: 80,
        leaguesList: [
          { id: 6, name: 'Lega Principale', squadre: 12 },
          { id: 7, name: 'Lega B', squadre: 12 },
          { id: 8, name: 'Lega C', squadre: 12 },
        ]
      },
      {
        id: 3,
        name: 'Torneo Semi Manageriale',
        logo: '/logo.png',
        color: '#f59e0b',
        gradientBg: 'rgba(245, 158, 11, 0.1)',
        tags: ['TSM', 'CLASSIC'],
        clubCount: 10,
        leaguesList: [
          { id: 9, name: 'Principale', squadre: 10 },
        ]
      },
      {
        id: 4,
        name: 'International League Mantra',
        logo: '/logo.png',
        color: '#8b5cf6',
        gradientBg: 'rgba(139, 92, 246, 0.1)',
        tags: ['ILM', 'MANTRA'],
        clubCount: 27,
        leaguesList: [
          { id: 10, name: 'Girone A', squadre: 14 },
          { id: 11, name: 'Girone B', squadre: 13 },
        ]
      },
      {
        id: 5,
        name: 'International League Classic',
        logo: '/logo.png',
        color: '#ec4899',
        gradientBg: 'rgba(236, 72, 153, 0.1)',
        tags: ['ILC', 'CLASSIC'],
        clubCount: 15,
        leaguesList: [
          { id: 12, name: 'Principale', squadre: 15 },
        ]
      },
    ])

    const selectedTournament = ref(null)

    const getTagClass = (tag) => {
      const tagClasses = {
        'CLASSIC': 'tag-blue',
        'MANTRA': 'tag-green',
        'SLIM': 'tag-cyan',
        'TDM': 'tag-purple',
        'TSM': 'tag-orange',
        'ILM': 'tag-pink',
        'ILC': 'tag-red',
      }
      return tagClasses[tag] || 'tag-default'
    }

    const selectTournament = (torneo) => {
      selectedTournament.value = torneo
    }

    const selectLeague = (torneo, lega) => {
      console.log('Selected league:', { torneo: torneo.name, lega: lega.name })
      // Qui si aprirebbe la pagina della lega
    }

    return {
      tornei,
      selectedTournament,
      getTagClass,
      selectTournament,
      selectLeague
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 16px;
}

@media (min-width: 768px) {
  .dashboard {
    padding: 24px;
  }
}

.page-header {
  margin-bottom: 24px;
}

@media (min-width: 768px) {
  .page-header {
    margin-bottom: 40px;
  }
}

.page-header h2 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 20px;
  letter-spacing: 1.5px;
  color: var(--text);
  margin-bottom: 6px;
}

@media (min-width: 768px) {
  .page-header h2 {
    font-size: 28px;
    letter-spacing: 2px;
  }
}

.header-sub {
  color: var(--text2);
  font-size: 12px;
}

@media (min-width: 768px) {
  .header-sub {
    font-size: 13px;
  }
}

/* TOURNAMENT CARDS GRID */
.tournaments-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 40px;
}

/* Tablet: 2 colonne */
@media (min-width: 768px) {
  .tournaments-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

/* Desktop: 3+ colonne */
@media (min-width: 1024px) {
  .tournaments-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }
}

.tournament-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border-top: 4px solid var(--green);
}

.tournament-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.card-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1));
  border-bottom: 1px solid var(--border);
  padding: 16px;
  position: relative;
  overflow: hidden;
}

@media (min-width: 768px) {
  .card-logo {
    height: 140px;
    padding: 20px;
  }
}

.card-logo::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.05), transparent);
  pointer-events: none;
}

.card-logo img {
  height: 80px;
  width: auto;
  object-fit: contain;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}

@media (min-width: 768px) {
  .card-logo img {
    height: 110px;
  }
}

.card-header {
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.card-header h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 14px;
  letter-spacing: 0.8px;
  color: var(--text);
  margin-bottom: 8px;
}

@media (min-width: 768px) {
  .card-header h3 {
    font-size: 16px;
    letter-spacing: 1px;
  }
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--bg3);
  color: var(--text2);
}

.tag-blue {
  background: rgba(59, 130, 246, 0.12);
  color: var(--blue);
}

.tag-green {
  background: rgba(16, 185, 129, 0.12);
  color: var(--green);
}

.tag-cyan {
  background: rgba(34, 211, 238, 0.12);
  color: #22d3ee;
}

.tag-purple {
  background: rgba(139, 92, 246, 0.12);
  color: #a78bfa;
}

.tag-orange {
  background: rgba(245, 158, 11, 0.12);
  color: var(--gold);
}

.tag-pink {
  background: rgba(236, 72, 153, 0.12);
  color: #f472b6;
}

.tag-red {
  background: rgba(239, 68, 68, 0.12);
  color: var(--red);
}

.card-stats {
  padding: 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stat {
  flex: 1;
}

.stat-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--text2);
  display: block;
  margin-bottom: 4px;
}

.stat-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 18px;
  letter-spacing: 1px;
  color: var(--text);
}

.card-actions {
  padding: 12px;
  background: rgba(16, 185, 129, 0.05);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  padding: 12px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--text2);
  cursor: pointer;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.5px;
  transition: all 0.2s;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .action-btn {
    padding: 10px 12px;
    min-height: auto;
  }
}

.action-btn:hover {
  color: var(--text);
  border-color: var(--green);
}

.action-btn:active {
  transform: scale(0.98);
}

.action-btn.primary {
  background: var(--green);
  color: #000;
  border-color: var(--green);
}

.action-btn.primary:hover {
  opacity: 0.9;
}

.action-btn.primary:active {
  transform: scale(0.96);
}

.action-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.action-btn.secondary {
  background: transparent;
  color: var(--green);
}

/* LEAGUES SECTION */
.leagues-section {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 2px solid var(--border);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.back-btn {
  padding: 8px 16px;
  background: var(--card2);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.back-btn:hover {
  background: var(--card);
  color: var(--green);
  border-color: var(--green);
}

.section-header h2 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 24px;
  letter-spacing: 2px;
  color: var(--text);
}

.leagues-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.league-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}

.league-card:hover {
  border-color: var(--green);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
}

.league-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.league-card h4 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 16px;
  letter-spacing: 1px;
  color: var(--text);
  margin-bottom: 8px;
}

.league-info {
  color: var(--text2);
  font-size: 12px;
  margin-bottom: 16px;
}

.league-btn {
  width: 100%;
  padding: 10px;
  background: var(--green);
  color: #000;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.5px;
  transition: all 0.2s;
}

.league-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}
</style>
