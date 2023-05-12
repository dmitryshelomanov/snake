import { getIndexByPosition, convertLocalPositionToGlobal } from '../utils'
import { borderSize, cellSize } from '../config'
import { renderText } from './shapes'
import { assets } from './loader'

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
    const [x, y] = convertLocalPositionToGlobal(position)
    const size = cellSize - borderSize * 2

    context.drawImage(
      assets.brick,
      x + borderSize * 2,
      y + borderSize * 2,
      size,
      size
    )

    if (indexesVisible) {
      renderText({
        context,
        text: getIndexByPosition(position).toString(),
        position,
      })
    }
  })
}
