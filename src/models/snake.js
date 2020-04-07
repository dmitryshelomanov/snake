import Color from 'color'
import { DIRECTIONS } from '../config'

const colorsStub = [
  '#f48fb1',
  '#ec407a',
  '#c2185b',
  '#b71c1c',
  '#ba68c8',
  '#8e24aa',
  '#26c6da',
  '#9ccc65',
  '#c0ca33',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#9e9e9e',
  '#607d8b',
]

export class Snake {
  static build(headPosition, { colors, id, isAi, updater }) {
    return {
      id,
      body: [headPosition, [headPosition[0] + 1, headPosition[1]]],
      isCrash: false,
      direction: DIRECTIONS.RIGHT,
      weight: 1,
      score: 0,
      colors,
      isAi,
      updater,
      meta: isAi ? { processed: [], path: [] } : undefined,
    }
  }
}

export function updateBody(snake, nextPosition) {
  const [_, ...rest] = snake.body

  if (nextPosition) {
    return {
      ...snake,
      body: [...rest, nextPosition],
    }
  }

  return snake
}

export function headSnake(snake) {
  return snake.body[snake.body.length - 1]
}

export function tailSnake(snake) {
  return snake.body[0]
}

export function addPeaceOfSnake(snake, peaceOfSnake) {
  return { ...snake, body: [...snake.body, peaceOfSnake] }
}

export function setDirection(snake, direction) {
  return {
    ...snake,
    direction,
  }
}

export function setMeta(snake, meta) {
  return {
    ...snake,
    meta,
  }
}

export function setScore(snake, score) {
  return {
    ...snake,
    score,
  }
}

export function setCrash(snake, isCrash) {
  return {
    ...snake,
    isCrash,
  }
}

export function getColorsForSnake() {
  const color = Color(colorsStub[Math.ceil(Math.random() * colorsStub.length)])

  return {
    head: color.toString(),
    tail: color.alpha(0.7).toString(),
    processed: color.alpha(0.4).toString(),
  }
}

export function buildSettingsForSnake() {
  return {
    showProcessedCells: false,
    showAIPathToTarget: false,
    activeAlgorithm: 'aStar',
    activeHeuristic: 'manhattan',
  }
}
