const { describe, it, expect } = require('vitest')

// Test that vitest is working
describe('Test Runner', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should pass async test', async () => {
    const result = await Promise.resolve(42)
    expect(result).toBe(42)
  })

  it('should handle objects', () => {
    const obj = { foo: 'bar', num: 123 }
    expect(obj).toEqual({ foo: 'bar', num: 123 })
  })
})
