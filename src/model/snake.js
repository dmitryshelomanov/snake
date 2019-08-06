import { DIRECTIONS } from '../config'

export class Snake {
  static build(headPosition, { colors, id }) {
    return {
      id,
      body: [headPosition, [headPosition[0] + 1, headPosition[1]]],
      isCrash: false,
      direction: DIRECTIONS.RIGHT,
      weight: 1,
      score: 0,
      colors,
    }
  }
}

export function moveSnake(snake, nextPosition) {
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
