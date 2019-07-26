import { getPositionByIndex } from '../utils'

function restorePath(end, start, parent) {
  const path = [end]
  let goal = parent[end]

  while (goal !== start) {
    path.unshift(goal)
    goal = parent[goal]
  }

  return path
}

export function breadthFirstSearch(startIndex, endIndex, graph, canTraverse) {
  const queue = [startIndex]
  const processed = new Map()
  const parent = {}
  let isTraverse = false

  while (!isTraverse && queue.length > 0) {
    const currentIndex = queue.shift()
    const neighbors = graph.getNeighbors(currentIndex)

    for (const element of neighbors) {
      if (element) {
        if (canTraverse(element) && !processed.has(element)) {
          queue.push(element)
          processed.set(element, true)
          parent[element] = currentIndex

          if (endIndex === element) {
            isTraverse = true
            break
          }
        }
      }
    }
  }

  return {
    path: isTraverse
      ? restorePath(endIndex, startIndex, parent).map(getPositionByIndex)
      : [],
    processed: [...processed.keys()].map(getPositionByIndex),
  }
}
