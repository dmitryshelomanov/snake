import PriorityQueue from 'fastpriorityqueue'
import { createOperationLogger } from '../utils'
import { restorePathFromMap } from './restore-path'
import { Vertex, Graph } from './graph'

export function dijkstra({
  startIndex,
  endIndex,
  graph,
  canTraverse,
  getCostByIndex,
  withLogger = false,
}: TraverseAlgorithmProps<Graph, Vertex>): TraverseAlgorithmResult {
  const queue = new PriorityQueue<[number, number]>((a, b) => a[1] < b[1])
  const processed = new Map([[startIndex, true]])
  const parent = new Map()
  const costFar = new Map([[startIndex, 0]])

  let isTraverse = false
  let path: Array<number> = []

  const logger = createOperationLogger('dijkstra')

  queue.add([startIndex, 0])

  while (!isTraverse && !queue.isEmpty()) {
    const [currentIndex] = queue.poll() || []
    const vertex = graph.getVertex(currentIndex)

    for (let i = 0; vertex && i < vertex.neigbors.length; i++) {
      const nextIndex = vertex.neigbors[i]
      const nextVertex = graph.getVertex(nextIndex)

      if (nextVertex && canTraverse(nextVertex) && !processed.has(nextIndex)) {
        // @ts-ignore
        const nextCost = costFar.get(currentIndex) + getCostByIndex(nextIndex)
        const nextCostIsLower = nextCost <= (costFar.get(nextIndex) || Infinity)

        if (nextCostIsLower) {
          queue.add([nextIndex, nextCost])
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
