import Color from 'color'
import random from 'lodash-es/random'
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

export type SnakeColors = {
  head: string
  tail: string
  processed: string
}

export type SnakeMeta = { processed: Array<number>; path: Array<number> }

export type Updater = () => {
  nextPosition: Coords
  nextDirection: number
  meta?: SnakeMeta
}

export type Snake = {
  id: string
  body: Array<Coords>
  isCrash: boolean
  direction: number
  score: number
  colors: SnakeColors
  isAi: boolean
  updater: Updater
  meta: SnakeMeta | void
}

export function buildSnake(
  headPosition: Coords,
  {
    colors,
    id,
    isAi,
    updater,
    body,
  }: {
    colors: SnakeColors
    id: string
    isAi: boolean
    updater: Updater
    body: Array<Coords>
  }
): Snake {
  return {
    id,
    body: body || [headPosition, [headPosition[0] + 1, headPosition[1]]],
    isCrash: false,
    direction: DIRECTIONS.RIGHT,
    score: 0,
    colors,
    isAi,
    updater,
    meta: isAi ? { processed: [], path: [] } : undefined,
  }
}

export type SnakeSettings = {
  showProcessedCells: boolean
  showAIPathToTarget: boolean
  activeAlgorithm: string
  activeHeuristic: string
}

export function updateBody(snake: Snake, nextPosition: Coords) {
  const [_, ...rest] = snake.body

  if (nextPosition) {
    return {
      ...snake,
      body: [...rest, nextPosition],
    }
  }

  return snake
}

export function headSnake(snake: Snake) {
  return snake.body[snake.body.length - 1]
}

export function tailSnake(snake: Snake) {
  return snake.body[0]
}

export function addPeaceOfSnake(snake: Snake, peaceOfSnake: Coords) {
  return { ...snake, body: [...snake.body, peaceOfSnake] }
}

export function setDirection(snake: Snake, direction: number) {
  return {
    ...snake,
    direction,
  }
}

export function setMeta(snake: Snake, meta: SnakeMeta) {
  return {
    ...snake,
    meta,
  }
}

export function setScore(snake: Snake, score: number) {
  return {
    ...snake,
    score,
  }
}

export function setCrash(snake: Snake, isCrash: boolean) {
  return {
    ...snake,
    isCrash,
  }
}

export function getColorsForSnake() {
  const color = Color(colorsStub[random(0, colorsStub.length - 1)])

  return {
    head: color.toString(),
    tail: color.alpha(0.7).toString(),
    processed: color.alpha(0.4).toString(),
  }
}

export function buildSettingsForSnake(): SnakeSettings {
  return {
    showProcessedCells: true,
    showAIPathToTarget: true,
    activeAlgorithm: 'aStar',
    activeHeuristic: 'manhattan',
  }
}
