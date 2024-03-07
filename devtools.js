/* eslint-disable */
console.log('Devtools script loaded')

/**
 * @type {WindowOrWorkerGlobalScope}
 */
const state = {
  panel: null,
  panelWindow: null,
  port: null,
  panelQueue: [],
  mainQueue: []
}

/**
 * Envía mensajes al panel de las DevTools.
 *
 * @param {*} message
 * @returns
 */
function sendToPanel(message) {
  console.log('Sending to panel', message)
  if (!state.panelWindow) {
    console.log('No panel window available, queueing message')
    state.panelQueue.push(message)
    return
  }
  console.log('Sending to panel window', message)
  state.panelWindow.postMessage(message)
}

/**
 * Envía mensajes al contexto principal de la aplicación.
 *
 * @param {*} message
 */
function sendToMain(message) {
  console.log('sendToMain', message)
  if (!state.port) {
    console.log('No port available')
    state.mainQueue.push(message)
    return
  }
  console.log('Sending to port', message)
  try {
    state.port.postMessage(message)
  } catch (error) {
    console.error('Error sending message', error)
  }
}

// Si hemos detectado las DevTools de Penpot, creamos el panel.
chrome.devtools.panels.create(
  'Penpot',
  'dist/favicon.png',
  'dist/index.html',
  function (panel) {
    // code invoked on panel creation
    console.log('Panel', panel)

    state.panel = panel
    panel.onHidden.addListener(function () {
      console.log('Panel hidden')
    })

    panel.onShown.addListener(function (panelWindow) {
      console.log('Panel shown', panelWindow)
      if (state.panelWindow !== panelWindow) {
        state.panelWindow = panelWindow
      }

      if (state.panelQueue.length > 0) {
        state.panelQueue.forEach((message) => state.panelWindow.postMessage(message))
        state.panelQueue.length = 0
      }

      panelWindow.onmessage = function (e) {
        if (e.data.source === 'penpot-devtools:panel') {
          sendToMain(e.data)
        }
      }
    })
  }
)

/**
 * Configuramos el puerto de comunicación
 * con el contexto principal de la aplicación.
 *
 * @param {*} port
 */
function setupPort(port) {
  if (state.port) {
    state.port.disconnect()
  }
  state.port = port
  port.onMessage.addListener((message, port) => {
    console.log('message', message, port)
    if (message.source === 'penpot-devtools:main') {
      sendToPanel(message)
    } else if (message.source === 'penpot-devtools:bridge') {
      if (message.type === 'connected') {
        // Una vez que estamos conectados y listos
        // ya podemos inyectar el código en el contexto
        // principal de la página.
        chrome.scripting.executeScript({
          target: { tabId: chrome.devtools.inspectedWindow.tabId },
          world: 'MAIN',
          files: ['content-scripts/main.js'],
        })
      }
    }
  })

  port.onDisconnect.addListener(() => {
    state.port = null
    sendToPanel({
      source: 'penpot-devtools:devtools',
      type: 'disconnected',
      payload: {},
    })
  })

  sendToPanel({
    source: 'penpot-devtools:devtools',
    type: 'connected',
    payload: {},
  })

  if (state.mainQueue.length > 0) {
    state.mainQueue.forEach((message) => sendToMain(message))
    state.mainQueue.length = 0
  }
}

/**
 * Este evento es lanzado cuando recibimos un puerto
 * de conexión.
 */
chrome.runtime.onConnect.addListener((port) => {
  console.log('Port connected', port.name)
  if (port.name !== 'penpot-devtools:bridge') return
  console.log('Setting up port', port)
  setupPort(port)
})

setInterval(() => {
  chrome.devtools.inspectedWindow.eval(
    '!!window.penpotDevTools',
    (result, isException) => {
      if (isException) console.error(isException)
      if (result) return

      // Inyectamos el script en el contexto aislado de la página.
      chrome.scripting.executeScript({
        target: { tabId: chrome.devtools.inspectedWindow.tabId },
        world: 'ISOLATED',
        files: ['content-scripts/isolated.js'],
      })
    })
}, 1000)
