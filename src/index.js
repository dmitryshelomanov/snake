/* eslint-disable unicorn/prevent-abbreviations */
import { getLocalSize, getGlobalSize, getIndexByPosition } from './utils'
import { buildGrid, renderApple, renderPath, drawSquare } from './renderer'
import { pageHeight, pageWidth, fps } from './config'
import {
  createTimeController,
  getNextPositionByDirection,
  registerClickEventToCanvas,
} from './controll'
import { oneToOneCollision } from './collision'
import { convigureCanvas } from './canvas'
import { headSnake } from './model/snake'
import { Graph } from './algorithms'
import { renderGUI } from './GUI'
import {
  PLACE_TYPE,
  getAppleState,
  getSnakesState,
  getGameMapState,
  getGameCollisionState,
  getBrickState,
  getShowAIPathToTargetState,
  onClearGameMap,
  onUpdateGameMap,
  onCrashSnake,
  onEatApple,
  getProcessedItemsVisibleState,
} from './model'
import { renderSnakes } from './snake'
import { renderBricks } from './brick'
import { updaters } from './updaters'
import 'reset-css'

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
    processed: [],
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

  function renderProcessedCell() {
    state.processed.forEach((position) => {
      drawSquare(context, position, { color: 'rgba(175, 238, 238, 0.8)' })
    })
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

    if (getProcessedItemsVisibleState()) {
      renderProcessedCell()
    }

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
