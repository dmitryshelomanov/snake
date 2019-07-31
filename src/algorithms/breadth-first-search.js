/* eslint-disable no-loop-func */
import { getPositionByIndex } from '../utils'
import { restorePath } from './restore-path'

export function breadthFirstSearch(startIndex, endIndex, graph, canTraverse) {
  const queue = [startIndex]
  const processed = new Map()
  const parent = {}
  let isTraverse = false

  while (!isTraverse && queue.length > 0) {
    const currentIndex = queue.shift()

    graph
      .getNeighbors(currentIndex)
      .filter((index) => canTraverse(index) && !processed.has(index))
      .forEach((index) => {
        queue.push(index)
        processed.set(index, true)
        parent[index] = currentIndex

        if (endIndex === index) {
          isTraverse = true
        }
      })
  }

  return {
    path: isTraverse
      ? restorePath(endIndex, startIndex, parent).map(getPositionByIndex)
      : [],
    processed: [...processed.keys()].map(getPositionByIndex),
  }
}
