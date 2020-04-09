import {
  cellSize,
  borderSize,
  pageHeight,
  pageWidth,
  colorScheme,
} from '../config'
import { getLocalSize, getGlobalSize } from '../utils'

export function buildGrid(context) {
  const grid = new Path2D()
  const localSize = getLocalSize(pageWidth, pageHeight)
  const globalSize = getGlobalSize(localSize.w, localSize.h)

  for (let i = 0; i <= localSize.w; i++) {
    grid.moveTo(i * cellSize + borderSize, 0)
    grid.lineTo(i * cellSize + borderSize, globalSize.h)
  }

  for (let i = 0; i <= localSize.h; i++) {
    grid.moveTo(0, i * cellSize + borderSize)
    grid.lineTo(globalSize.w, i * cellSize + borderSize)
  }

  return {
    grid,
    applyStyles: () => {
      context.lineWidth = borderSize
      context.strokeStyle = colorScheme.borderColor
    },
  }
}
