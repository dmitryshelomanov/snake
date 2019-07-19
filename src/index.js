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
} from './controll'
import { oneToManyCollision, oneToOneCollision } from './collision'
import { convigureCanvas } from './canvas'
import {
  moveSnake,
  clearSnake,
  buildSnake,
  headSnake,
  drawSnake,
  tailSnake,
  addPeaceOfSnake,
  setDirection,
  eatTarget,
} from './snake'
import { breadthFirstSearch, Graph } from './algorithms'
import { setScore } from './score'
import 'reset-css'

function main(canvas, ctx) {
  const localSize = getLocalSize(pageWidth, pageHeight)
  const globalSize = getGlobalSize(localSize.w, localSize.h)

  const state = {
    isPressed: false,
    snake: buildSnake(randomPosition()),
    apple: randomPosition(),
    graph: new Graph(localSize),
  }

  const nextTick = createTimeController(interval)

  convigureCanvas(canvas, localSize, globalSize)

  function renderSnake() {
    drawSnake(ctx, state.snake, (index) => {})
  }

  function canTraverse(index) {
    const [x, y] = getPositionByIndex(index)

    return !state.snake.body.find(([x1, y1]) => x1 === x && y1 === y)
  }

  nextTick.start(() => {
    clearSnake(ctx, state.snake)

    const result = breadthFirstSearch(
      getIndexByPosition(headSnake(state.snake)),
      getIndexByPosition(state.apple),
      state.graph,
      canTraverse
    )

    const nextPosition =
      result.path[0] ||
      getNextPositionByDirection(headSnake(state.snake), state.snake.dir)

    setDirection(
      state.snake,
      getDirectionByPosition(headSnake(state.snake), nextPosition)
    )

    moveSnake(state.snake, nextPosition)

    state.isPressed = false

    oneToOneCollision(nextPosition, state.apple, () => {
      state.apple = randomPosition()

      eatTarget(state.snake)
      setScore(state.snake.score)

      const peaceOfSnake = getNextPositionByDirection(
        nextPosition,
        state.snake.dir
      )

      addPeaceOfSnake(state.snake, peaceOfSnake)
    })

    renderSnake()

    oneToManyCollision(
      headSnake(state.snake),
      tailSnake(state.snake),
      (crashed) => {
        clearSnake(ctx, state.snake)

        state.snake.isCrash = true

        renderSnake()

        nextTick.pause()
      }
    )

    drawSquare(ctx, state.apple, 'rgb(238, 68, 0)')
  })

  drawGrid(ctx)
}

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

main(canvas, ctx)
