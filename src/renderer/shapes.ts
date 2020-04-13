import { cellSize, borderSize } from '../config'
import {
  convertLocalPositionToGlobal,
  getDifferenceBetweenPositions,
} from '../utils'

export function drawSquare({
  color = 'rgb(152, 251, 152)',
  position,
  context,
}: {
  color?: string
  position: Coords
  context: CanvasRenderingContext2D
}) {
  const [x, y] = convertLocalPositionToGlobal(position)
  const size = cellSize - borderSize * 2

  context.fillStyle = color
  context.fillRect(x + borderSize * 2, y + borderSize * 2, size, size)
}

export function renderText({
  text,
  position,
  context,
}: {
  text: string
  position: Coords
  context: CanvasRenderingContext2D
}) {
  const { width } = context.measureText(text)
  const [x, y] = convertLocalPositionToGlobal(position)

  context.fillStyle = 'black'
  context.font = '12px Arial bold'

  context.fillText(text, x + (cellSize - width) / 2, y + cellSize / 2)
}

function getNextPositionIfIsNear(pos1: Coords, pos2: Coords) {
  const diff = getDifferenceBetweenPositions(pos1, pos2)

  if (diff !== 1) {
    return pos1
  }

  return pos2
}

export function renderPath({
  context,
  path = [],
  color = 'rgb(255, 255, 0)',
}: {
  context: CanvasRenderingContext2D
  path: Array<Coords>
  color?: string
}) {
  for (let i = 0; i < path.length - 1; i++) {
    const [x, y] = convertLocalPositionToGlobal(path[i])
    const [x1, y1] = convertLocalPositionToGlobal(
      getNextPositionIfIsNear(path[i], path[i + 1])
    )

    context.beginPath()
    context.strokeStyle = color
    context.lineWidth = 2
    context.moveTo(x + cellSize / 2, y + cellSize / 2)
    context.lineTo(x1 + cellSize / 2, y1 + cellSize / 2)
    context.stroke()
  }
}

export function renderProcessed({
  context,
  processed = [],
  color = 'rgb(255, 255, 0)',
}: {
  context: CanvasRenderingContext2D
  processed: Array<Coords> | void
  color?: string
}) {
  processed.forEach((position) => {
    drawSquare({ color, context, position })
  })
}
