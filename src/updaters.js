import { getIndexByPosition, getPositionByIndex } from './utils'
import { DIRECTIONS } from './config'
import { getNextPositionByDirection, getDirectionByPosition } from './controll'
import { checkBounds } from './collision'
import { headSnake } from './model/snake'
import {
  PLACE_TYPE,
  getGameMapState,
  getGameCollisionState,
  getLoggerState,
  getSettingsForSnakeState,
  getAlgorithmStateById,
  getHeuristicStateById,
  getNearestFood,
  onMoveSnake,
  onSetDirectionForSnake,
} from './model'
import { keyboradFactory, KEYS } from './keyboard'

const gameInput = keyboradFactory()

function extractTypeFromMap(place) {
  if (Array.isArray(place)) {
    return place[0]
  }

  return place
}

export const updaters = {
  ai: (self, nextState) => {
    const { activeAlgorithm, activeHeuristic } = getSettingsForSnakeState(
      self.id
    )
    const { alg: heuristic } = getHeuristicStateById(activeHeuristic)
    const { alg: traverseAlgorithm } = getAlgorithmStateById(activeAlgorithm)
    const gameMapState = getGameMapState()
    const collisionState = getGameCollisionState()
    const withLogger = getLoggerState()

    function canTraverse(index) {
      return !collisionState
        ? true
        : [PLACE_TYPE.EMPTY, PLACE_TYPE.FOOD].includes(
            extractTypeFromMap(gameMapState[index])
          )
    }

    function getCostByIndex() {
      return 1
    }

    const [target] = getNearestFood(headSnake(self))

    const result = traverseAlgorithm(
      getIndexByPosition(headSnake(self)),
      getIndexByPosition(target),
      nextState.graph,
      {
        canTraverse,
        getCostByIndex,
        heuristic,
        withLogger,
      }
    )

    const pathPositions = result.path.map(getPositionByIndex)
    const processedPositions = result.processed.map(getPositionByIndex)

    nextState.path[self.id] = pathPositions
    nextState.processed = processedPositions

    const headPosition =
      pathPositions[0] ||
      getNextPositionByDirection(headSnake(self), self.direction)

    const nextPosition = checkBounds(headPosition)

    onSetDirectionForSnake({
      id: self.id,
      direction: getDirectionByPosition(headSnake(self), nextPosition),
    })

    onMoveSnake({ id: self.id, nextPosition })
  },
  user: (self) => {
    const headPosition = getNextPositionByDirection(
      headSnake(self),
      self.direction
    )
    const nextPosition = checkBounds(headPosition)

    onMoveSnake({ id: self.id, nextPosition })

    if (
      gameInput.isDown(KEYS.RIGHT_ARROW) &&
      self.direction !== DIRECTIONS.LEFT
    ) {
      onSetDirectionForSnake({
        id: self.id,
        direction: DIRECTIONS.RIGHT,
      })
    }

    if (
      gameInput.isDown(KEYS.DOWN_ARROW) &&
      self.direction !== DIRECTIONS.TOP
    ) {
      onSetDirectionForSnake({
        id: self.id,
        direction: DIRECTIONS.DOWN,
      })
    }

    if (
      gameInput.isDown(KEYS.LEFT_ARROW) &&
      self.direction !== DIRECTIONS.RIGHT
    ) {
      onSetDirectionForSnake({
        id: self.id,
        direction: DIRECTIONS.LEFT,
      })
    }

    if (
      gameInput.isDown(KEYS.TOP_ARROW) &&
      self.direction !== DIRECTIONS.DOWN
    ) {
      onSetDirectionForSnake({
        id: self.id,
        direction: DIRECTIONS.TOP,
      })
    }
  },
}
