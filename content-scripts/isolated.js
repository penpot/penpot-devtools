/* eslint-disable */
if (!('penpotDevTools' in window)) {
  /**
   * Configuramos el puerto que se nos pasa
   * para poder intercambiar mensajes con las DevTools.
   *
   * @param {chrome.runtime.Port} port
   */
  function setupPort(port) {
    // Renovamos el puerto y desconectamos el anterior.
    if (ports.has(port.name)) {
      const port = ports.get(port.name)
      port.disconnect()
    }

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
      console.log('Port disconnected', port.name)
      ports.delete(port.name)
      window.removeEventListener('message', onMessage)
    })

    port.postMessage({
      source: 'penpot-devtools:bridge',
      type: 'connected',
      payload: {},
    })
  }

  chrome.runtime.onConnect.addListener((port) => {
    console.log('Port connected', port.name)
    if (port.name !== 'penpot-devtools:devtools') return
    console.log('Setting up port')
    setupPort(port)
  })

  function tryConnect() {
    try {
      const port = chrome.runtime.connect({ name: 'penpot-devtools:bridge' })
      setupPort(port)
    } catch (error) {
      console.log(error)
    }
  }

  const ports = new Map()

  // Utilizamos el objeto global para almacenar
  // los puertos y el temporizador de reconexión.
  // Y para poder comprobar si se inyectó este código
  // en el contexto aislado de la página.
  window.penpotDevTools = {
    ports
  }

  tryConnect()
}
