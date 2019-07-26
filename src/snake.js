import {
  convertLocalPositionToGlobal,
  randomId,
  getIndexByPosition,
} from './utils'
import { borderSize, cellSize } from './config'
import { drawSquare } from './renderer'
import { DIRECTIONS } from './controll'

export class Snake {
  static build(headPosition, { colors, updater }) {
    return {
      id: randomId(),
      body: [headPosition, [headPosition[0] + 1, headPosition[1]]],
      isCrash: false,
      direction: DIRECTIONS.RIGHT,
      weight: 1,
      score: 0,
      updater,
      colors,
    }
  }
}

export function moveSnake(snake, nextPosition) {
  const [_, ...rest] = snake.body

  if (nextPosition) {
    snake.body = [...rest, nextPosition]
  }
}

export function clearSnake(context, snake) {
  for (let i = 0; i < snake.body.length; i++) {
    const size = cellSize - borderSize * 4
    const [x, y] = convertLocalPositionToGlobal(snake.body[i])

    context.clearRect(x + borderSize + 2, y + borderSize + 2, size, size)
  }
}

export function clearSnakes(context, snakes = []) {
  snakes.forEach((snake) => {
    clearSnake(context, snake)
  })
}

export function headSnake(snake) {
  return snake.body[snake.body.length - 1]
}

export function tailSnake(snake) {
  return snake.body.slice(1, snake.body.length - 1)
}

export function drawSnake(context, snake, callback) {
  for (let i = 0; i < snake.body.length; i++) {
    const isHead = i === snake.body.length - 1
    const color = isHead ? snake.colors.head : snake.colors.tail
    const crashedColor = isHead ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.6)'

    callback(getIndexByPosition(snake.body[i]), snake)
    drawSquare(context, snake.body[i], snake.isCrash ? crashedColor : color)
  }
}

export function renderSnakes(context, snakes = [], callback) {
  snakes.forEach((snake) => {
    drawSnake(context, snake, callback)
  })
}

export function addPeaceOfSnake(snake, peaceOfSnake) {
  snake.body.push(peaceOfSnake)
}

export function setDirection(snake, direction) {
  snake.direction = direction
}

export function eatTarget(snake) {
  snake.score += 1
}
