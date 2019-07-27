import { DIRECTIONS } from './config'
import { getGameState, GAME_STATE, onPlay, onStop } from './model'

export function getNextPositionByDirection([x, y], direction) {
  switch (direction) {
    case DIRECTIONS.LEFT:
      return [x - 1, y]
    case DIRECTIONS.RIGHT:
      return [x + 1, y]
    case DIRECTIONS.TOP:
      return [x, y - 1]
    case DIRECTIONS.DOWN:
      return [x, y + 1]
    default:
      return [x, y]
  }
}

export function getDirectionByPosition(currentPosition, nextPosition) {
  if (
    currentPosition[0] < nextPosition[0] &&
    currentPosition[1] === nextPosition[1]
  ) {
    return DIRECTIONS.RIGHT
  }

  if (
    currentPosition[0] > nextPosition[0] &&
    currentPosition[1] === nextPosition[1]
  ) {
    return DIRECTIONS.LEFT
  }

  if (
    currentPosition[0] === nextPosition[0] &&
    currentPosition[1] > nextPosition[1]
  ) {
    return DIRECTIONS.TOP
  }

  if (
    currentPosition[0] === nextPosition[0] &&
    currentPosition[1] < nextPosition[1]
  ) {
    return DIRECTIONS.DOWN
  }

  return DIRECTIONS.RIGHT
}

export function createTimeController(interval) {
  let callback = null
  let now = null
  let then = Date.now()

  function loop() {
    now = Date.now()
    const delta = now - then
    const isPLay = getGameState() === GAME_STATE.IS_PLAY

    requestAnimationFrame(loop)

    if (delta > interval && isPLay) {
      then = now - (delta % interval)

      if (callback) {
        callback()
      }
    }
  }

  return {
    start: (fn) => {
      callback = fn
      requestAnimationFrame(loop)
    },
    pause: () => {
      onStop()
    },
    play: () => {
      onPlay()
    },
  }
}
