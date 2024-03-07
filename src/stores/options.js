import { ref, inject } from 'vue'
import { defineStore } from 'pinia'

export const useOptionsStore = defineStore('options', () => {
  const options = ref([])

  const { sendMessage } = inject('messaging')

  async function toggle(option) {
    try {
      await sendMessage('debug:toggle', option.id)
      const opt = options.value.find((o) => o.id === option.id)
      if (opt) {
        opt.enabled = !opt.enabled
      }
    }
    catch (error)
    {
      console.error(error)
    }
  }

  function init({ options: debugOptions, state: debugState }) {
    options.value = debugOptions.map((option) => {
      const isEnabled = debugState.includes(option)
      return {
        id: option,
        enabled: isEnabled,
      }
    })
  }

  async function refresh() {
    try {
      const payload = await sendMessage('debug:refresh')
      init(payload)
    } catch (error) {
      console.error(error)
    }
  }

  return {
    options,
    init,
    toggle,
    refresh
  }
})

export default useOptionsStore
