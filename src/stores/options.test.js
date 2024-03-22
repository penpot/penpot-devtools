import { unref } from 'vue'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { useOptionsStore } from './options'
import { useTestingApp } from '../test/app'

describe('Options Store', () => {
  const MessagingMock = {
    sendMessage: vi.fn()
      .mockResolvedValue({ options: ['option1'], state: [] })
      .mockResolvedValueOnce({ options: ['option1'], state: [] })
      .mockResolvedValueOnce({ options: ['option1'], state: ['option1'] }),
  }

  const MessagingMockPlugin = {
    install(app) {
      app.provide('messaging', MessagingMock)
    },
  }

  beforeAll(() => useTestingApp({ plugins: [MessagingMockPlugin] }))

  it('should test initializing the options store', () => {
    const store = useOptionsStore()
    expect(unref(store.options)).toEqual([])
    store.init({ options: ['option1'], state: [] })
    expect(unref(store.options)).toEqual([{ id: 'option1', enabled: false }])
  })

  it('should test toggling an option', async () => {
    const store = useOptionsStore()
    store.init({ options: ['option1'], state: [] })
    await store.toggle({ id: 'option1' })
    expect(unref(store.options)).toEqual([{ id: 'option1', enabled: true }])
    expect(MessagingMock.sendMessage).toHaveBeenCalledWith('debug:toggle', 'option1')
  })

  it('should test refreshing an option', async () => {
    const store = useOptionsStore()
    await store.refresh()
    expect(unref(store.options)).toEqual([{ id: 'option1', enabled: true }])
    expect(MessagingMock.sendMessage).toHaveBeenCalledWith('debug:refresh')
  })
})
