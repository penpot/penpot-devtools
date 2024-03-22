import { createApp } from 'vue'
import { setActivePinia, createPinia } from 'pinia'

export function useTestingApp(options) {
  const app = createApp()
  const plugins = options?.plugins || []
  for (const plugin of plugins) {
    app.use(plugin)
  }

  const pinia = createPinia()
  app.use(pinia)
  setActivePinia(pinia)

  return { app, pinia }
}

export default useTestingApp
