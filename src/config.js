import { KEYS } from './keyboard'

export const cellSize = 15
export const pageWidth = window.innerWidth
export const pageHeight = window.innerHeight
export const fps = 60
export const borderSize = 1
export const boardLength = pageWidth * pageHeight
export const foodCount = 50
export const snakeCount = 3

export const DIRECTIONS = {
  LEFT: KEYS.LEFT_ARROW,
  RIGHT: KEYS.RIGHT_ARROW,
  TOP: KEYS.TOP_ARROW,
  DOWN: KEYS.DOWN_ARROW,
}

export const GAME_STATE = {
  IS_PLAY: 'play',
  IS_PAUSE: 'pause',
}

export const PLACE_TYPE = {
  EMPTY: 'empty',
  GAME_OBJECT: 'game_object',
  BRICK: 'brick',
  FOOD: 'food',
}
