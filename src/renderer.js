import { cellSize, borderSize, pageHeight, pageWidth } from './config'
import {
  convertLocalPositionToGlobal,
  getLocalSize,
  getGlobalSize,
} from './utils'

export function drawSquare(ctx, position, color = 'rgb(152, 251, 152)') {
  const [x, y] = convertLocalPositionToGlobal(position)

  ctx.fillStyle = color
  ctx.fillRect(
    x + borderSize + 2,
    y + borderSize + 2,
    cellSize - borderSize * 4,
    cellSize - borderSize * 4
  )
}

export function drawGrid(ctx) {
  const localSize = getLocalSize(pageWidth, pageHeight)
  const globalSize = getGlobalSize(localSize.w, localSize.h)

  ctx.lineWidth = borderSize
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'

  for (let i = 0; i <= localSize.w; i++) {
    ctx.moveTo(i * cellSize + borderSize, 0)
    ctx.lineTo(i * cellSize + borderSize, globalSize.h)
  }

  for (let i = 0; i <= localSize.h; i++) {
    ctx.moveTo(0, i * cellSize + borderSize)
    ctx.lineTo(globalSize.w, i * cellSize + borderSize)
  }

  ctx.stroke()
}

export function renderText(ctx, text, position) {
  const { width } = ctx.measureText(text)
  const [x, y] = convertLocalPositionToGlobal(position)

  ctx.fillStyle = 'black'
  ctx.font = '12px Arial'

  ctx.fillText(text, x + (cellSize - width) / 2, y + cellSize / 2)
}

export function clearCell(ctx, cells) {
  for (let i = 0; i < cells.length; i++) {
    const size = cellSize - borderSize * 4
    const [x, y] = convertLocalPositionToGlobal(cells[i])

    ctx.clearRect(x + borderSize + 2, y + borderSize + 2, size, size)
  }
}
