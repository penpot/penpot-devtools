import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStatusStore = defineStore('status', () => {
  const status = ref('disconnected')

  function connected() {
    status.value = 'connected'
  }
  function disconnected() {
    status.value = 'disconnected'
  }

  return {
    status,
    connected,
    disconnected,
  }
})
