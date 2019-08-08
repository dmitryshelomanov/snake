/* eslint-disable unicorn/prevent-abbreviations */
import {
  getLocalSize,
  getGlobalSize,
  getIndexByPosition,
  extractTypeFromMap,
} from './utils'
import { buildGrid, renderPath, renderProcessed } from './renderer'
import { pageHeight, pageWidth, fps } from './config'
import {
  createTimeController,
  getNextPositionByDirection,
  registerClickEventToCanvas,
} from './controll'
import { convigureCanvas } from './canvas'
import { headSnake } from './model/snake'
import { Graph } from './algorithms'
import { renderGUI } from './GUI'
import {
  PLACE_TYPE,
  getFoodsState,
  getSnakesState,
  getGameMapState,
  getGameCollisionState,
  getBrickState,
  getSettingsForSnakeState,
  onClearGameMap,
  onCrashSnake,
  onEatFood,
  onUpdateGameMapWithNexState,
  onUpdateGameMap,
} from './model'
import { batchUpdateSnakeStateForGameMap, renderSnake } from './snake'
import { renderBricks } from './brick'
import { updaters } from './updaters'
import { renderFoods, updateGameMapForFood } from './food'
import 'reset-css'

function main(canvas, context) {
  renderGUI()
  registerClickEventToCanvas(canvas)
  registerClickEventToCanvas.releaseRegistredEvents()

  const gridData = buildGrid(context)
  const localSize = getLocalSize(pageWidth, pageHeight)
  const globalSize = getGlobalSize(localSize.w, localSize.h)

  const state = {
    graph: new Graph(localSize),
    path: {},
    processed: {},
  }

  const nextTick = createTimeController(fps)

  convigureCanvas(canvas, localSize, globalSize)

  function eatFood(snake) {
    if (!snake.isCrash) {
      const gameMap = getGameMapState()
      const headIndex = getIndexByPosition(headSnake(snake))
      const isArray = Array.isArray(gameMap[headIndex])

      if (isArray && gameMap[headIndex][0] === PLACE_TYPE.FOOD) {
        const peaceOfSnake = getNextPositionByDirection(
          headSnake(snake),
          snake.direction
        )

        onEatFood({ id: snake.id, peaceOfSnake, foodId: gameMap[headIndex][1] })
      }
    }
  }

  function checkCollision(snake) {
    const collisionState = getGameCollisionState()

    if (collisionState) {
      const gameMap = getGameMapState()
      const headIndex = getIndexByPosition(headSnake(snake))
      const isCrash = [PLACE_TYPE.GAME_OBJECT, PLACE_TYPE.BRICK].includes(
        extractTypeFromMap(gameMap[headIndex])
      )

      if (isCrash) {
        onCrashSnake(snake.id)
      }
    }
  }

  function clearGame() {
    context.clearRect(0, 0, globalSize.w, globalSize.h)
    onClearGameMap()
  }

  function updateGameMap(placeType) {
    return (index) => {
      onUpdateGameMap({ index, placeType })
    }
  }

  nextTick.start((isPLay) => {
    const foods = getFoodsState()

    if (isPLay) {
      getSnakesState().forEach((snake) => {
        if (!snake.isCrash) {
          const isAi = /ai/.test(snake.id)
          const updater = isAi ? 'ai' : 'user'

          updaters[updater](snake, state)
        }
      })

      const snakes = getSnakesState()

      snakes.forEach(eatFood)
      snakes.forEach(checkCollision)
    }

    const bricks = getBrickState()

    clearGame()

    const snakes = getSnakesState()

    onUpdateGameMapWithNexState(batchUpdateSnakeStateForGameMap(snakes))

    snakes.forEach((snake) => {
      const {
        showAIPathToTarget,
        showProcessedCells,
      } = getSettingsForSnakeState(snake.id)

      if (showProcessedCells) {
        renderProcessed(context, state.processed[snake.id] || [])
      }

      if (showAIPathToTarget) {
        renderPath(context, state.path[snake.id] || [], snake.colors.head)
      }

      renderSnake(context, snake)
    })

    renderFoods(context, foods, updateGameMapForFood())
    renderBricks(context, bricks, updateGameMap(PLACE_TYPE.BRICK))

    gridData.applyStyles()
    context.stroke(gridData.grid)
  })
}

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

main(canvas, context)
