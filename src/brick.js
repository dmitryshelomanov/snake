import { drawSquare, renderText } from './renderer'
import { getIndexByPosition } from './utils'
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
