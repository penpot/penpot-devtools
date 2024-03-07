/* eslint-disable */
// Si las DevTools no están definidas
// pasamos a definirlas.
if (!('penpotDevTools' in window)) {
  const PATH_SEPARATOR = '/'

  const typeTable = {
    'app:datetime': app.util.time.datetime_QMARK_,
    'cljs:uuid': cljs.core.uuid_QMARK_,
    'cljs:keyword': cljs.core.keyword_QMARK_,
    'cljs:vector': cljs.core.vector_QMARK_,
    'cljs:list': cljs.core.list_QMARK_,
    'cljs:map': cljs.core.map_QMARK_,
    'cljs:set': cljs.core.set_QMARK_,
    'cljs:symbol': cljs.core.symbol_QMARK_,
    'js:date': (value) => value instanceof Date,
    'js:array': (value) => Array.isArray(value),
    'js:boolean': (value) => typeof value === 'boolean',
    'js:function': (value) => typeof value === 'function',
    'js:number': (value) => typeof value === 'number',
    'js:string': (value) => typeof value === 'string',
    'js:undefined': (value) => typeof value === 'undefined',
    'js:null': (value) => value === null,
    'js:object': (value) => typeof value === 'object' && value !== null && value.toString() === '[object Object]',
  }

  /**
   * Esta función se encarga de obtener el tipo de un
   * objeto, los objetos se clasifican por ámbito:
   * app:, cljs: y js:.
   *
   * @param {*} value
   * @returns {string}
   */
  function getType(value) {
    for (const [type, fn] of Object.entries(typeTable)) {
      if (fn(value)) return type
    }
    return 'unknown:unknown'
  }

  const expandableTable = {
    'app:datetime': false,
    'cljs:uuid': false,
    'cljs:keyword': false,
    'cljs:vector': true,
    'cljs:list': true,
    'cljs:map': true,
    'cljs:set': true,
    'cljs:symbol': false,
    'js:date': false,
    'js:array': true,
    'js:boolean': false,
    'js:function': false,
    'js:number': false,
    'js:string': false,
    'js:undefined': false,
    'js:null': false,
    'js:object': true,
    'unkwnown:unknown': false,
  }

  /**
   * Devuelve si un tipo es expandible o no.
   *
   * @param {string} type
   * @returns {boolean}
   */
  function isTypeExpandable(type) {
    return expandableTable[type]
  }

  const valueTable = {
    'app:datetime': (value) => cljs.core.str(value),
    'cljs:uuid': (value) => cljs.core.name(value),
    'cljs:keyword': (value) => cljs.core.name(value),
    'js:date': (value) => value.toISOString(),
  }

  /**
   * Devuelve el valor representable de un valor.
   *
   * @param {*} value
   * @param {string} type
   * @returns {*}
   */
  function getValue(value, type) {
    return type in valueTable ? valueTable[type](value) : value
  }

  /**
   * Devuelve la ruta de una variable en concreto para poder
   * resolverla usando el estado de la aplicación.
   *
   * @param {string} path
   * @returns {string[]}
   */
  function getPath(path) {
    if (path === 'root') {
      return []
    }
    return path
      .slice(5)
      .split(PATH_SEPARATOR)
      .map((x) => {
        if (x.startsWith('#')) {
          return cljs.core.uuid(x.slice(1))
        } else if (x.startsWith(':')) {
          return cljs.core.keyword(x.slice(1))
        } else if (x.startsWith('!')) {
          return parseInt(x.slice(1), 10)
        } else {
          return x
        }
      })
  }

  function getKeyName(key) {
    if (cljs.core.uuid_QMARK_(key)) {
      return '#' + cljs.core.name(key)
    } else if (cljs.core.keyword_QMARK_(key)) {
      return ':' + cljs.core.name(key)
    } else if (typeof key === 'string') {
      return key
    } else if (typeof key === 'number') {
      return `!${key}`
    }
  }

  /**
   * @typedef {object} StateItem
   * @property {string} id
   * @property {string} name
   * @property {string} type
   * @property {*} [value=null]
   * @property {StateItem[]} [children=[]]
   * @property {string} [state='unloaded']
   * @property {boolean} [isExpandable=false]
   * @property {boolean} [isExpanded=false]
   */

  /**
   * Obtiene el estado parcil de la aplicación a partir
   * de una ruta concreta.
   *
   * @param {string} path
   * @returns {StateItem}
   */
  function getPartialState(path) {
    const state = cljs.core.deref(app.main.store.state)
    const statePath = getPath(path)
    const data = cljs.core.get_in(state, statePath)
    const type = getType(data)
    if (isTypeExpandable(type)) {
      let children = []
      if (type.startsWith('cljs:')) {
        children = cljs.core.clj__GT_js(
          cljs.core.map_indexed((index, entry) => {
            if (cljs.core.map_entry_QMARK_(entry)) {
              const key = cljs.core.first(entry)
              const name = getKeyName(key)
              const value = cljs.core.nth(entry, 1)
              const type = getType(value)
              const repValue = getValue(value, type)
              const isExpandable = isTypeExpandable(type)
              return createStateItem({
                id: path + PATH_SEPARATOR + name,
                name,
                type,
                value: isExpandable ? null : repValue,
                isExpandable: isExpandable,
              })
            } else {
              const value = entry
              const type = getType(value)
              const repValue = getValue(value, type)
              const isExpandable = isTypeExpandable(type)
              return createStateItem({
                id: path + PATH_SEPARATOR + getKeyName(index),
                name: index,
                type,
                value: isExpandable ? null : repValue,
                isExpandable: isExpandable,
              })
            }
          }, data)
        )
      } else if (type.startsWith('js:')) {
        children = Object.entries(data).map(([key, value]) => {
          const type = getType(value)
          const repValue = getValue(value, type)
          const isExpandable = isTypeExpandable(type)
          return createStateItem({
            id: path + PATH_SEPARATOR + key,
            name: key,
            type,
            value: isExpandable ? null : repValue,
            state: isExpandable ? 'unloaded' : 'loaded',
            isExpandable: isExpandable,
          })
        })
      }

      return createStateItem({
        id: path,
        type,
        children,
        value: undefined,
        isExpanded: true,
        isExpandable: true,
      })
    }

    const repValue = getValue(data, type)
    return createStateItem({
      id: path,
      type: type,
      children: [],
      value: repValue,
      isExpanded: false,
      isExpandable: false,
    })
  }

  /**
   * Intenta obtener el estado parcial de la aplicación
   *
   * @param {string} path
   * @returns {['success', StateItem] | ['failure', string]}
   */
  function tryGetPartialState(path) {
    try {
      const payload = getPartialState(path)
      return ['success', payload]
    } catch (error) {
      return ['failure', error.message]
    }
  }

  /**
   * Intenta obtener el estado parcial de la aplicación
   * y envia el mensaje de respuesta.
   *
   * @param {string} path
   * @param {string} id
   * @returns {Promise<StateItem>}
   */
  function tryGetPartialStateAndRespond(path, id) {
    const [status, payload] = tryGetPartialState(path)
    sendMessage(status, payload, id)
    return payload
  }

  /**
   * Retorna las opciones de debug.
   *
   * @returns
   */
  function getDebugOptions() {
    try {
      const options = cljs.core.clj__GT_js(app.util.debug.options)
      console.log('options', options)
      return options
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Retorna el estado de las opciones de debug.
   *
   * @returns
   */
  function getDebugState() {
    try {
      const state = cljs.core.clj__GT_js(cljs.core.deref(app.util.debug.state))
      console.log('state', state)
      return state
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * @typedef {object} StateItemInit
   * @property {string} id
   * @property {string} name
   * @property {string} type
   * @property {*} [value=null]
   * @property {StateItemInit[]} [children=[]]
   * @property {string} [state='unloaded']
   * @property {boolean} [isExpandable=false]
   * @property {boolean} [isExpanded=false]
   */

  /**
   * Crea un elemento del estado compatible con lo que tenemos
   * en Vue.
   *
   * @param {StateItemInit} init
   * @returns
   */
  function createStateItem(init) {
    return {
      id: init.id,
      name: init.name,
      type: init.type,
      value: init?.value ?? null,
      children: init?.children ?? [],
      state: init?.isExpandable ? 'unloaded' : 'loaded',
      isExpandable: init?.isExpandable ?? false,
      isExpanded: init?.isExpanded ?? false,
    }
  }

  /**
   * Esta función se encarga de comprobar que tenemos todo
   * lo necesario para poder correr las devtools de Penpot.
   *
   * @returns {Promise<boolean>}
   */
  function areAvailable() {
    const areDefined =
      'penpotVersion' in window &&
      'penpotFlags' in window &&
      'cljs' in window &&
      'cljs_eval' in window

    const options = getDebugOptions()
    const state = getDebugState()
    if (areDefined && options) {
      return {
        version: window.penpotVersion,
        flags: window.penpotFlags,
        debug: {
          options,
          state,
        },
      }
    }
    return null
  }

  /**
   * Esta función se encarga de evaluar el código que le pasemos
   * y devuelve el resultado.
   *
   * @param {string} code
   * @returns {Promise<*>}
   */
  function evalClojureScript(code) {
    return window.cljs_eval(code)
  }

  /**
   * Esta función se encarga de evaluar el código que le pasemos
   * y devuelve el resultado como un array que contiene el estado
   * (success o failure) y el resultado.
   *
   * @param {string} code
   * @param {string} id
   * @returns {Promise<[string, *]>}
   */
  async function tryEval(code, id) {
    try {
      const result = await evalClojureScript(code)
      return ['success', result]
    } catch (error) {
      console.error(error)
      return ['failure', error.message]
    }
  }

  /**
   * Esta función se encarga de evaluar el código que le pasemos
   * devuelve el resultado y además realiza el envío del mensaje
   * de respuesta.
   *
   * @param {string} code
   * @param {string} id
   * @returns {Promise<*>}
   */
  async function tryEvalAndRespond(code, id) {
    const [status, payload] = await tryEval(code)
    sendMessage(status, payload, id)
    return payload
  }

  /**
   * Esta función se encarga de enviar mensajes al contexto
   * aislado de las Penpot DevTools.
   *
   * @param {string} type
   * @param {*} payload
   * @param {*} [id]
   */
  function sendMessage(type, payload, id) {
    window.postMessage({
      id:
        id ??
        Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36),
      source: 'penpot-devtools:main',
      type,
      payload: structuredClone(payload),
    })
  }

  /**
   * DevTools de penpot.
   */
  window.penpotDevTools = {
    isTypeExpandable,
    getValue,
    getType,
    getPath,
    getPartialState,
    tryGetPartialState,
    tryGetPartialStateAndRespond,
    getDebugOptions,
    getDebugState,
    areAvailable,
    evalClojureScript,
    tryEval,
    sendMessage
  }

  /**
   * Aquí recibiremos los mensajes del content-script ISOLATED
   * que funciona como intermediario entre las DevTools y la
   * página.
   */
  window.addEventListener('message', async (e) => {
    if (!['penpot-devtools:panel','penpot-devtools:bridge'].includes(e.data.source)) return

    if (e.data.type === 'eval') {
      tryEvalAndRespond(e.data.payload, e.data.id)
    } else if (e.data.type === 'toggle-debug') {
      tryEvalAndRespond(
        `(do (app.util.debug/toggle! :${e.data.payload}) (js* "app.main.reinit(true)"))`
      )
    } else if (e.data.type === 'state') {
      tryGetPartialStateAndRespond(e.data.payload, e.data.id)
    } else if (e.data.type === 'reconnected') {
      const payload = areAvailable()
      if (payload) {
        // Necesitamos reenviar el mensaje de ready
        // porque necesitamos volver a mandar el estado de las opciones de
        // debug.
        sendMessage('ready', payload)
      }
    }
  })
}

// Mandamos un mensaje de que estamos "ready"
// tan pronto como se ejecute este código en el
// contexto principal de la aplicación.
const payload = window.penpotDevTools.areAvailable()
if (payload) {
  window.penpotDevTools.sendMessage('ready', payload)
}
