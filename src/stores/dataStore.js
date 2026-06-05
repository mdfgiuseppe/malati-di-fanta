import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { gsCall } from '../utils/googleSheets'

export const useDataStore = defineStore('data', () => {
  const leagues = ref([])
  const tournaments = ref([])
  const users = ref([])
  const pendingRequests = ref([])
  const isLoading = ref(false)

  const loadLeagues = async () => {
    isLoading.value = true
    try {
      const result = await gsCall({ action: 'getLeagues' })
      if (result && result.ok && result.data) {
        leagues.value = result.data
        return result.data
      }
    } catch (err) {
      console.error('Error loading leagues:', err)
    } finally {
      isLoading.value = false
    }
    return []
  }

  const loadUsers = async () => {
    isLoading.value = true
    try {
      console.log('[DataStore] Calling gsCall getUtenti...')
      const result = await gsCall({ action: 'getUtenti' })
      console.log('[DataStore] gsCall response:', result)
      if (result && result.ok && result.data) {
        users.value = result.data
        return result.data
      }
    } catch (err) {
      console.error('[DataStore] Error loading users:', err)
    } finally {
      isLoading.value = false
    }
    return []
  }

  const loadPendingRequests = async () => {
    isLoading.value = true
    try {
      const result = await gsCall({ action: 'getPendingRequests' })
      if (result && result.ok && result.data) {
        pendingRequests.value = result.data
        return result.data
      }
    } catch (err) {
      console.error('Error loading pending requests:', err)
    } finally {
      isLoading.value = false
    }
    return []
  }

  return {
    leagues,
    tournaments,
    users,
    pendingRequests,
    isLoading,
    loadLeagues,
    loadUsers,
    loadPendingRequests
  }
})
