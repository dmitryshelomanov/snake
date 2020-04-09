import { getIndexByPosition } from '../utils'
import { colorScheme } from '../config'
import { drawSquare, renderText } from './shapes'

export function renderFoods({
  context,
  foods,
  indexesVisible = false,
}: {
  context: CanvasRenderingContext2D
  foods: Array<Food>
  indexesVisible?: boolean
}) {
  foods.forEach(([position]) => {
    drawSquare({ color: colorScheme.foodColor, position, context })

    if (indexesVisible) {
      renderText({
        context,
        text: getIndexByPosition(position).toString(),
        position,
      })
    }
  })
}
