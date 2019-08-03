/* eslint-disable no-loop-func */
import { restorePath } from './restore-path'

export function breadthFirstSearch(
  startIndex,
  endIndex,
  graph,
  { canTraverse }
) {
  const queue = [startIndex]
  const processed = new Map()
  const parent = {}
  let isTraverse = false

  while (!isTraverse && queue.length > 0) {
    const currentIndex = queue.shift()
    const neigbors = graph.getNeighbors(currentIndex)

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < neigbors.length; i++) {
      const next = neigbors[i]

      if (canTraverse(next) && !processed.has(next)) {
        queue.push(next)
        processed.set(next, true)
        parent[next] = currentIndex

        if (endIndex === next) {
          isTraverse = true
          break
        }
      }
    }
  }

  return {
    path: isTraverse ? restorePath(endIndex, startIndex, parent) : [],
    processed: [...processed.keys()],
  }
}
