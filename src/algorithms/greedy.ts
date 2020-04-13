/* eslint-disable no-loop-func */
import PriorityQueue from 'fastpriorityqueue'
import { getPositionByIndex, createOperationLogger } from '../utils'
import { restorePathFromMap } from './restore-path'
import { manhattanDistance } from './heuristic'
import { Vertex, Graph } from './graph'

export function greedy({
  startIndex,
  endIndex,
  graph,
  canTraverse,
  withLogger = false,
  heuristic = manhattanDistance,
}: TraverseAlgorithmProps<Graph, Vertex>): TraverseAlgorithmResult {
  const queue = new PriorityQueue<[number, number]>((a, b) => a[1] < b[1])
  const processed = new Map([[startIndex, true]])
  const parent = new Map()
  const goal = getPositionByIndex(endIndex)

  let isTraverse = false
  let path: Array<number> = []

  const logger = createOperationLogger('greedy')

  queue.add([startIndex, 0])

  while (!isTraverse && !queue.isEmpty()) {
    const [currentIndex] = queue.poll() || []
    const vertex = graph.getVertex(currentIndex)

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; vertex && i < vertex.neigbors.length; i++) {
      const nextIndex = vertex.neigbors[i]
      const nextVertex = graph.getVertex(nextIndex)

      if (nextVertex && canTraverse(nextVertex) && !processed.has(nextIndex)) {
        const nextCost = heuristic({
          p1: goal,
          p: getPositionByIndex(nextIndex),
        })

        queue.add([nextIndex, nextCost])
        processed.set(nextIndex, true)
        parent.set(nextIndex, currentIndex)

        if (endIndex === nextIndex) {
          isTraverse = true
          break
        }

        logger.increment()
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
