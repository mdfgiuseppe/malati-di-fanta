<template>
  <div class="admin-utenti">
    <h3>Gestione Utenti</h3>

    <div class="utenti-sections">
      <div class="section">
        <h4>👥 Utenti Registrati</h4>
        <div v-if="registeredUsers.length === 0" class="empty">
          Nessun utente registrato
        </div>
        <table v-else class="utenti-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Squadra</th>
              <th>Stato</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in registeredUsers" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.team }}</td>
              <td><span class="badge active">Attivo</span></td>
              <td>
                <button @click="editUser(user)" class="btn-small">✏️</button>
                <button @click="deleteUser(user.id)" class="btn-small danger">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <h4>📋 Richieste Pendenti</h4>
        <div v-if="pendingRequests.length === 0" class="empty">
          Nessuna richiesta pendente
        </div>
        <table v-else class="utenti-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Squadra</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="req in pendingRequests" :key="req.email">
              <td>{{ req.name }}</td>
              <td>{{ req.email }}</td>
              <td>{{ req.team }}</td>
              <td>
                <button @click="approveRequest(req)" class="btn-small success">✓</button>
                <button @click="rejectRequest(req.email)" class="btn-small danger">✗</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useDataStore } from '../../stores/dataStore'
import { gsCall } from '../../utils/googleSheets'

export default {
  setup() {
    const dataStore = useDataStore()
    const registeredUsers = ref([])
    const pendingRequests = ref([])

    onMounted(async () => {
      console.log('[AdminUtenti] Montato, caricando utenti...')
      registeredUsers.value = await dataStore.loadUsers()
      console.log('[AdminUtenti] Utenti caricati:', registeredUsers.value)
      pendingRequests.value = await dataStore.loadPendingRequests()
      console.log('[AdminUtenti] Richieste pendenti caricate:', pendingRequests.value)
    })

    const editUser = (user) => {
      console.log('Edit user:', user)
    }

    const deleteUser = (id) => {
      if (confirm('Elimina questo utente?')) {
        console.log('Delete user:', id)
      }
    }

    const approveRequest = async (req) => {
      if (!confirm(`Approva ${req.name}?`)) return
      try {
        const result = await gsCall({ action: 'approveRequest', email: req.email })
        if (result && result.ok) {
          alert('Utente approvato!')
          pendingRequests.value = pendingRequests.value.filter(r => r.email !== req.email)
        } else {
          alert('Errore: ' + (result?.error || 'Unknown error'))
        }
      } catch (err) {
        alert('Errore: ' + err.message)
      }
    }

    const rejectRequest = (email) => {
      if (confirm('Rifiuta questa richiesta?')) {
        pendingRequests.value = pendingRequests.value.filter(r => r.email !== email)
        console.log('Rejected:', email)
      }
    }

    return {
      registeredUsers,
      pendingRequests,
      editUser,
      deleteUser,
      approveRequest,
      rejectRequest
    }
  }
}
</script>

<style scoped>
.admin-utenti {
  width: 100%;
}

.admin-utenti h3 {
  color: #ff6b35;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.utenti-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  background: #0a0e27;
  border-radius: 8px;
  padding: 1.5rem;
}

.section h4 {
  color: #fff;
  margin-bottom: 1rem;
}

.empty {
  color: #999;
  text-align: center;
  padding: 2rem;
}

.utenti-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.utenti-table th {
  background: #1a1f3a;
  padding: 0.8rem;
  text-align: left;
  border-bottom: 2px solid #ff6b35;
  color: #ff6b35;
  font-weight: bold;
}

.utenti-table td {
  padding: 0.8rem;
  border-bottom: 1px solid #333;
}

.utenti-table tr:hover {
  background: #1a1f3a;
}

.badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.badge.active {
  background: #4caf50;
  color: #fff;
}

.btn-small {
  padding: 0.4rem 0.8rem;
  margin: 0 0.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #ff6b35;
  color: #000;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.btn-small:hover {
  opacity: 0.8;
}

.btn-small.success {
  background: #4caf50;
  color: #fff;
}

.btn-small.danger {
  background: #d32f2f;
  color: #fff;
}
</style>
