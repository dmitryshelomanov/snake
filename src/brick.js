import { drawSquare } from './renderer'
import { borderSize, cellSize } from './config'
import { convertLocalPositionToGlobal, getIndexByPosition } from './utils'

export function renderBrick(context, brick, callback) {
  callback(getIndexByPosition(brick))
  drawSquare(context, brick, '#d2b3b3')
}

export function renderBricks(context, briks, callback) {
  for (const brick of briks) {
    renderBrick(context, brick, callback)
  }
}

export function clearBrick(context, brick, callback) {
  const size = cellSize - borderSize * 4
  const [x, y] = convertLocalPositionToGlobal(brick)

  callback(getIndexByPosition(brick))
  context.clearRect(x + borderSize + 2, y + borderSize + 2, size, size)
}
