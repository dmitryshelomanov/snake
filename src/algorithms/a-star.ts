/* eslint-disable no-loop-func */
import PriorityQueue from 'fastpriorityqueue'
import { createOperationLogger, getPositionByIndex } from '../utils'
import { restorePath } from './restore-path'
import { manhattanDistance } from './heuristic'
import { createFirstEmptyCellSaver } from './utils'
import { Graph, Vertex } from './graph'

type Props = {
  canTraverse: (arg0: Vertex) => boolean
  getCostByIndex: (arg0: Vertex) => number
  withLogger?: boolean
  heuristic: (arg0: Coords, arg1: Coords) => number
}

export function aStar(
  startIndex: number,
  endIndex: number,
  graph: Graph,
  {
    canTraverse,
    getCostByIndex,
    withLogger = false,
    heuristic = manhattanDistance,
  }: Props
) {
  const goal = getPositionByIndex(endIndex)
  const queue = new PriorityQueue<[number, number]>((a, b) => a[1] < b[1])
  const processed = new Map([[startIndex, true]])
  const parent = {}
  const costFar = {
    [startIndex]: 0,
  }
  let isTraverse = false
  const { getCell, saveCell } = createFirstEmptyCellSaver()
  const logger = createOperationLogger('aStar')

  queue.add([startIndex, 0])

  while (!isTraverse && !queue.isEmpty()) {
    const [currentIndex] = queue.poll() || []
    const vertex = graph.getVertex(currentIndex)

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; vertex && i < vertex.neigbors.length; i++) {
      const nextIndex = vertex.neigbors[i]
      const nextVertex = graph.getVertex(nextIndex)

      if (nextVertex && canTraverse(nextVertex)) {
        // @ts-ignore
        const nextCost = costFar[currentIndex] + getCostByIndex(nextVertex)
        const nextCostIsLower = nextCost < (costFar[nextIndex] || Infinity)

        if (nextCostIsLower && !processed.has(nextIndex)) {
          queue.add([
            nextIndex,
            nextCost + heuristic(goal, getPositionByIndex(nextIndex)),
          ])
          processed.set(nextIndex, true)
          costFar[nextIndex] = nextCost
          // eslint-disable-next-line prefer-destructuring
          parent[nextIndex] = currentIndex

          if (endIndex === nextIndex) {
            isTraverse = true
            break
          }

          saveCell(nextIndex)
          logger.increment()
        }
      }
    }
  }

  if (withLogger) {
    logger.log()
  }

  return {
    path: isTraverse ? restorePath(endIndex, startIndex, parent) : getCell(),
    processed: [...processed.keys()],
  }
}
