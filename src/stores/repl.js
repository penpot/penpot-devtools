import { reactive, shallowRef, ref, inject } from 'vue'
import { defineStore } from 'pinia'

export const useREPLStore = defineStore('repl', () => {
  const { sendMessage } = inject('messaging')
  const history = reactive([])
  const historyIndex = ref(-1)
  const result = shallowRef(null)

  function historyUp() {
    if (historyIndex.value <= 0) return history[historyIndex.value]
    historyIndex.value--
    return history[historyIndex.value]
  }

  function historyDown() {
    if (historyIndex.value >= history.length - 1) return history[historyIndex.value]
    historyIndex.value++
    return history[historyIndex.value]
  }

  async function runCode(code) {
    historyIndex.value = history.push(code)
    try {
      const payload = await sendMessage('eval', code)
      result.value = payload
    } catch (error) {
      result.value = error
    }
  }

  return {
    history,
    historyIndex,
    result,
    historyUp,
    historyDown,
    runCode
  }
})

export default useREPLStore
