import { getIndexByPosition, convertLocalPositionToGlobal } from '../utils'
import { borderSize, cellSize } from '../config'
import { renderText } from './shapes'
import { assets } from './loader'

export function renderFoods({
  context,
  foods,
  indexesVisible = false,
}: {
  context: CanvasRenderingContext2D
  foods: Array<Food>
  indexesVisible?: boolean
}): void {
  foods.forEach(([position]) => {
    const [x, y] = convertLocalPositionToGlobal(position)
    const size = cellSize - borderSize * 2

    context.drawImage(
      assets.apple,
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
