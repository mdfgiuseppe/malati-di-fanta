<template>
  <div>
    <!-- LOGIN MODAL -->
    <LoginModal :isOpen="showLoginModal" @close="showLoginModal = false" @login="handleLogin" />

    <!-- SPLASH SCREEN -->
    <SplashScreen v-if="showSplash" @enter="showSplash = false" />

    <!-- MAIN APP -->
    <template v-else>
      <header class="navbar">
        <div class="logo-area" @click="handleLogoClick">
          <img src="/logo.png" alt="Malati di Fanta" class="logo-img">
          <h1>MALATI DI FANTA</h1>
        </div>

        <div class="navbar-right">
          <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Tema chiaro' : 'Tema scuro'">
            {{ isDark ? '☀️' : '🌙' }}
          </button>
          <button @click="toggleAdmin" :class="{ active: isAdmin }" class="nav-btn accedi-btn">
            {{ isAdmin ? '✓ ACCEDI' : '🔐 ACCEDI' }}
          </button>
        </div>
      </header>

      <div class="layout">
        <!-- SIDEBAR (non visible in dashboard) -->
        <aside class="sidebar" v-if="!isAdmin && currentSection !== 'dashboard'">
          <div class="sidebar-header">
            <h2>SEZIONI</h2>
          </div>
          <nav class="sidebar-menu">
            <button
              v-for="item in menuItems"
              :key="item.id"
              @click="currentSection = item.id"
              :class="{ active: currentSection === item.id }"
              class="sidebar-item"
            >
              {{ item.icon }} {{ item.name }}
            </button>
          </nav>
        </aside>

        <!-- MAIN CONTENT -->
        <main class="main-area">
          <component v-if="!isAdmin" :is="getCurrentComponent()" />
          <AdminPanel v-else @logout="toggleAdmin" />
        </main>
      </div>
    </template>
  </div>
</template>

<script>
import { ref } from 'vue'
import SplashScreen from './components/SplashScreen.vue'
import AdminPanel from './components/AdminPanel.vue'
import DashboardView from './components/DashboardView.vue'
import LoginModal from './components/LoginModal.vue'

export default {
  components: { SplashScreen, AdminPanel, DashboardView, LoginModal },
  setup() {
    const showSplash = ref(true)
    const showLoginModal = ref(false)
    const isAdmin = ref(false)
    const isDark = ref(true)
    const currentSection = ref('dashboard')
    const logoClickCount = ref(0)
    const logoClickTimer = ref(null)

    const menuItems = ref([
      { id: 'dashboard', name: 'Dashboard', icon: '📊' },
      { id: 'leghe', name: 'Leghe', icon: '⚽' },
      { id: 'tornei', name: 'Tornei', icon: '🏆' },
      { id: 'coppe', name: 'Coppe', icon: '👑' },
    ])

    const getCurrentComponent = () => {
      if (currentSection.value === 'dashboard') return DashboardView
      return { template: `<div style="padding: 20px;"><h2>${currentSection.value}</h2><p>In arrivo...</p></div>` }
    }

    const handleLogoClick = () => {
      logoClickCount.value++

      clearTimeout(logoClickTimer.value)

      if (logoClickCount.value === 3) {
        logoClickCount.value = 0
        showLoginModal.value = true
      }

      logoClickTimer.value = setTimeout(() => {
        logoClickCount.value = 0
      }, 500)
    }

    const handleLogin = () => {
      isAdmin.value = true
    }

    const toggleTheme = () => {
      isDark.value = !isDark.value
      const theme = isDark.value ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    }

    const toggleAdmin = () => {
      if (!isAdmin.value) {
        showLoginModal.value = true
      } else {
        isAdmin.value = false
      }
    }

    // Set initial theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark'
    isDark.value = savedTheme === 'dark'
    document.documentElement.setAttribute('data-theme', savedTheme)

    return {
      showSplash,
      showLoginModal,
      isAdmin,
      isDark,
      currentSection,
      menuItems,
      getCurrentComponent,
      handleLogoClick,
      handleLogin,
      toggleTheme,
      toggleAdmin
    }
  }
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 200;
  height: 56px;
  background: rgba(7, 9, 15, 0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: opacity 0.2s;
}

.logo-area:active {
  opacity: 0.7;
}

.logo-img {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.logo-area h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 16px;
  letter-spacing: 1.5px;
  color: var(--green);
  display: none;
}

@media (min-width: 768px) {
  .logo-area h1 {
    display: block;
  }
}

.navbar-right {
  margin-left: auto;
  display: flex;
  gap: 8px;
  align-items: center;
}

.theme-toggle {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border);
  background: var(--card2);
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  background: var(--card);
  border-color: var(--green);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.nav-btn {
  padding: 8px 14px;
  border: 1px solid var(--border);
  background: var(--card2);
  color: var(--text2);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.5px;
  min-height: 40px;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.nav-btn:hover {
  background: var(--card);
  color: var(--green);
  border-color: var(--green);
}

.nav-btn.active {
  background: var(--green);
  color: #000;
  border-color: var(--green);
}

.accedi-btn {
  background: var(--green);
  color: #000;
  border-color: var(--green);
}

.accedi-btn:hover {
  opacity: 0.9;
}

.layout {
  display: flex;
  min-height: calc(100vh - 56px);
  position: relative;
  z-index: 1;
}

.sidebar {
  width: 220px;
  background: var(--bg2);
  border-right: 1px solid var(--border);
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 20px 16px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 12px;
}

.sidebar-header h2 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 12px;
  letter-spacing: 1.5px;
  color: var(--green);
  text-transform: uppercase;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0 8px;
}

.sidebar-item {
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: var(--text2);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  margin: 0 0 4px 0;
}

.sidebar-item:hover {
  background: rgba(16, 185, 129, 0.1);
  color: var(--green);
}

.sidebar-item.active {
  background: rgba(16, 185, 129, 0.15);
  color: var(--green);
  border-left: 3px solid var(--green);
  padding-left: 13px;
}

.main-area {
  flex: 1;
  overflow-y: auto;
  background: var(--bg);
}

@media (max-width: 600px) {
  .navbar {
    padding: 0 12px;
    height: 48px;
  }

  .logo-img {
    height: 36px;
  }

  .nav-btn {
    padding: 6px 10px;
    font-size: 10px;
  }
}
</style>
