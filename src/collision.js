import { getLocalSize } from './utils'
import { pageHeight, pageWidth } from './config'

export function checkBounds([x, y]) {
  const { w, h } = getLocalSize(pageWidth, pageHeight)

  if (w < x) {
    x = 0
  }

  if (h < y) {
    y = 0
  }

  if (y < 0) {
    y = h - 1
  }

  if (x < 0) {
    x = w - 1
  }

  return [x, y]
}

export function checkCollision([x, y], [x1, y1]) {
  if (x === x1 && y === y1) {
    return true
  }

  return false
}

export function oneToManyCollision(targetPosition, otherPositions, callback) {
  for (const element of otherPositions) {
    const isCrash = checkCollision(targetPosition, element)

    if (isCrash) {
      callback(element)

      break
    }
  }
}

export function oneToOneCollision(object1, object2, callback) {
  const isCrash = checkCollision(object1, object2)

  if (isCrash) {
    callback(object1)
  }
}
