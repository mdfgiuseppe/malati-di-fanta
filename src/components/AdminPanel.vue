<template>
  <div class="admin-panel">
    <div class="admin-sidebar">
      <h2>PANNELLO ADMIN</h2>
      <nav class="admin-menu">
        <button
          v-for="item in adminMenuItems"
          :key="item"
          @click="currentSection = item"
          :class="{ active: currentSection === item }"
          class="admin-btn"
        >
          {{ item }}
        </button>
      </nav>
      <button @click="$emit('logout')" class="logout-btn">🚪 Esci</button>
    </div>

    <div class="admin-content">
      <component v-if="getCurrentComponent()" :is="getCurrentComponent()" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import AdminUtenti from './admin/AdminUtenti.vue'
import AdminTornei from './admin/AdminTornei.vue'
import AdminRose from './admin/AdminRose.vue'
import AdminCalendario from './admin/AdminCalendario.vue'

export default {
  emits: ['logout'],
  components: { AdminUtenti, AdminTornei, AdminRose, AdminCalendario },
  setup() {
    const currentSection = ref('Utenti')
    const adminMenuItems = ref(['Utenti', 'Tornei', 'Rose', 'Calendario', 'Coppe', 'Sponsor'])

    const getCurrentComponent = () => {
      const map = {
        'Utenti': AdminUtenti,
        'Tornei': AdminTornei,
        'Rose': AdminRose,
        'Calendario': AdminCalendario,
      }
      return map[currentSection.value] || null
    }

    return { currentSection, adminMenuItems, getCurrentComponent }
  }
}
</script>

<style scoped>
.admin-panel {
  display: flex;
  gap: 2rem;
  background: #0a0e27;
  min-height: 100vh;
  padding: 2rem;
}

.admin-sidebar {
  width: 200px;
  background: #1a1f3a;
  border-radius: 8px;
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.admin-sidebar h2 {
  color: #ff6b35;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.admin-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.admin-btn {
  padding: 0.7rem 1rem;
  border: none;
  background: #0a0e27;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
  text-align: left;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.admin-btn:hover {
  background: #ff6b35;
  color: #000;
}

.admin-btn.active {
  background: #ff6b35;
  color: #000;
  font-weight: bold;
}

.logout-btn {
  width: 100%;
  padding: 0.7rem 1rem;
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: #b71c1c;
}

.admin-content {
  flex: 1;
  background: #1a1f3a;
  border-radius: 8px;
  padding: 2rem;
}
</style>
