/* eslint-disable no-loop-func */
import PriorityQueue from 'fastpriorityqueue'
import { createOperationLogger } from '../utils'
import { restorePath } from './restore-path'

export function dijkstra(
  startIndex,
  endIndex,
  graph,
  { canTraverse, getCostByIndex, withLogger = false }
) {
  const queue = new PriorityQueue((a, b) => a.weight < b.weight)
  const processed = new Map()
  const parent = {}
  const costFar = {}
  let isTraverse = false
  const logger = createOperationLogger('dijkstra')

  queue.add({ index: startIndex, weight: 0 })
  costFar[startIndex] = 0

  while (!isTraverse && !queue.isEmpty()) {
    const { index: currentIndex } = queue.poll()
    const neigbors = graph.getNeighbors(currentIndex)

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < neigbors.length; i++) {
      const next = neigbors[i]

      if (canTraverse(next)) {
        const nextCost = costFar[currentIndex] + getCostByIndex(next)
        const nextCostIsLower = nextCost <= (costFar[next] || Infinity)

        if (nextCostIsLower && !processed.has(next)) {
          queue.add({ index: next, weight: nextCost })
          processed.set(next, true)
          costFar[next] = nextCost
          parent[next] = currentIndex

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
