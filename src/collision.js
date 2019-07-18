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
  for (let i = 0; i < otherPositions.length; i++) {
    const isCrash = checkCollision(targetPosition, otherPositions[i])

    if (isCrash) {
      callback(otherPositions[i])

      break
    }
  }
}

export function oneToOneCollision(obj1, obj2, callback) {
  const isCrash = checkCollision(obj1, obj2)

  if (isCrash) {
    callback(obj1)
  }
}
