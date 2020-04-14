/* eslint-disable prefer-destructuring */
import { manhattanDistance } from '../algorithms/heuristic'
import {
  getIndexByPosition,
  getPositionByIndex,
  getDifferenceBetweenPositions,
} from '../utils'
import { headSnake, Snake } from '../models/snake'
import { checkBounds } from '../collision'
import { getNextPositionByDirection, getDirectionByPosition } from '../controll'
import { PLACE_TYPE, DIRECTIONS } from '../config'
import { Graph, Vertex } from '../algorithms'

function getNearestFoodIndex({
  foods,
  graph,
  currentPosition,
}: {
  foods: Array<Food>
  graph: Graph
  currentPosition: Coords
}): number | void {
  const food =
    foods
      .filter(
        ([position]) =>
          // @ts-ignore
          graph.getVertex(getIndexByPosition(position)).value.type ===
          PLACE_TYPE.FOOD
      )
      .sort(
        (a, b) =>
          manhattanDistance({ p1: a[0], p: currentPosition }) -
          manhattanDistance({ p1: b[0], p: currentPosition })
      )[0] || foods[0]

  return food ? getIndexByPosition(food[0]) : undefined
}

function getNextPositionForAISnake({
  snake,
  path,
  graph,
  canTraverse,
}: {
  snake: Snake
  path: Array<Coords>
  graph: Graph
  canTraverse: (arg0: Vertex) => boolean
}): Coords {
  if (path.length === 0) {
    const head = headSnake(snake)
    const idx = getIndexByPosition(head)
    const vertex = graph.getVertex(idx)
    let nextPosByDirection = checkBounds(
      getNextPositionByDirection(head, snake.direction)
    )

    if (vertex) {
      const availableVertexes = vertex.neigbors.filter((i) => {
        const v = graph.getVertex(i)

        return v ? canTraverse(v) : false
      })

      if (availableVertexes[0]) {
        nextPosByDirection = getPositionByIndex(availableVertexes[0])
      }
    }

    return nextPosByDirection
  }

  return path[0]
}

function canTraverseBuilder(isEnabledCollisionDetect: boolean) {
  return (vertex: Vertex): boolean => {
    return isEnabledCollisionDetect
      ? vertex.value.type === PLACE_TYPE.EMPTY ||
          vertex.value.type === PLACE_TYPE.FOOD
      : true
  }
}

function getCostByIndex(): number {
  return 1
}

type Props = {
  snake: Snake
  state: { graph: Graph; foods: Array<Food> }
  withLogger: boolean
  heuristic: HeuristicFunction
  isEnabledCollisionDetect: boolean
  traverseAlgorithm: TraverseAlgorithmFunction<Graph, Vertex>
}

export function ai({
  snake,
  state,
  traverseAlgorithm,
  heuristic,
  withLogger,
  isEnabledCollisionDetect,
}: Props): {
  nextPosition: Coords
  nextDirection: DIRECTIONS
  meta: { processed: Array<Coords>; path: Array<Coords> }
} {
  const { graph, foods } = state
  const currentPosition = headSnake(snake)
  const targetIndex = getNearestFoodIndex({ foods, currentPosition, graph })
  let path: Array<number> = []
  let processed: Array<number> = []

  if (targetIndex !== undefined) {
    const result = traverseAlgorithm({
      startIndex: getIndexByPosition(currentPosition),
      endIndex: targetIndex,
      graph,
      canTraverse: canTraverseBuilder(isEnabledCollisionDetect),
      getCostByIndex,
      heuristic,
      withLogger,
    })

    processed = result.processed
    path = result.path
  }

  const pathPositions = path.map(getPositionByIndex)
  const processedPositions = processed.map(getPositionByIndex)
  const nextPosition = getNextPositionForAISnake({
    snake,
    path: pathPositions,
    graph,
    canTraverse: canTraverseBuilder(isEnabledCollisionDetect),
  })
  const nextDirection = getDirectionByPosition(headSnake(snake), nextPosition)
  const diff = getDifferenceBetweenPositions(headSnake(snake), nextPosition)

  return {
    nextPosition,
    nextDirection: diff !== 1 ? snake.direction : nextDirection,
    meta: { processed: processedPositions, path: pathPositions },
  }
}
