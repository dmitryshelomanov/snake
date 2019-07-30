import { drawSquare, renderText } from './renderer'
import { borderSize, cellSize } from './config'
import { convertLocalPositionToGlobal, getIndexByPosition } from './utils'
import { getIndexesVisibleStore } from './model'

export function renderBrick(context, brick, callback) {
  const index = getIndexByPosition(brick)

  callback(index)
  drawSquare(context, brick, { color: '#d2b3b3' })

  if (getIndexesVisibleStore()) {
    renderText(context, index, brick)
  }
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
