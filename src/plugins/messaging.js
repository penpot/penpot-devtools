import { useOptionsStore } from '~/stores/options'
import { useStatusStore } from '~/stores/status'
import { PromiseMap } from './messaging/PromiseMap'

/**
 * Este plugin de Vue es el responsable de transformar los mensajes
 * que se envían desde el panel de DevTools.
 */
export const MessagingPlugin = {
  /**
   * Instala el plugin en la aplicación.
   *
   * @param {} app
   */
  install(app) {
    const promiseMap = new PromiseMap()
    app.provide('messaging', {
      sendMessage: (type, payload, id) => {
        const mid = id ?? (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).toString(36)
        const promise = promiseMap.create(mid, 60000)
        window.postMessage({
          id: mid,
          source: 'penpot-devtools:panel',
          type,
          payload,
        })
        return promise
      }
    })

    window.addEventListener('message', (e) => {
      if (!['penpot-devtools:devtools', 'penpot-devtools:main'].includes(e.data.source)) return

      if (e.data.type === 'ready') {
        // Activamos aquellas opciones que hayamos recibido por parámetros.
        const optionsStore = useOptionsStore()
        optionsStore.init(e.data.payload.debug)
        return
      } else if (e.data.type === 'connected' ||
                 e.data.type === 'disconnected') {
        const statusStore = useStatusStore()
        if (e.data.type === 'connected') {
          statusStore.connected()
        } else {
          statusStore.disconnected()
        }
      }

      if (e.data.type === 'success'
       || e.data.type === 'failure') {
        if (!promiseMap.has(e.data.id)) {
          return
        }

        // Resolvemos la promesa que se generó a partir del mensaje
        // que recibimos.
        if (e.data.type === 'success') {
          return promiseMap.resolve(e.data.id, e.data.payload)
        }
        return promiseMap.reject(e.data.id, new Error(e.data.payload))
      }
    })
  },
}
