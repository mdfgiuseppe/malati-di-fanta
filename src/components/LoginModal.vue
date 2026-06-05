<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2>LOGIN ADMIN</h2>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <div class="modal-body">
        <div class="input-group">
          <label>Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Inserisci password"
            @keyup.enter="login"
            ref="passwordInput"
          >
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="closeModal">Annulla</button>
        <button class="btn-login" @click="login">Accedi</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'login'],
  setup(props, { emit }) {
    const password = ref('')
    const error = ref('')
    const passwordInput = ref(null)

    const closeModal = () => {
      password.value = ''
      error.value = ''
      emit('close')
    }

    const login = () => {
      if (password.value === 'admin') {
        emit('login')
        closeModal()
      } else {
        error.value = 'Password errata'
        password.value = ''
      }
    }

    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        setTimeout(() => {
          passwordInput.value?.focus()
        }, 100)
      }
    })

    return {
      password,
      error,
      passwordInput,
      closeModal,
      login
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: 100%;
  max-width: 340px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid var(--border);
}

.modal-header h2 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 16px;
  letter-spacing: 2px;
  color: var(--green);
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text2);
  cursor: pointer;
  font-size: 20px;
  transition: color 0.2s;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: var(--text);
}

.modal-body {
  padding: 24px 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--text2);
}

.input-group input {
  padding: 12px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
}

.input-group input:focus {
  outline: none;
  border-color: var(--green);
  background: var(--bg2);
}

.input-group input::placeholder {
  color: var(--text3);
}

.error-msg {
  color: var(--red);
  font-size: 12px;
  margin-top: 12px;
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 6px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--border);
}

.btn-cancel,
.btn-login {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.5px;
  transition: all 0.2s;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-cancel {
  background: var(--bg2);
  color: var(--text);
}

.btn-cancel:hover {
  border-color: var(--text2);
}

.btn-login {
  background: var(--green);
  color: #000;
  border-color: var(--green);
  font-weight: 700;
}

.btn-login:hover {
  opacity: 0.9;
}

.btn-login:active {
  transform: scale(0.98);
}
</style>
