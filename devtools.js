/* eslint-disable */

/**
 * @type {WindowOrWorkerGlobalScope}
 */
const state = {
  panel: null,
  panelWindow: null,
  port: null,
}

const queue = []

/**
 * Envía mensajes al panel de las DevTools.
 *
 * @param {*} message
 * @returns
 */
function sendToPanel(message) {
  if (!state.panelWindow) {
    queue.push(message)
    return
  }
  state.panelWindow.postMessage(message)
}

/**
 * Envía mensajes al contexto principal de la aplicación.
 *
 * @param {*} message
 */
function sendToMain(message) {
  if (!state.port) {
    return
  }
  state.port.postMessage(message)
}

// Si hemos detectado las DevTools de Penpot, creamos el panel.
chrome.devtools.panels.create(
  'Penpot',
  'dist/favicon.png',
  'dist/index.html',
  function (panel) {
    // code invoked on panel creation
    console.log('panel', panel)

    state.panel = panel

    panel.onHidden.addListener(function () {
      console.log('panel hidden')
    })

    panel.onShown.addListener(function (panelWindow) {
      console.log('panel shown', panelWindow)

      state.panelWindow = panelWindow

      if (queue.length > 0) {
        queue.forEach((message) => state.panelWindow.postMessage(message))
        queue.length = 0
      }

      panelWindow.onmessage = function (e) {
        console.log('message', e.data)
        if (e.data.source === 'penpot-devtools:panel') {
          sendToMain(e.data)
        }
      }
    })
  }
)

/**
 * Este evento es lanzado cuando recibimos un puerto
 * de conexión.
 */
chrome.runtime.onConnect.addListener((port) => {
  console.log('Port connected', port.name)

  state.port = port

  port.onMessage.addListener((message, port) => {
    if (message.source === 'penpot-devtools:main') {
      sendToPanel(message)
    }
  })

  port.onDisconnect.addListener(() => {
    state.port = null
    sendToPanel({
      source: 'penpot-devtools:devtools',
      type: 'disconnected',
      payload: {}
    })
  })

  sendToPanel({
    source: 'penpot-devtools:devtools',
    type: 'connected',
    payload: {}
  })

  // Una vez que estamos conectados y listos
  // ya podemos inyectar el código en el contexto
  // principal de la página.
  chrome.scripting.executeScript({
    target: { tabId: chrome.devtools.inspectedWindow.tabId },
    world: 'MAIN',
    files: ['content-scripts/main.js'],
  })
})

/*
console.log('Executing script isolated.js')
chrome.scripting.executeScript({
  target: { tabId: chrome.devtools.inspectedWindow.tabId },
  world: 'ISOLATED',
  files: ['content-scripts/isolated.js'],
})
*/
