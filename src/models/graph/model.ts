import { attach, combine, Effect, sample, StoreValue } from 'effector'
import { getIndexByPosition } from '../../utils'
import { PLACE_TYPE } from '../../config'
import { Graph } from '../../algorithms'
import { $snakes } from '../snakes'
import { $foods, $bricks, addBrick } from '../objects'
import {
  $graph,
  $entities,
  markFoodOnGraph,
  markSnakesOnGraph,
  markBricksOnGraph,
} from './store'
import { adddBrickToGraph } from './events'

type Entities = StoreValue<typeof $entities>

const updateGraphFx: Effect<Entities, Graph> = attach({
  source: $graph,
  effect: (graph, entities: Entities) => {
    graph.clear()

    markFoodOnGraph({ graph, foods: entities.foods })
    markSnakesOnGraph({ graph, snakes: entities.snakes })
    markBricksOnGraph({ graph, bricks: entities.bricks })

    return Graph.extend(graph)
  },
})

$graph.on(updateGraphFx.doneData, (_, next) => next)

sample({
  clock: combine({
    snakes: $snakes,
    foods: $foods,
    bricks: $bricks,
  }),
  target: updateGraphFx,
})

sample({
  source: $graph,
  clock: adddBrickToGraph,
  filter: (graph, brick) => {
    const vertex = graph.getVertex(getIndexByPosition(brick))

    return vertex
      ? vertex.value.type === PLACE_TYPE.EMPTY ||
          vertex.value.type === PLACE_TYPE.BRICK
      : false
  },
  fn: (_, brick) => brick,
  target: addBrick,
})
