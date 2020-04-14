import { DIRECTIONS } from '../config'
import { getNextPositionByDirection } from '../controll'
import { checkBounds } from '../collision'
import { keyboradFactory, KEYS } from '../keyboard'
import { headSnake, Snake } from '../models/snake'

const gameInput = keyboradFactory()

export function user({
  snake,
}: {
  snake: Snake
}): { nextPosition: Coords; nextDirection: DIRECTIONS } {
  let { direction } = snake

  if (
    gameInput.isDown(KEYS.RIGHT_ARROW) &&
    snake.direction !== DIRECTIONS.LEFT
  ) {
    direction = DIRECTIONS.RIGHT
  }

  if (gameInput.isDown(KEYS.DOWN_ARROW) && snake.direction !== DIRECTIONS.TOP) {
    direction = DIRECTIONS.DOWN
  }

  if (
    gameInput.isDown(KEYS.LEFT_ARROW) &&
    snake.direction !== DIRECTIONS.RIGHT
  ) {
    direction = DIRECTIONS.LEFT
  }

  if (gameInput.isDown(KEYS.TOP_ARROW) && snake.direction !== DIRECTIONS.DOWN) {
    direction = DIRECTIONS.TOP
  }

  return {
    nextPosition: checkBounds(
      getNextPositionByDirection(headSnake(snake), direction)
    ),
    nextDirection: direction,
  }
}
