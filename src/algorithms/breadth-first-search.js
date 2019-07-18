import {
  getNeighborsByPosition,
  getIndexByPosition,
  getPositionByIndex,
} from '../utils'

function restorePath(end, start, parent) {
  const path = [end]
  let goal = parent[end]

  while (goal !== start) {
    path.unshift(goal)
    goal = parent[goal]
  }

  return path
}

export function breadthFirstSearch({ w, h }, startIndex, endIndex, isBlocked) {
  const queue = [startIndex]
  const processed = new Map()
  const parent = {}
  let isTraverse = false

  while (!isTraverse && queue.length > 0) {
    const currentIndex = queue.shift()
    const neighbors = getNeighborsByPosition(getPositionByIndex(currentIndex))

    for (let i = 0; i < neighbors.length; i++) {
      if (neighbors[i]) {
        const neighbourIndex = getIndexByPosition(neighbors[i])

        if (!processed.has(neighbourIndex) && !isBlocked(neighbourIndex)) {
          queue.push(neighbourIndex)
          processed.set(neighbourIndex, true)
          parent[neighbourIndex] = currentIndex

          if (endIndex === neighbourIndex) {
            isTraverse = true
            break
          }
        }
      }
    }
  }

  return {
    path: restorePath(endIndex, startIndex, parent).map(getPositionByIndex),
    processed: Array.from(processed.keys()).map(getPositionByIndex),
  }
}
