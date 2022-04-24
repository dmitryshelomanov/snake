import { combine, createStore } from 'effector'
import { Graph } from '../../algorithms'
import { getLocalSize, setValuesToGraph, getIndexByPosition } from '../../utils'
import { pageWidth, pageHeight, PLACE_TYPE } from '../../config'
import { $snakes } from '../snakes'
import { $foods, $bricks } from '../objects'
import { Snake } from '../snake'

const localSize = getLocalSize(pageWidth, pageHeight)

export function markFoodOnGraph({
  graph,
  foods,
}: {
  graph: Graph
  foods: Array<Food>
}): void {
  setValuesToGraph(
    graph,
    foods.map(([position, id]) => {
      return {
        type: PLACE_TYPE.FOOD,
        value: id,
        index: getIndexByPosition(position),
      }
    })
  )
}

export function markSnakesOnGraph({
  snakes,
  graph,
}: {
  graph: Graph
  snakes: Array<Snake>
}): void {
  snakes.forEach((snake) => {
    setValuesToGraph(
      graph,
      snake.body.map((position) => {
        return {
          type: PLACE_TYPE.GAME_OBJECT,
          index: getIndexByPosition(position),
          value: snake.id,
        }
      })
    )
  })
}

export function markBricksOnGraph({
  graph,
  bricks,
}: {
  graph: Graph
  bricks: Array<Coords>
}): void {
  setValuesToGraph(
    graph,
    bricks.map((position) => {
      return {
        type: PLACE_TYPE.BRICK,
        index: getIndexByPosition(position),
        value: '',
      }
    })
  )
}

export const $graph = createStore(new Graph(localSize))

export const $entities = combine({
  snakes: $snakes,
  foods: $foods,
  bricks: $bricks,
})
