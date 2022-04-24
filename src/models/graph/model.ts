import { sample } from 'effector'
import { addBrick } from '../objects'
import { getIndexByPosition } from '../../utils'
import { PLACE_TYPE } from '../../config'
import { $graph } from './store'
import { adddBrickToGraph } from './events'

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
