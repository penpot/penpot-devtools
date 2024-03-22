import { unref } from 'vue'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { useStateStore } from './state'
import { useTestingApp } from '../test/app'

describe('State Store', () => {
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

  it('should test initial state', async () => {
    const store = useStateStore()
    expect(unref(store.state)).toStrictEqual({
      id: 'root',
      name: 'root',
      type: 'unknown:unknown',
      value: undefined,
      children: [],
      state: 'unloaded',
      isExpandable: true,
      isExpanded: false,
    })
    expect(unref(store.filter)).toBe('')
  })

})
