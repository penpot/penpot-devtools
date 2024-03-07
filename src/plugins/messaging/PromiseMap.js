export class PromiseMap {
  #promises = new Map()
  #executors = new Map()

  create(id, timeout = Infinity) {
    const promise = new Promise((resolve, reject) => {
      let tid
      if (Number.isFinite(timeout)) {
        tid = setTimeout(() => reject(new Error('Timeout')), timeout)
      }
      this.#executors.set(id, { resolve, reject, tid })
    })
    this.#promises.set(id, promise)
    return promise
  }

  #retrieve(id) {
    const { resolve, reject, tid } = this.#executors.get(id)
    this.#executors.delete(id)
    this.#promises.delete(id)
    if (tid) clearTimeout(tid)
    return { resolve, reject }
  }

  has(id) {
    return this.#promises.has(id)
  }

  get(id) {
    return this.#promises.get(id)
  }

  resolve(id, payload) {
    return this.#retrieve(id).resolve(payload)
  }

  reject(id, error) {
    return this.#retrieve(id).reject(error)
  }

  cancel(id) {
    return this.#retrieve(id)
  }
}

export default PromiseMap
