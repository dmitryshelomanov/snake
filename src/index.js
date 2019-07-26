import {
  getLocalSize,
  getGlobalSize,
  randomPosition,
  getIndexByPosition,
} from './utils'
import { drawSquare, drawGrid } from './renderer'
import { pageHeight, pageWidth, interval } from './config'
import {
  createTimeController,
  getNextPositionByDirection,
  getDirectionByPosition,
  DIRECTIONS,
} from './controll'
import { oneToOneCollision, checkBounds } from './collision'
import { convigureCanvas } from './canvas'
import {
  moveSnake,
  Snake,
  headSnake,
  addPeaceOfSnake,
  setDirection,
  eatTarget,
  renderSnakes,
  clearSnakes,
} from './snake'
import { breadthFirstSearch, Graph } from './algorithms'
import { setScore } from './score'
import { keyboradFactory, KEYS } from './keyboard'
import { renderGUI } from './GUI'
import 'reset-css'

function buildAI() {
  return Snake.build(randomPosition(), {
    colors: {
      head: 'rgb(0, 221, 0)',
      tail: 'rgb(152, 251, 152)',
    },
    updater: (self, nextState) => {
      function canTraverse(index) {
        return typeof nextState.gameMap.get(index) === 'undefined'
      }

      const result = breadthFirstSearch(
        getIndexByPosition(headSnake(self)),
        getIndexByPosition(nextState.apple),
        nextState.graph,
        canTraverse
      )

      const nextPosition =
        result.path[0] ||
        getNextPositionByDirection(headSnake(self), self.direction)

      setDirection(self, getDirectionByPosition(headSnake(self), nextPosition))

      moveSnake(self, nextPosition)
    },
  })
}

function buildUserSnake() {
  const gameInput = keyboradFactory()

  return Snake.build(randomPosition(), {
    colors: {
      head: 'rgb(0, 132, 255)',
      tail: 'rgba(0, 132, 255, 0.7)',
    },
    updater: (self) => {
      const headPosition = getNextPositionByDirection(
        headSnake(self),
        self.direction
      )
      const nextPosition = checkBounds(headPosition)

      moveSnake(self, nextPosition)

      if (
        gameInput.isDown(KEYS.RIGHT_ARROW) &&
        self.direction !== DIRECTIONS.LEFT
      ) {
        setDirection(self, DIRECTIONS.RIGHT)
      }

      if (
        gameInput.isDown(KEYS.DOWN_ARROW) &&
        self.direction !== DIRECTIONS.TOP
      ) {
        setDirection(self, DIRECTIONS.DOWN)
      }

      if (
        gameInput.isDown(KEYS.LEFT_ARROW) &&
        self.direction !== DIRECTIONS.RIGHT
      ) {
        setDirection(self, DIRECTIONS.LEFT)
      }

      if (
        gameInput.isDown(KEYS.TOP_ARROW) &&
        self.direction !== DIRECTIONS.DOWN
      ) {
        setDirection(self, DIRECTIONS.TOP)
      }
    },
  })
}

function main(canvas, context) {
  renderGUI()

  const localSize = getLocalSize(pageWidth, pageHeight)
  const globalSize = getGlobalSize(localSize.w, localSize.h)

  const state = {
    apple: randomPosition(),
    graph: new Graph(localSize),
    snakes: [buildAI(), buildUserSnake()],
    gameMap: new Map(),
  }

  const nextTick = createTimeController(interval)

  convigureCanvas(canvas, localSize, globalSize)

  function eatApple(snake) {
    oneToOneCollision(headSnake(snake), state.apple, () => {
      state.apple = randomPosition()

      eatTarget(snake)
      setScore(snake.id, { score: snake.score, color: snake.colors.head })

      const peaceOfSnake = getNextPositionByDirection(
        headSnake(snake),
        snake.direction
      )

      addPeaceOfSnake(snake, peaceOfSnake)
    })
  }

  function checkCollision(snake) {
    const headIndex = getIndexByPosition(headSnake(snake))
    const isCrash = state.gameMap.get(headIndex) === 1

    if (isCrash) {
      snake.isCrash = true
    }
  }

  nextTick.start(() => {
    nextTick.pause()
    clearSnakes(context, state.snakes)

    state.snakes.forEach((snake) => {
      if (!snake.isCrash) {
        snake.updater(snake, state)
      }
    })

    state.snakes.forEach(eatApple)
    state.snakes.forEach(checkCollision)

    state.gameMap.clear()

    renderSnakes(context, state.snakes, (i) => {
      state.gameMap.set(i, 1)
    })

    drawSquare(context, state.apple, 'rgb(238, 68, 0)')
  })

  drawGrid(context)
}

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

main(canvas, context)
