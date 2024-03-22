import { unref } from 'vue'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { useStatusStore } from './status'
import { useTestingApp } from '../test/app'

describe('Status Store', () => {
  const MessagingMock = {
    sendMessage: vi
      .fn()
      .mockResolvedValueOnce('result1')
      .mockRejectedValueOnce(new Error('result2')),
  }

  const MessagingMockPlugin = {
    install(app) {
      app.provide('messaging', MessagingMock)
    },
  }

  beforeAll(() => useTestingApp({ plugins: [MessagingMockPlugin] }))

  it('should test status', async () => {
    const store = useStatusStore()
    expect(unref(store.status)).toBe('disconnected')
    store.connected()
    expect(unref(store.status)).toBe('connected')
    store.disconnected()
    expect(unref(store.status)).toBe('disconnected')
  })
})
