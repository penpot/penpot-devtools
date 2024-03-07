import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'

export const useStateStore = defineStore('state', () => {
  const { sendMessage } = inject('messaging')
  const filter = ref('')
  const filterRegex = computed(() => new RegExp(filter.value, 'i'))
  const state = ref({
    id: 'root',
    name: 'root',
    type: 'unknown:unknown',
    value: undefined,
    children: [],
    state: 'unloaded',
    isExpandable: true,
    isExpanded: false
  })

  async function toggle(item) {
    // Si no es expandible, salimos.
    if (!item.isExpandable) return
    item.isExpanded = !item.isExpanded
    if (!item.isExpanded) return
    if (item.state === 'unloaded'
     || item.state === 'loaded') {
      item.state = 'loading'
      await tryResolve(item)
    }
  }

  async function tryResolve(item) {
    try {
      const payload = await sendMessage('state', item.id)
      console.log('Resolved', payload)
      if (payload?.type)
        item.type = payload.type
      if (payload?.value)
        item.value = payload.value
      if (payload?.children)
        item.children = payload.children
      if (payload?.isExpandable)
        item.isExpandable = payload.isExpandable
      item.state = 'loaded'
      console.log('Assigning to item', item)
    } catch (error) {
      item.type = 'error'
      item.value = error.message
      item.children = []
      item.isExpandable = false
      item.state = 'error'
    }
  }

  async function refresh(item) {
    // Cuando se hace refresh no deberíamos
    // setear el estado a 'loading' porque esto
    // produce un efecto muy feo en la UI.
    // item.state = 'loading'
    tryResolve(item)
  }

  return {
    filterRegex,
    filter,
    state,
    refresh,
    toggle,
    tryResolve
  }
})
