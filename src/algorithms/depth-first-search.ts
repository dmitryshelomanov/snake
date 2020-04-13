/* eslint-disable no-loop-func */
import { createOperationLogger } from '../utils'
import { restorePathFromMap } from './restore-path'
import { Vertex, Graph } from './graph'

export function depthFirstSearch({
  startIndex,
  endIndex,
  graph,
  canTraverse,
  withLogger = false,
}: TraverseAlgorithmProps<Graph, Vertex>): TraverseAlgorithmResult {
  const stack = [startIndex]
  const processed = new Map([[startIndex, true]])
  const parent = new Map()

  let path: Array<number> = []
  let isTraverse = false

  const logger = createOperationLogger('depthFirstSearch')

  while (!isTraverse && stack.length > 0) {
    const currentIndex = stack.shift()
    const vertex = graph.getVertex(currentIndex)

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; vertex && i < vertex.neigbors.length; i++) {
      const nextIndex = vertex.neigbors[i]
      const nextVertex = graph.getVertex(nextIndex)

      if (nextVertex && canTraverse(nextVertex) && !processed.has(nextIndex)) {
        parent[nextIndex] = currentIndex
        stack.unshift(nextIndex)
        processed.set(nextIndex, true)

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
