import { convertLocalPositionToGlobal } from './utils'
import { borderSize, cellSize } from './config'
import { drawSquare } from './renderer'
import { checkCollision } from './collision'

export function buildSnake(headPosition) {
  return [headPosition, [headPosition[0] + 1, headPosition[1]]]
}

export function moveSnake(snake, nextPosition) {
  const [_, ...rest] = snake

  if (nextPosition) {
    return [...rest, nextPosition]
  }

  return snake
}

export function clearSnake(ctx, snake) {
  for (let i = 0; i < snake.length; i++) {
    const size = cellSize - borderSize * 4
    const [x, y] = convertLocalPositionToGlobal(snake[i])

    ctx.clearRect(x + borderSize + 2, y + borderSize + 2, size, size)
  }
}

export function headSnake(snake) {
  return snake[snake.length - 1]
}

export function tailSnake(snake) {
  return snake.slice(1, snake.length - 1)
}

export function drawSnake(ctx, snake = []) {
  for (let i = 0; i < snake.length; i++) {
    const isHead = i === snake.length - 1
    const color = isHead ? 'rgb(0, 221, 0)' : 'rgb(152, 251, 152)'

    drawSquare(ctx, snake[i], color)
  }
}
