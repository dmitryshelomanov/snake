import { getIndexByPosition } from '../utils'
import { Snake } from '../models/snake'
import { drawSquare, renderText } from './shapes'

export function renderSnake({
  context,
  snake,
  indexesVisible = false,
}: {
  context: CanvasRenderingContext2D
  snake: Snake
  indexesVisible?: boolean
}): void {
  for (let i = 0; i < snake.body.length; i++) {
    const isHead = i === snake.body.length - 1
    const color = isHead ? snake.colors.head : snake.colors.tail
    const crashedColor = isHead ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.6)'
    const index = getIndexByPosition(snake.body[i])

    drawSquare({
      context,
      position: snake.body[i],
      color: snake.isCrash ? crashedColor : color,
    })

    if (isHead && indexesVisible) {
      renderText({
        context,
        text: index.toString(),
        position: snake.body[i],
      })
    }
  }
}

export function renderSnakes({
  context,
  snakes = [],
}: {
  context: CanvasRenderingContext2D
  snakes: Array<Snake>
}): void {
  snakes.forEach((snake) => {
    renderSnake({ context, snake })
  })
}
