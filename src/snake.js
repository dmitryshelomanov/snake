import { getIndexByPosition } from './utils'
import { drawSquare } from './renderer'

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
