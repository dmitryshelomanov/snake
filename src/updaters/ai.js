import { aStar } from '../algorithms'
import { manhattanDistance } from '../algorithms/heuristic'
import {
  getIndexByPosition,
  getPositionByIndex,
  getDifferenceBetweenPositions,
} from '../utils'
import { headSnake } from '../models/snake'
import { checkBounds } from '../collision'
import { getNextPositionByDirection, getDirectionByPosition } from '../controll'
import { PLACE_TYPE } from '../config'

function canTraverse(vertex) {
  return vertex.value === PLACE_TYPE.EMPTY || vertex.value === PLACE_TYPE.FOOD
}

function getCostByIndex() {
  return 1
}

function getNearestFood({ foods, graph, currentPosition }) {
  return (
    foods
      .filter(
        ([position]) =>
          graph.getVertex(getIndexByPosition(position)).value ===
          PLACE_TYPE.FOOD
      )
      .sort(
        (a, b) =>
          manhattanDistance(a[0], currentPosition) -
          manhattanDistance(b[0], currentPosition)
      )[0] || foods[0]
  )
}

export function ai({ snake, state, traverseAlgorithm, heuristic, withLogger }) {
  const { graph, foods } = state
  const currentPosition = headSnake(snake)
  const nearestFood = getNearestFood({ foods, currentPosition, graph })

  const result = traverseAlgorithm(
    getIndexByPosition(currentPosition),
    getIndexByPosition(nearestFood[0]),
    graph,
    {
      canTraverse,
      getCostByIndex,
      heuristic,
      withLogger,
    }
  )

  const pathPositions = result.path.map(getPositionByIndex)
  const processedPositions = result.processed.map(getPositionByIndex)
  const nextPosition =
    pathPositions[0] ||
    checkBounds(getNextPositionByDirection(headSnake(snake), snake.direction))
  const nextDirection = getDirectionByPosition(headSnake(snake), nextPosition)
  const diff = getDifferenceBetweenPositions(headSnake(snake), nextPosition)

  return {
    nextPosition,
    nextDirection: diff !== 1 ? snake.direction : nextDirection,
    meta: { processed: processedPositions, path: pathPositions },
  }
}
