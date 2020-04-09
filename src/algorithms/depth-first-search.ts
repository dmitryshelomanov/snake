/* eslint-disable no-loop-func */
import { createOperationLogger } from '../utils'
import { restorePath } from './restore-path'
import { createFirstEmptyCellSaver } from './utils'
import { Vertex, Graph } from './graph'

type Props = {
  canTraverse: (arg0: Vertex) => boolean
  withLogger?: boolean
}

export function depthFirstSearch(
  startIndex: number,
  endIndex: number,
  graph: Graph,
  { canTraverse, withLogger = false }: Props
) {
  const stack = [startIndex]
  const processed = new Map([[startIndex, true]])
  const parent = {}
  let isTraverse = false
  const logger = createOperationLogger('depthFirstSearch')
  const { getCell, saveCell } = createFirstEmptyCellSaver()

  while (!isTraverse && stack.length > 0) {
    const currentIndex = stack.shift()
    const vertex = graph.getVertex(currentIndex)

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; vertex && i < vertex.neigbors.length; i++) {
      const nextIndexx = vertex.neigbors[i]
      const nextVertex = graph.getVertex(nextIndexx)

      if (nextVertex && canTraverse(nextVertex) && !processed.has(nextIndexx)) {
        parent[nextIndexx] = currentIndex
        stack.unshift(nextIndexx)
        processed.set(nextIndexx, true)

        if (endIndex === nextIndexx) {
          isTraverse = true
          break
        }

        saveCell(nextIndexx)
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
