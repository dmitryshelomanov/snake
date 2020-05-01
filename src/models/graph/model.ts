import { sample, guard } from 'effector'
import { Graph } from '../../algorithms'
import { addBrick } from '../objects'
import { getIndexByPosition } from '../../utils'
import { PLACE_TYPE } from '../../config'
import { $graph } from './store'
import { adddBrickToGraph } from './events'

guard(
  sample($graph, adddBrickToGraph, (graph, brick) => ({
    graph,
    brick,
  })),
  {
    filter: ({ graph, brick }) => {
      const vertex = graph.getVertex(getIndexByPosition(brick))

      return vertex
        ? vertex.value.type === PLACE_TYPE.EMPTY ||
            vertex.value.type === PLACE_TYPE.BRICK
        : false
    },
    target: addBrick.prepend(
      ({ brick }: { brick: Coords; graph: Graph }) => brick
    ),
  }
)
