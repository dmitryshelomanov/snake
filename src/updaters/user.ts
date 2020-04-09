import { DIRECTIONS } from '../config'
import { getNextPositionByDirection } from '../controll'
import { checkBounds } from '../collision'
import { keyboradFactory, KEYS } from '../keyboard'
import { headSnake } from '../models/snake'

const gameInput = keyboradFactory()

export function user(self) {
  // const headPosition = getNextPositionByDirection(
  //   headSnake(self),
  //   self.direction
  // )
  // const nextPosition = checkBounds(headPosition)
  // moveSnake({ id: self.id, nextPosition })
  // if (
  //   gameInput.isDown(KEYS.RIGHT_ARROW) &&
  //   self.direction !== DIRECTIONS.LEFT
  // ) {
  //   setDirectionForSnake({
  //     id: self.id,
  //     direction: DIRECTIONS.RIGHT,
  //   })
  // }
  // if (gameInput.isDown(KEYS.DOWN_ARROW) && self.direction !== DIRECTIONS.TOP) {
  //   setDirectionForSnake({
  //     id: self.id,
  //     direction: DIRECTIONS.DOWN,
  //   })
  // }
  // if (
  //   gameInput.isDown(KEYS.LEFT_ARROW) &&
  //   self.direction !== DIRECTIONS.RIGHT
  // ) {
  //   setDirectionForSnake({
  //     id: self.id,
  //     direction: DIRECTIONS.LEFT,
  //   })
  // }
  // if (gameInput.isDown(KEYS.TOP_ARROW) && self.direction !== DIRECTIONS.DOWN) {
  //   setDirectionForSnake({
  //     id: self.id,
  //     direction: DIRECTIONS.TOP,
  //   })
  // }

  return {}
}
