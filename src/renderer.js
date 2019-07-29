import { cellSize, borderSize, pageHeight, pageWidth } from './config'
import {
  convertLocalPositionToGlobal,
  getLocalSize,
  getGlobalSize,
  getIndexByPosition,
} from './utils'

export function drawSquare(context, position, color = 'rgb(152, 251, 152)') {
  const [x, y] = convertLocalPositionToGlobal(position)

  context.fillStyle = color
  context.fillRect(
    x + borderSize + 2,
    y + borderSize + 2,
    cellSize - borderSize * 4,
    cellSize - borderSize * 4
  )
}

export function drawGrid(context) {
  const localSize = getLocalSize(pageWidth, pageHeight)
  const globalSize = getGlobalSize(localSize.w, localSize.h)

  context.lineWidth = borderSize
  context.strokeStyle = 'rgba(0, 0, 0, 0.2)'

  for (let i = 0; i <= localSize.w; i++) {
    context.moveTo(i * cellSize + borderSize, 0)
    context.lineTo(i * cellSize + borderSize, globalSize.h)
  }

  for (let i = 0; i <= localSize.h; i++) {
    context.moveTo(0, i * cellSize + borderSize)
    context.lineTo(globalSize.w, i * cellSize + borderSize)
  }

  context.stroke()
}

export function renderText(context, text, position) {
  const { width } = context.measureText(text)
  const [x, y] = convertLocalPositionToGlobal(position)

  context.fillStyle = 'black'
  context.font = '12px Arial'

  context.fillText(text, x + (cellSize - width) / 2, y + cellSize / 2)
}

export function clearCells(context, cells, callback) {
  for (const element of cells) {
    const size = cellSize - borderSize * 4
    const [x, y] = convertLocalPositionToGlobal(element)

    callback(getIndexByPosition(element))
    context.clearRect(x + borderSize + 2, y + borderSize + 2, size, size)
  }
}
