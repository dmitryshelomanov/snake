/* eslint-disable no-loop-func */
import { getPositionByIndex } from '../utils'
import { restorePath } from './restore-path'

export function depthFirstSearch(startIndex, endIndex, graph, canTraverse) {
  const stack = [startIndex]
  const processed = new Map([[startIndex, true]])
  const parent = {}
  let isTraverse = false

  while (!isTraverse && stack.length > 0) {
    const currentIndex = stack.shift()

    graph
      .getNeighbors(currentIndex)
      .filter((index) => !processed.has(index) && canTraverse(index))
      .forEach((index) => {
        parent[index] = currentIndex
        stack.unshift(index)
        processed.set(index, true)

        if (index === endIndex) {
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
