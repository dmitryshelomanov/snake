/* eslint-disable no-loop-func */
import PriorityQueue from 'fastpriorityqueue'
import { createOperationLogger, getPositionByIndex } from '../utils'
import { restorePathFromMap } from './restore-path'
import { manhattanDistance } from './heuristic'
import { Graph, Vertex } from './graph'

export function aStar({
  startIndex,
  endIndex,
  graph,
  canTraverse,
  getCostByIndex,
  withLogger = false,
  heuristic = manhattanDistance,
}: TraverseAlgorithmProps<Graph, Vertex>): TraverseAlgorithmResult {
  const goal = getPositionByIndex(endIndex)
  const queue = new PriorityQueue<[number, number]>((a, b) => a[1] < b[1])
  const processed = new Map([[startIndex, true]])
  const parent = new Map()
  const costFar = new Map([[startIndex, 0]])
  let isTraverse = false
  let path: Array<number> = []

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
        const nextCost = costFar.get(currentIndex) + getCostByIndex(nextVertex)
        const nextCostIsLower = nextCost < (costFar.get(nextIndex) || Infinity)

        if (nextCostIsLower && !processed.has(nextIndex)) {
          queue.add([
            nextIndex,
            nextCost +
              heuristic({ p1: goal, p: getPositionByIndex(nextIndex) }),
          ])
          processed.set(nextIndex, true)
          costFar.set(nextIndex, nextCost)
          parent.set(nextIndex, currentIndex)

          if (endIndex === nextIndex) {
            isTraverse = true
            break
          }

          logger.increment()
        }
      }
    }
  }

  if (isTraverse) {
    path = restorePathFromMap({ end: endIndex, start: startIndex, parent })
  }

  if (withLogger) {
    logger.log()
  }

  return {
    path,
    processed: [...processed.keys()],
  }
}
