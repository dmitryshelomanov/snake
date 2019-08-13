import {
  getLocalSize,
  getGlobalSize,
  convertGlobalPositionToLocal,
  convertLocalPositionToGlobal,
  getIndexByPosition,
} from './utils'

describe('utils', () => {
  it('should return local size by global', () => {
    expect(getLocalSize(80, 80)).toEqual({ w: 4, h: 4 })
  })

  it('should return global size by local', () => {
    expect(getGlobalSize(50, 50)).toEqual({ w: 1000, h: 1000 })
  })

  it('should return global position by local', () => {
    expect(convertGlobalPositionToLocal([20, 20])).toEqual([1, 1])
  })

  it('should return local position by global', () => {
    expect(convertLocalPositionToGlobal([1, 1])).toEqual([20, 20])
  })

  it('should return index by position', () => {
    expect(getIndexByPosition([0, 0])).toBe(0)
    expect(getIndexByPosition([3, 0])).toBe(3)
    expect(getIndexByPosition([0, 1])).toBe(4)
    expect(getIndexByPosition([3, 2])).toBe(11)
  })
})
