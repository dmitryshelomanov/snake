import { getIndexByPosition } from '../utils'
import { drawSquare } from './shapes'

export function renderFoods(context, foods) {
  foods.forEach(([position, id]) => {
    drawSquare(context, position, { color: 'rgb(238, 68, 0)' })

    // if (getIndexesVisibleStore()) {
    //   renderText(context, index, position)
    // }
  })
}
