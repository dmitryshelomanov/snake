import { cellSize, borderSize, pageHeight, pageWidth } from './config'
import {
  convertLocalPositionToGlobal,
  getLocalSize,
  getGlobalSize,
  getIndexByPosition,
} from './utils'

export function drawSquare(context, position, color = 'rgb(152, 251, 152)') {
  const [x, y] = convertLocalPositionToGlobal(position)
  const size = cellSize - borderSize * 2

  context.fillStyle = color
  context.fillRect(x + borderSize * 2, y + borderSize * 2, size, size)
}

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
      context.strokeStyle = 'rgba(0, 0, 0, 0.2)'
    },
  }
}

export function renderText(context, text, position) {
  const { width } = context.measureText(text)
  const [x, y] = convertLocalPositionToGlobal(position)

  context.fillStyle = 'black'
  context.font = '12px Arial'

  context.fillText(text, x + (cellSize - width) / 2, y + cellSize / 2)
}

export function renderApple(context, apple, callback) {
  callback(getIndexByPosition(apple))
  drawSquare(context, apple, 'rgb(238, 68, 0)')
}
