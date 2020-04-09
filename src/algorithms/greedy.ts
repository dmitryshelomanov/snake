/* eslint-disable no-loop-func */
import PriorityQueue from 'fastpriorityqueue'
import { getPositionByIndex, createOperationLogger } from '../utils'
import { restorePath } from './restore-path'
import { manhattanDistance } from './heuristic'
import { createFirstEmptyCellSaver } from './utils'
import { Vertex, Graph } from './graph'

type Props = {
  canTraverse: (arg0: Vertex) => boolean
  withLogger?: boolean
  heuristic: (arg0: Coords, arg1: Coords) => number
}

export function greedy(
  startIndex: number,
  endIndex: number,
  graph: Graph,
  { canTraverse, heuristic = manhattanDistance, withLogger = false }: Props
) {
  const queue = new PriorityQueue<[number, number]>((a, b) => a[1] < b[1])
  const processed = new Map([[startIndex, true]])
  const parent = {}
  const goal = getPositionByIndex(endIndex)
  let isTraverse = false
  const logger = createOperationLogger('greedy')
  const { getCell, saveCell } = createFirstEmptyCellSaver()

  queue.add([startIndex, 0])

  while (!isTraverse && !queue.isEmpty()) {
    const [currentIndex] = queue.poll() || []
    const vertex = graph.getVertex(currentIndex)

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; vertex && i < vertex.neigbors.length; i++) {
      const nextIndex = vertex.neigbors[i]
      const nextVertex = graph.getVertex(nextIndex)

      if (nextVertex && canTraverse(nextVertex) && !processed.has(nextIndex)) {
        const nextCost = heuristic(goal, getPositionByIndex(nextIndex))

        queue.add([nextIndex, nextCost])
        processed.set(nextIndex, true)
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

  if (withLogger) {
    logger.log()
  }

  return {
    path: isTraverse ? restorePath(endIndex, startIndex, parent) : getCell(),
    processed: [...processed.keys()],
  }
}
