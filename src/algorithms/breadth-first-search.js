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

    for (let i = 0; i < neighbors.length; i++) {
      if (neighbors[i]) {
        if (canTraverse(neighbors[i]) && !processed.has(neighbors[i])) {
          queue.push(neighbors[i])
          processed.set(neighbors[i], true)
          parent[neighbors[i]] = currentIndex

          if (endIndex === neighbors[i]) {
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
    processed: Array.from(processed.keys()).map(getPositionByIndex),
  }
}
