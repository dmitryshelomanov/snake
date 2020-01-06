import { KEYS } from './keyboard'

export const cellSize = 15
export const pageWidth = window.innerWidth
export const pageHeight = window.innerHeight
export const fps = 25
export const borderSize = 1
export const boardLength = pageWidth * pageHeight

export const DIRECTIONS = {
  LEFT: KEYS.LEFT_ARROW,
  RIGHT: KEYS.RIGHT_ARROW,
  TOP: KEYS.TOP_ARROW,
  DOWN: KEYS.DOWN_ARROW,
}
