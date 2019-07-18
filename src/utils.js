import { cellSize, pageHeight, pageWidth, boardLength } from './config'

/**
  cellSize = 20
  getLocalSize(500, 500) // => { w: 25, h: 25 }
*/
export const getLocalSize = (w, h) => ({
  w: Math.floor(w / cellSize),
  h: Math.floor(h / cellSize),
})

/**
  cellSize = 20
  getLocalSize(20, 20) // => { w: 400, h: 400 }
*/
export const getGlobalSize = (w, h) => ({
  w: Math.floor(w * cellSize),
  h: Math.floor(h * cellSize),
})

/**
  localX = 5
  localY = 10
  cellSize = 20
  convertGlobalPositionToLocal([localX, localY]) // => [100, 200]
*/
export const convertLocalPositionToGlobal = ([x, y]) => [
  x * cellSize,
  y * cellSize,
]

/**
  x = 100
  y = 200
  cellSize = 20
  convertGlobalPositionToLocal([x, y]) // => [5, 10]
*/
export const convertGlobalPositionToLocal = ([x, y]) => [
  x / cellSize,
  y / cellSize,
]

export function randomPosition() {
  const { w, h } = getLocalSize(pageWidth, pageHeight)

  function intNumber(n) {
    return Math.floor(Math.random() * n)
  }

  return [intNumber(w), intNumber(h)]
}

export function getIndexByPosition([col, row]) {
  const { w, h } = getLocalSize(pageWidth, pageHeight)

  return row * w + col
}

export function getPositionByIndex(index) {
  const { w } = getLocalSize(pageWidth, pageHeight)
  const y = Math.floor(index / w)
  const x = index - y * w

  return [x, y]
}

export function getRowByPosition([x, y]) {
  return y
}

export function getColByPosition([x, y]) {
  return x
}

export function getNeighborsByPosition([x, y]) {
  const { w, h } = getLocalSize(pageWidth, pageHeight)
  const hasLeftNeighbour = x - 1 >= 0
  const hasRightNeighbour = x + 1 < w
  const hasTopNeighbour = y - 1 >= 0
  const hasDownNeighbour = y + 1 < h

  return [
    hasTopNeighbour ? [x, y - 1] : undefined, // top
    hasLeftNeighbour ? [x - 1, y] : undefined, // left
    hasDownNeighbour ? [x, y + 1] : undefined, // down
    hasRightNeighbour ? [x + 1, y] : undefined, // right
  ]
}
