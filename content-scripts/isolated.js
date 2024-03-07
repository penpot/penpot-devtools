/* eslint-disable */
if (!('penpotDevTools' in window)) {
  /**
   * Clase que nos permite manejar el temporizador
   * de reconexión con las DevTools.
   */
  class ReconnectionTimer {
    #callback = null
    #timeoutId = null
    #timeout = 1000
    #timeoutTryIncrement = 1000
    #maxTimeout = 5000

    constructor(callback, options) {
      this.#callback = callback
      this.#timeout = options?.timeout ?? 1000
      this.#maxTimeout = options?.maxTimeout ?? 5000
      this.#timeoutTryIncrement = options?.timeoutTryIncrement ?? 1000
      this.#timeoutId = null
    }

    #onTimeout = () => {
      try {
        this.#callback()
      } catch (error) {
        this.#tryAgain()
      }
    }

    #tryAgain() {
      if (this.#timeout < this.#maxTimeout) {
        this.#timeout += this.#timeoutTryIncrement
      }
      this.#request()
    }

    #cancel() {
      if (this.#timeoutId) {
        clearTimeout(this.#timeoutId)
      }
    }

    #request(callback) {
      this.#timeoutId = setTimeout(callback, this.#timeout)
    }

    stop() {
      this.#cancel()
    }

    start() {
      this.#cancel()
      this.#request(this.#onTimeout)
    }
  }

  /**
   * Configuramos el puerto que se nos pasa
   * para poder intercambiar mensajes con las DevTools.
   *
   * @param {chrome.runtime.Port} port
   */
  function setupPort(port) {
    ports.set(port.name, port)

    /**
     * Manejamos los eventos que nos llegan
     * y que deberían recibir las DevTools.
     *
     * @param {*} e
     */
    function onMessage(e) {
      if (e.data.source !== 'penpot-devtools:main') return
      // Redirigimos los mensajes al content-script MAIN.
      port.postMessage(e.data)
    }

    // Aquí escuchamos los mensajes que nos envíen y que deban
    // llegar a las DevTools.
    window.addEventListener('message', onMessage)

    /**
     * Aquí procesamos los mensajes que recibiremos de las DevTools.
     *
     * @param {any} message
     * @param {chrome.runtime.Port} port
     */
    port.onMessage.addListener((message, port) => {
      window.postMessage(message)
    })

    /**
     * Manejamos la desconexión del puerto.
     */
    port.onDisconnect.addListener(() => {
      ports.delete(port.name)
      window.removeEventListener('message', onMessage)
      reconnectionTimer.start()
    })
  }

  /**
   * Intentamos reconectar el puerto del chrome.runtime.
   */
  function reconnect() {
    port = chrome.runtime.connect({ name: 'penpot-devtools:bridge' })
    // Reconfiguramos el puerto.
    setupPort(port)
    // Enviamos un mensaje de reconexión a las DevTools.
    window.postMessage({
      source: 'penpot-devtools:bridge',
      type: 'reconnected',
    })
  }

  const ports = new Map()
  const reconnectionTimer = new ReconnectionTimer(reconnect)

  // Utilizamos el objeto global para almacenar
  // los puertos y el temporizador de reconexión.
  // Y para poder comprobar si se inyectó este código
  // en el contexto aislado de la página.
  window.penpotDevTools = {
    ports,
    reconnectionTimer,
  }

  try {
    let port = chrome.runtime.connect({ name: 'penpot-devtools:bridge' })
    setupPort(port)
  } catch (error) {
    reconnectionTimer.start()
  }
}
