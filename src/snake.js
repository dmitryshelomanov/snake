import { convertLocalPositionToGlobal, randomId } from './utils'
import { borderSize, cellSize } from './config'
import { drawSquare } from './renderer'
import { DIRECTIONS } from './controll'

export function buildSnake(headPosition) {
  return {
    id: randomId(),
    body: [headPosition, [headPosition[0] + 1, headPosition[1]]],
    isCrash: false,
    dir: DIRECTIONS.RIGHT,
    weight: 1,
    score: 0,
  }
}

export function moveSnake(snake, nextPosition) {
  const [_, ...rest] = snake.body

  if (nextPosition) {
    snake.body = [...rest, nextPosition]
  }
}

export function clearSnake(ctx, snake) {
  for (let i = 0; i < snake.body.length; i++) {
    const size = cellSize - borderSize * 4
    const [x, y] = convertLocalPositionToGlobal(snake.body[i])

    ctx.clearRect(x + borderSize + 2, y + borderSize + 2, size, size)
  }
}

export function headSnake(snake) {
  return snake.body[snake.body.length - 1]
}

export function tailSnake(snake) {
  return snake.body.slice(1, snake.body.length - 1)
}

export function drawSnake(ctx, snake, callback) {
  for (let i = 0; i < snake.body.length; i++) {
    const isHead = i === snake.body.length - 1
    const color = isHead ? 'rgb(0, 221, 0)' : 'rgb(152, 251, 152)'
    const crashedColor = isHead ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.6)'

    callback(i, snake.body[i])
    drawSquare(ctx, snake.body[i], snake.isCrash ? crashedColor : color)
  }
}

export function addPeaceOfSnake(snake, peaceOfSnake) {
  snake.body.push(peaceOfSnake)
}

export function setDirection(snake, dir) {
  snake.dir = dir
}

export function eatTarget(snake) {
  snake.score += 1
}
