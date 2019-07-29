/* eslint-disable unicorn/prevent-abbreviations */
import { getLocalSize, getGlobalSize, getIndexByPosition } from './utils'
import { drawSquare, drawGrid, clearCells, renderBrick } from './renderer'
import { pageHeight, pageWidth, interval, DIRECTIONS } from './config'
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
  getAppleState,
  getSnakesState,
  getGameMapState,
  getActiveAlgorithmStore,
  getGameCollisionState,
  getBrickState,
  onClearGameMap,
  onUpdateGameMap,
  onCrashSnake,
  onEatApple,
  onMoveSnake,
  onSetDirectionForSnake,
} from './model'
import { clearSnakes, renderSnakes } from './snake'
import { renderBricks, clearBricks } from './brick'
import 'reset-css'

const gameInput = keyboradFactory()

const updaters = {
  ai: (self, nextState) => {
    const { alg: traverseAlgorithm } = getActiveAlgorithmStore()
    const gameMapState = getGameMapState()
    const collisionState = getGameCollisionState()

    function canTraverse(index) {
      return !collisionState ? true : typeof gameMapState[index] === 'undefined'
    }

    const apple = getAppleState()

    const result = traverseAlgorithm(
      getIndexByPosition(headSnake(self)),
      getIndexByPosition(apple),
      nextState.graph,
      canTraverse
    )

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

  const localSize = getLocalSize(pageWidth, pageHeight)
  const globalSize = getGlobalSize(localSize.w, localSize.h)

  const state = {
    graph: new Graph(localSize),
    prevSnakes: [],
    prevApple: [0, 0],
    prevBriks: [],
  }

  const nextTick = createTimeController(interval)

  convigureCanvas(canvas, localSize, globalSize)

  function eatApple(snake) {
    oneToOneCollision(headSnake(snake), getAppleState(), () => {
      const peaceOfSnake = getNextPositionByDirection(
        headSnake(snake),
        snake.direction
      )

      onEatApple({ id: snake.id, peaceOfSnake })
    })
  }

  function checkCollision(snake) {
    const collisionState = getGameCollisionState()

    if (collisionState) {
      const gameMap = getGameMapState()
      const headIndex = getIndexByPosition(headSnake(snake))
      const isCrash = gameMap[headIndex] === 1

      if (isCrash) {
        onCrashSnake(snake.id)
      }
    }
  }

  nextTick.start((isPLay, wasFirstRender) => {
    function updateGameMap(i) {
      onUpdateGameMap(i)
    }

    function cearGameMap(i) {
      onClearGameMap(i)
    }

    clearBricks(context, state.prevBriks, cearGameMap)

    const bricks = getBrickState()

    state.prevBriks = bricks

    renderBricks(context, bricks, updateGameMap)

    if (!wasFirstRender || isPLay) {
      const apple = getAppleState()

      getSnakesState().forEach((snake) => {
        if (!snake.isCrash) {
          updaters[snake.id](snake, state)
        }
      })

      const snakes = getSnakesState()

      snakes.forEach(eatApple)
      snakes.forEach(checkCollision)

      clearSnakes(context, state.prevSnakes, cearGameMap)
      clearCells(context, [state.prevApple], cearGameMap)

      state.prevSnakes = snakes
      state.prevApple = apple

      renderSnakes(context, snakes, updateGameMap)
      drawSquare(context, apple, 'rgb(238, 68, 0)')
    }
  })

  drawGrid(context)
}

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

main(canvas, context)
