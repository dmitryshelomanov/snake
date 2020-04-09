import { getIndexByPosition } from '../utils'
import { colorScheme } from '../config'
import { drawSquare, renderText } from './shapes'

export function renderFoods({ context, foods, indexesVisible = false }) {
  foods.forEach(([position]) => {
    drawSquare(context, position, { color: colorScheme.foodColor })

    if (indexesVisible) {
      renderText(context, getIndexByPosition(position), position)
    }
  })
}
