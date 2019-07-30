/* eslint-disable unicorn/prevent-abbreviations */
import { getLocalSize, getGlobalSize, getIndexByPosition } from './utils'
import { buildGrid, renderApple, renderPath } from './renderer'
import { pageHeight, pageWidth, fps, DIRECTIONS } from './config'
import {
  createTimeController,
  getNextPositionByDirection,
  getDirectionByPosition,
  registerClickEventToCanvas,
} from './controll'
import { oneToOneCollision, checkBounds } from './collision'
import { convigureCanvas } from './canvas'
import { headSnake } from './model/snake'
import { Graph } from './algorithms'
import { keyboradFactory, KEYS } from './keyboard'
import { renderGUI } from './GUI'
import {
  PLACE_TYPE,
  getAppleState,
  getSnakesState,
  getGameMapState,
  getActiveAlgorithmStore,
  getGameCollisionState,
  getBrickState,
  getShowAIPathToTargetState,
  onClearGameMap,
  onUpdateGameMap,
  onCrashSnake,
  onEatApple,
  onMoveSnake,
  onSetDirectionForSnake,
} from './model'
import { renderSnakes } from './snake'
import { renderBricks } from './brick'
import 'reset-css'

const gameInput = keyboradFactory()

const updaters = {
  ai: (self, nextState) => {
    const { alg: traverseAlgorithm } = getActiveAlgorithmStore()
    const gameMapState = getGameMapState()
    const collisionState = getGameCollisionState()

    function canTraverse(index) {
      return !collisionState
        ? true
        : [PLACE_TYPE.EMPTY, PLACE_TYPE.FOOD].includes(gameMapState[index])
    }

    const apple = getAppleState()

    const result = traverseAlgorithm(
      getIndexByPosition(headSnake(self)),
      getIndexByPosition(apple),
      nextState.graph,
      canTraverse
    )

    nextState.path = result.path

    const nextPosition =
      result.path[0] ||
      getNextPositionByDirection(headSnake(self), self.direction)

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

function main(canvas, context) {
  renderGUI()
  registerClickEventToCanvas(canvas)

  const gridData = buildGrid(context)
  const localSize = getLocalSize(pageWidth, pageHeight)
  const globalSize = getGlobalSize(localSize.w, localSize.h)

  const state = {
    graph: new Graph(localSize),
    prevSnakes: [],
    prevApple: [0, 0],
    prevBriks: [],
    path: [],
  }

  const nextTick = createTimeController(fps)

  convigureCanvas(canvas, localSize, globalSize)

  function eatApple(snake) {
    if (!snake.isCrash) {
      oneToOneCollision(headSnake(snake), getAppleState(), () => {
        const peaceOfSnake = getNextPositionByDirection(
          headSnake(snake),
          snake.direction
        )

        onEatApple({ id: snake.id, peaceOfSnake })
      })
    }
  }

  function checkCollision(snake) {
    const collisionState = getGameCollisionState()

    if (collisionState) {
      const gameMap = getGameMapState()
      const headIndex = getIndexByPosition(headSnake(snake))
      const isCrash = [PLACE_TYPE.GAME_OBJECT, PLACE_TYPE.BRICK].includes(
        gameMap[headIndex]
      )

      if (isCrash) {
        onCrashSnake(snake.id)
      }
    }
  }

  function clearCell(position) {
    const index = getIndexByPosition(position)

    onClearGameMap(index)
  }

  function clearGame() {
    context.clearRect(0, 0, globalSize.w, globalSize.h)
    clearCell([state.prevApple])
    state.prevSnakes.forEach((snake) => {
      snake.body.forEach(clearCell)
    })
  }

  function clearBricks() {
    state.prevBriks.forEach(clearCell)
  }

  nextTick.start((isPLay) => {
    const showAIPathToTargetState = getShowAIPathToTargetState()

    function updateGameMap(placeType) {
      return (index) => {
        onUpdateGameMap({ index, placeType })
      }
    }

    const apple = getAppleState()

    if (isPLay) {
      getSnakesState().forEach((snake) => {
        if (!snake.isCrash) {
          updaters[snake.id](snake, state)
        }
      })

      const snakes = getSnakesState()

      snakes.forEach(eatApple)
      snakes.forEach(checkCollision)
    }

    const bricks = getBrickState()

    state.prevBriks = bricks

    clearGame()
    clearBricks()

    const snakes = getSnakesState()

    state.prevSnakes = snakes
    state.prevApple = apple

    renderApple(context, apple, updateGameMap(PLACE_TYPE.FOOD))
    renderBricks(context, bricks, updateGameMap(PLACE_TYPE.BRICK))
    renderSnakes(context, snakes, updateGameMap(PLACE_TYPE.GAME_OBJECT))

    if (showAIPathToTargetState) {
      renderPath(context, state.path)
    }

    gridData.applyStyles()
    context.stroke(gridData.grid)
  })
}

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

main(canvas, context)
