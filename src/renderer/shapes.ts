import { cellSize, borderSize } from '../config'
import {
  convertLocalPositionToGlobal,
  getDifferenceBetweenPositions,
} from '../utils'

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
