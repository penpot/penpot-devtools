import { ref, inject } from 'vue'
import { defineStore } from 'pinia'

export const useOptionsStore = defineStore('options', () => {
  const options = ref([])

  const { sendMessage } = inject('messaging')

  async function toggle(option) {
    try {
      await sendMessage('toggle-debug', option.id)
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
      console.log('debug option', option, isEnabled)
      return {
        id: option,
        enabled: isEnabled,
      }
    })
  }

  return {
    options,
    init,
    toggle,
  }
})

export default useOptionsStore
