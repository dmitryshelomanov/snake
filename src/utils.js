import { cellSize, pageHeight, pageWidth } from './config'

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

export function getIndexByPosition([x, y]) {
  const { w } = getLocalSize(pageWidth, pageHeight)

  return y * w + x
}

export function getPositionByIndex(index) {
  const { w } = getLocalSize(pageWidth, pageHeight)
  const y = Math.floor(index / w)
  const x = index - y * w

  return [x, y]
}

export function randomId() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString()
}

export function createOperationLogger(name) {
  let operation = 0

  return {
    log: () => {
      console.log(`[SNAKE] => ${name} operation count - ${operation}`)
    },
    increment: () => {
      operation += 1
    },
  }
}

export function generateRandomFoodByCount(count) {
  const foods = []

  for (let i = 0; i < count; i++) {
    foods.push([randomPosition(), randomId()])
  }

  return foods
}

export function extractTypeFromMap(place) {
  if (Array.isArray(place)) {
    return place[0]
  }

  return place
}

export function getDifferenceBetweenPositions([x, y], [x1, y1]) {
  return Math.abs(x1 + y1 - (x + y))
}
