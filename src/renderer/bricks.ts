import { getIndexByPosition } from '../utils'
import { colorScheme } from '../config'
import { drawSquare, renderText } from './shapes'

export function renderBricks({
  context,
  bricks,
  indexesVisible = false,
}: {
  context: CanvasRenderingContext2D
  bricks: Array<Coords>
  indexesVisible?: boolean
}): void {
  bricks.forEach((position) => {
    drawSquare({ color: colorScheme.brikColor, position, context })

    if (indexesVisible) {
      renderText({
        context,
        text: getIndexByPosition(position).toString(),
        position,
      })
    }
  })
}
