import { getIndexByPosition } from '../utils'
import { drawSquare, renderText } from './shapes'

export function renderSnake({ context, snake, indexesVisible = false }) {
  for (let i = 0; i < snake.body.length; i++) {
    const isHead = i === snake.body.length - 1
    const color = isHead ? snake.colors.head : snake.colors.tail
    const crashedColor = isHead ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.6)'
    const index = getIndexByPosition(snake.body[i])

    drawSquare(context, snake.body[i], {
      color: snake.isCrash ? crashedColor : color,
    })

    if (isHead && indexesVisible) {
      renderText(context, index, snake.body[i])
    }
  }
}

export function renderSnakes(context, snakes = []) {
  snakes.forEach((snake) => {
    renderSnake(context, snake)
  })
}
