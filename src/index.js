import {
  getLocalSize,
  getGlobalSize,
  randomPosition,
  getIndexByPosition,
  getPositionByIndex,
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
import 'reset-css'

function buildAI() {
  return Snake.build(randomPosition(), {
    colors: {
      head: 'rgb(0, 221, 0)',
      tail: 'rgb(152, 251, 152)',
    },
    updater: (self, nextState) => {
      function canTraverse(index) {
        const [x, y] = getPositionByIndex(index)

        return !self.body.find(([x1, y1]) => x1 === x && y1 === y)
      }

      const result = breadthFirstSearch(
        getIndexByPosition(headSnake(self)),
        getIndexByPosition(nextState.apple),
        nextState.graph,
        canTraverse
      )

      const nextPosition =
        result.path[0] || getNextPositionByDirection(headSnake(self), self.dir)

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
      const headPosition = getNextPositionByDirection(headSnake(self), self.dir)
      const nextPosition = checkBounds(headPosition)

      moveSnake(self, nextPosition)

      if (gameInput.isDown(KEYS.RIGHT_ARROW) && self.dir !== DIRECTIONS.LEFT) {
        setDirection(self, DIRECTIONS.RIGHT)
      }

      if (gameInput.isDown(KEYS.DOWN_ARROW) && self.dir !== DIRECTIONS.TOP) {
        setDirection(self, DIRECTIONS.DOWN)
      }

      if (gameInput.isDown(KEYS.LEFT_ARROW) && self.dir !== DIRECTIONS.RIGHT) {
        setDirection(self, DIRECTIONS.LEFT)
      }

      if (gameInput.isDown(KEYS.TOP_ARROW) && self.dir !== DIRECTIONS.DOWN) {
        setDirection(self, DIRECTIONS.TOP)
      }
    },
  })
}

function main(canvas, ctx) {
  const localSize = getLocalSize(pageWidth, pageHeight)
  const globalSize = getGlobalSize(localSize.w, localSize.h)

  const state = {
    apple: randomPosition(),
    graph: new Graph(localSize),
    snakes: [buildAI(), buildUserSnake()],
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
        snake.dir
      )

      addPeaceOfSnake(snake, peaceOfSnake)
    })
  }

  nextTick.start(() => {
    clearSnakes(ctx, state.snakes)

    state.snakes.forEach((snake) => {
      snake.updater(snake, state)
    })

    state.snakes.forEach(eatApple)

    renderSnakes(ctx, state.snakes)

    drawSquare(ctx, state.apple, 'rgb(238, 68, 0)')
  })

  drawGrid(ctx)
}

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

main(canvas, ctx)
