import { unref } from 'vue'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { useREPLStore } from './repl'
import { useTestingApp } from '../test/app'

describe('REPL Store', () => {
  const MessagingMock = {
    sendMessage: vi.fn()
      .mockResolvedValueOnce('result1')
      .mockRejectedValueOnce(new Error('result2')),
  }

  const MessagingMockPlugin = {
    install(app) {
      app.provide('messaging', MessagingMock)
    },
  }

  beforeAll(() => useTestingApp({ plugins: [MessagingMockPlugin] }))

  it('should test runCode (success)', async () => {
    const store = useREPLStore()
    await store.runCode('code1')
    expect(unref(store.result)).toBe('result1')
    expect(MessagingMock.sendMessage).toHaveBeenCalledWith('eval', 'code1')
  })

  it('should test runCode (failure)', async () => {
    const store = useREPLStore()
    await store.runCode('code2')
    expect(unref(store.result)).toStrictEqual(new Error('result2'))
    expect(MessagingMock.sendMessage).toHaveBeenCalledWith('eval', 'code2')
  })

  it('should test history up', () => {
    const store = useREPLStore()
    expect(store.historyUp()).toBe('code2')
    expect(store.historyUp()).toBe('code1')
    expect(store.historyUp()).toBe('code1')
    expect(store.historyDown()).toBe('code2')
    expect(store.historyDown()).toBe('code2')
  })
})
