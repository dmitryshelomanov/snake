import { KEYS } from './keyboard'

const { search } = new URL(window.location.href)
const parsedParams = new URLSearchParams(search)

export const cellSize = parsedParams.get('cellSize')
  ? Number(parsedParams.get('cellSize'))
  : 20
export const pageWidth = parsedParams.get('pageWidth')
  ? Number(parsedParams.get('pageWidth'))
  : window.innerWidth
export const pageHeight = parsedParams.get('pageHeight')
  ? Number(parsedParams.get('pageHeight'))
  : window.innerHeight
export const fps = parsedParams.get('fps')
  ? Number(parsedParams.get('fps'))
  : 15
export const borderSize = parsedParams.get('borderSize')
  ? Number(parsedParams.get('borderSize'))
  : 1
export const foodCount = parsedParams.get('foodCount')
  ? Number(parsedParams.get('foodCount'))
  : 50
export const snakeCount = parsedParams.get('snakeCount')
  ? Number(parsedParams.get('snakeCount'))
  : 1

export enum DIRECTIONS {
  LEFT = KEYS.LEFT_ARROW,
  RIGHT = KEYS.RIGHT_ARROW,
  TOP = KEYS.TOP_ARROW,
  DOWN = KEYS.DOWN_ARROW,
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
  brikColor: '#795d5d',
}
