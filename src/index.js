import {
  getLocalSize,
  getGlobalSize,
  randomPosition,
  getIndexByPosition,
  getPositionByIndex,
} from './utils'
import { drawSquare, drawGrid, clearCell } from './renderer'
import { pageHeight, pageWidth, interval } from './config'
import {
  DIRECTIONS,
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
} from './snake'
import { breadthFirstSearch } from './algorithms'
import 'reset-css'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

function main(canvas, ctx) {
  const localSize = getLocalSize(pageWidth, pageHeight)
  const globalSize = getGlobalSize(localSize.w, localSize.h)

  /*

  snake: [
    {
      id: number,
      body: [x: number, y: number]
    }
  ]

  */

  const state = {
    isPressed: false,
    direction: DIRECTIONS.RIGHT,
    snake: buildSnake(randomPosition()),
    apple: randomPosition(),
    path: [],
    processed: [],
  }

  const nextTick = createTimeController(interval)

  convigureCanvas(canvas, localSize, globalSize)

  nextTick.start(() => {
    clearCell(ctx, [...state.snake, ...state.processed])

    const result = breadthFirstSearch(
      localSize,
      getIndexByPosition(headSnake(state.snake)),
      getIndexByPosition(state.apple),
      (index) => {
        const [x, y] = getPositionByIndex(index)

        return state.snake.find(([x1, y1]) => x1 === x && y1 === y)
      }
    )

    state.path = result.path
    state.processed = result.processed

    const nextPosition = state.path.shift()

    const dir = getDirectionByPosition(headSnake(state.snake), nextPosition)

    state.snake = moveSnake(state.snake, nextPosition)
    state.isPressed = false

    oneToOneCollision(nextPosition, state.apple, () => {
      state.apple = randomPosition()

      const peaceOfSnake = getNextPositionByDirection(nextPosition, dir)

      state.snake.push(peaceOfSnake)
    })

    drawSnake(ctx, state.snake)

    oneToManyCollision(headSnake(state.snake), tailSnake(state.snake), () => {
      console.log(
        'crash',
        { nextPosition, head: headSnake(state.snake) },
        state
      )
      clearCell(ctx, [...state.snake, ...state.processed])

      drawSnake(ctx, state.snake)

      nextTick.pause()
    })

    drawSquare(ctx, state.apple, 'rgb(238, 68, 0)')
  })

  drawGrid(ctx)
}

main(canvas, ctx)
