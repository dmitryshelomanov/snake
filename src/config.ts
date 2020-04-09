import { KEYS } from './keyboard'

export const cellSize = 10
export const pageWidth = window.innerWidth
export const pageHeight = window.innerHeight
export const fps = 30
export const borderSize = 1
export const boardLength = pageWidth * pageHeight
export const foodCount = 50
export const snakeCount = 10

export const DIRECTIONS = {
  LEFT: KEYS.LEFT_ARROW,
  RIGHT: KEYS.RIGHT_ARROW,
  TOP: KEYS.TOP_ARROW,
  DOWN: KEYS.DOWN_ARROW,
}

export enum GAME_STATE {
  IS_PLAY,
  IS_PAUSE,
}

export enum PLACE_TYPE {
  EMPTY,
  GAME_OBJECT,
  BRICK,
  FOOD,
}

export const colorScheme = {
  emptyCells: '#0080007d',
  borderColor: 'rgba(0, 0, 0, 0.2)',
  foodColor: 'rgb(238, 68, 0)',
}
