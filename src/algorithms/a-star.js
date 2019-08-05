/* eslint-disable no-loop-func */
import PriorityQueue from 'fastpriorityqueue'
import { createOperationLogger, getPositionByIndex } from '../utils'
import { restorePath } from './restore-path'
import { manhattanDistance } from './heuristic'

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
  const processed = new Map()
  const parent = {}
  const costFar = {}
  let isTraverse = false
  const logger = createOperationLogger('aStar')

  queue.add([startIndex, 0])
  costFar[startIndex] = 0

  while (!isTraverse && !queue.isEmpty()) {
    const currentChild = queue.poll()
    const neigbors = graph.getNeighbors(currentChild[0])

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < neigbors.length; i++) {
      const next = neigbors[i]

      if (canTraverse(next)) {
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

          logger.increment()
        }
      }
    }
  }

  if (withLogger) {
    logger.log()
  }

  return {
    path: isTraverse ? restorePath(endIndex, startIndex, parent) : [],
    processed: [...processed.keys()],
  }
}
