/* eslint-disable no-loop-func */
import PriorityQueue from 'fastpriorityqueue'
import { createOperationLogger, getPositionByIndex } from '../utils'
import { restorePath } from './restore-path'
import { manhattanDistance } from './heuristic'
import { createFirstEmptyCellSaver } from './utils'

export function aStar(
  startIndex,
  endIndex,
  graph,
  {
    canTraverse,
    getCostByIndex,
    withLogger = false,
    heuristic = manhattanDistance,
  }
) {
  const goal = getPositionByIndex(endIndex)
  const queue = new PriorityQueue((a, b) => a[1] < b[1])
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
    const currentChild = queue.poll()
    const vertex = graph.getVertex(currentChild[0])

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; vertex && i < vertex.neigbors.length; i++) {
      const next = vertex.neigbors[i]

      if (canTraverse(graph.getVertex(next), next)) {
        const nextCost = costFar[currentChild[0]] + getCostByIndex(next)
        const nextCostIsLower = nextCost < (costFar[next] || Infinity)

        if (nextCostIsLower && !processed.has(next)) {
          queue.add([
            next,
            nextCost + heuristic(goal, getPositionByIndex(next)),
          ])
          processed.set(next, true)
          costFar[next] = nextCost
          // eslint-disable-next-line prefer-destructuring
          parent[next] = currentChild[0]

          if (endIndex === next) {
            isTraverse = true
            break
          }

          saveCell(next)
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
