import { cellSize, borderSize, pageHeight, pageWidth } from './config'
import {
  convertLocalPositionToGlobal,
  getLocalSize,
  getGlobalSize,
  getDifferenceBetweenPositions,
} from './utils'

export function drawSquare(
  context,
  position,
  { color = 'rgb(152, 251, 152)' }
) {
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
  context.font = '12px Arial bold'

  context.fillText(text, x + (cellSize - width) / 2, y + cellSize / 2)
}

function getNextPositionIfIsNear(pos1, pos2) {
  const diff = getDifferenceBetweenPositions(pos1, pos2)

  if (diff !== 1) {
    return pos1
  }

  return pos2
}

export function renderPath(context, paths = [], color = 'rgb(255, 255, 0)') {
  for (let i = 0; i < paths.length - 1; i++) {
    const [x, y] = convertLocalPositionToGlobal(paths[i])
    const [x1, y1] = convertLocalPositionToGlobal(
      getNextPositionIfIsNear(paths[i], paths[i + 1])
    )

    context.beginPath()
    context.strokeStyle = color
    context.lineWidth = 2
    context.moveTo(x + cellSize / 2, y + cellSize / 2)
    context.lineTo(x1 + cellSize / 2, y1 + cellSize / 2)
    context.stroke()
  }
}

export function renderProcessed(context, processed, color) {
  for (const element of processed) {
    drawSquare(context, element, { color })
  }
}
