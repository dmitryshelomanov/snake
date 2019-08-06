import { getIndexByPosition } from './utils'
import { drawSquare, renderText } from './renderer'
import { getIndexesVisibleStore, PLACE_TYPE } from './model'

export function drawSnake(context, snake) {
  for (let i = 0; i < snake.body.length; i++) {
    const isHead = i === snake.body.length - 1
    const color = isHead ? snake.colors.head : snake.colors.tail
    const crashedColor = isHead ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.6)'
    const index = getIndexByPosition(snake.body[i])

    drawSquare(context, snake.body[i], {
      color: snake.isCrash ? crashedColor : color,
    })

    if (isHead && getIndexesVisibleStore()) {
      renderText(context, index, snake.body[i])
    }
  }
}

export function renderSnakes(context, snakes = []) {
  snakes.forEach((snake) => {
    drawSnake(context, snake)
  })
}

export function batchUpdateSnakeStateForGameMap(currentSnakes) {
  const map = {}

  // eslint-disable-next-line unicorn/no-for-loop
  for (let i = 0; i < currentSnakes.length; i++) {
    for (let j = 0; j < currentSnakes[i].body.length; j++) {
      map[getIndexByPosition(currentSnakes[i].body[j])] = PLACE_TYPE.GAME_OBJECT
    }
  }

  return map
}
