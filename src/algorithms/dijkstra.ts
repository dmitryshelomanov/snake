/* eslint-disable no-loop-func */
import PriorityQueue from 'fastpriorityqueue'
import { createOperationLogger } from '../utils'
import { restorePath } from './restore-path'
import { createFirstEmptyCellSaver } from './utils'
import { Vertex, Graph } from './graph'

type Props = {
  canTraverse: (arg0: Vertex) => boolean
  getCostByIndex: (arg0: Vertex) => number
  withLogger?: boolean
}

export function dijkstra(
  startIndex: number,
  endIndex: number,
  graph: Graph,
  { canTraverse, getCostByIndex, withLogger = false }: Props
) {
  const queue = new PriorityQueue<[number, number]>((a, b) => a[1] < b[1])
  const processed = new Map([[startIndex, true]])
  const parent = {}
  const costFar = {
    [startIndex]: true,
  }
  let isTraverse = false
  const logger = createOperationLogger('dijkstra')
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
        // @ts-ignore
        const nextCost = costFar[currentChild[0]] + getCostByIndex(next)
        const nextCostIsLower = nextCost <= (costFar[nextIndex] || Infinity)

        if (nextCostIsLower) {
          queue.add([nextIndex, nextCost])
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
