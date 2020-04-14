import { combine } from 'effector'
import { Graph } from '../../algorithms'
import { getLocalSize, setValuesToGraph, getIndexByPosition } from '../../utils'
import { pageWidth, pageHeight, PLACE_TYPE } from '../../config'
import { $snakes } from '../snakes'
import { $foods } from '../objects'
import { Snake } from '../snake'

const localSize = getLocalSize(pageWidth, pageHeight)

function markFoodOnGraph({
  graph,
  foods,
}: {
  graph: Graph
  foods: Array<Food>
}): void {
  setValuesToGraph(graph, [
    ...foods.map(([position, id]) => {
      return {
        type: PLACE_TYPE.FOOD,
        value: id,
        index: getIndexByPosition(position),
      }
    }),
  ])
}

function markSnakesOnGraph({
  snakes,
  graph,
}: {
  graph: Graph
  snakes: Array<Snake>
}): void {
  snakes.forEach((snake) => {
    setValuesToGraph(graph, [
      ...snake.body.map((position) => {
        return {
          type: PLACE_TYPE.GAME_OBJECT,
          index: getIndexByPosition(position),
          value: snake.id,
        }
      }),
    ])
  })
}

export const $graph = combine({ snakes: $snakes, foods: $foods }).map(
  ({ foods, snakes }, graph) => {
    graph.clear()

    markFoodOnGraph({ graph, foods })
    markSnakesOnGraph({ graph, snakes })

    return Graph.extend(graph)
  },
  new Graph(localSize)
)
