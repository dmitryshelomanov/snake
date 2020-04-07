/* eslint-disable no-loop-func */
import { createOperationLogger } from '../utils'
import { restorePath } from './restore-path'

export function depthFirstSearch(
  startIndex,
  endIndex,
  graph,
  { canTraverse, withLogger = false }
) {
  const stack = [startIndex]
  const processed = new Map([[startIndex, true]])
  const parent = {}
  let isTraverse = false
  const logger = createOperationLogger('depthFirstSearch')

  while (!isTraverse && stack.length > 0) {
    const currentIndex = stack.shift()
    const vertex = graph.getVertex(currentIndex)

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; vertex && i < vertex.neigbors.length; i++) {
      const next = vertex.neigbors[i]

      if (canTraverse(graph.getVertex(next), next) && !processed.has(next)) {
        parent[next] = currentIndex
        stack.unshift(next)
        processed.set(next, true)

        if (endIndex === next) {
          isTraverse = true
          break
        }

        logger.increment()
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
