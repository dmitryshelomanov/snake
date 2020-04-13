import { getLocalSize } from './utils'
import { pageHeight, pageWidth } from './config'

export function checkBounds([x, y]: Coords): Coords {
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
