<template>
  <div class="splash">
    <div class="splash-content">
      <div class="splash-logo">
        <img src="/logo.png" alt="Malati di Fanta">
      </div>
      <h1>MALATI DI FANTA</h1>
      <p class="splash-sub">Fantacalcio Manageriale Continuativo</p>
      <p class="splash-year">SINCE 2019</p>

      <button class="splash-btn" @click="enter">
        → ENTRA NELLA PIATTAFORMA
      </button>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['enter'],
  setup(props, { emit }) {
    const enter = () => {
      emit('enter')
    }

    return { enter }
  }
}
</script>

<style scoped>
.splash {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.splash::before {
  content: '';
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse 60% 40% at 10% 10%, rgba(16, 185, 129, 0.04), transparent 60%),
              radial-gradient(ellipse 50% 30% at 90% 90%, rgba(59, 130, 246, 0.04), transparent 60%);
  pointer-events: none;
}

.splash-content {
  text-align: center;
  z-index: 1;
  animation: fadeUp 0.8s ease forwards;
}

.splash-logo {
  margin-bottom: 32px;
}

.splash-logo img {
  width: 280px;
  height: auto;
  filter: drop-shadow(0 8px 32px rgba(16, 185, 129, 0.2));
  animation: float 3s ease-in-out infinite;
}

@media (max-width: 600px) {
  .splash-logo img {
    width: 220px;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.splash h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 36px;
  letter-spacing: 3px;
  color: var(--green);
  margin-bottom: 12px;
  animation: fadeUp 0.8s ease 0.2s forwards;
  opacity: 0;
}

.splash-sub {
  font-size: 14px;
  color: var(--text2);
  margin-bottom: 4px;
  letter-spacing: 1px;
  text-transform: uppercase;
  animation: fadeUp 0.8s ease 0.4s forwards;
  opacity: 0;
}

.splash-year {
  font-size: 12px;
  color: var(--text3);
  margin-bottom: 48px;
  letter-spacing: 2px;
  animation: fadeUp 0.8s ease 0.6s forwards;
  opacity: 0;
}

.splash-btn {
  padding: 14px 32px;
  background: var(--green);
  color: #000;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 48px;
  animation: fadeUp 0.8s ease 0.8s forwards;
  opacity: 0;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
}

.splash-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(16, 185, 129, 0.4);
}

.splash-btn:active {
  transform: translateY(0);
}

.splash-footer {
  position: absolute;
  bottom: 20px;
  text-align: center;
  color: var(--text3);
  font-size: 11px;
  letter-spacing: 0.5px;
  z-index: 1;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .splash h1 {
    font-size: 28px;
    letter-spacing: 2px;
  }

  .splash-logo img {
    width: 150px;
  }

  .splash-btn {
    padding: 12px 24px;
    font-size: 12px;
  }
}
</style>
