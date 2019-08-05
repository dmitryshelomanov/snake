/* eslint-disable no-loop-func */
import PriorityQueue from 'fastpriorityqueue'
import { getPositionByIndex } from '../utils'
import { restorePath } from './restore-path'
import { manhattanDistance } from './heuristic'

export function greedy(
  startIndex,
  endIndex,
  graph,
  { canTraverse, heuristic = manhattanDistance }
) {
  const queue = new PriorityQueue((a, b) => a[1] < b[1])
  const processed = new Map()
  const parent = {}
  const goal = getPositionByIndex(endIndex)
  let isTraverse = false

  queue.add([startIndex, 0])

  while (!isTraverse && !queue.isEmpty()) {
    const currentChild = queue.poll()
    const neigbors = graph.getNeighbors(currentChild[0])

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < neigbors.length; i++) {
      const next = neigbors[i]

      if (canTraverse(next)) {
        const nextCost = heuristic(goal, getPositionByIndex(next))

        if (!processed.has(next)) {
          queue.add([next, nextCost])
          processed.set(next, true)
          // eslint-disable-next-line prefer-destructuring
          parent[next] = currentChild[0]

          if (endIndex === next) {
            isTraverse = true
            break
          }
        }
      }
    }
  }

  return {
    path: isTraverse ? restorePath(endIndex, startIndex, parent) : [],
    processed: [...processed.keys()],
  }
}
