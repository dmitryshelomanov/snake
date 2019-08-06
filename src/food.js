import { getIndexByPosition } from './utils'
import { onUpdateGameMap, getIndexesVisibleStore, PLACE_TYPE } from './model'
import { drawSquare, renderText } from './renderer'

export function renderFoods(context, foods, callback) {
  foods.forEach(([position, id]) => {
    const index = getIndexByPosition(position)

    callback(index, id)
    drawSquare(context, position, { color: 'rgb(238, 68, 0)' })

    if (getIndexesVisibleStore()) {
      renderText(context, index, position)
    }
  })
}

export function updateGameMapForFood() {
  return (index, foodId) => {
    onUpdateGameMap({ index, placeType: [PLACE_TYPE.FOOD, foodId] })
  }
}
