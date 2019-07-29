import { DIRECTIONS, cellSize } from './config'
import {
  getGameState,
  getGameMapState,
  GAME_STATE,
  onPlay,
  onStop,
  onAddBrick,
  onRemoveBrick,
} from './model'
import { getIndexByPosition } from './utils'

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
  let wasFirstRender = false

  function loop() {
    now = Date.now()
    const delta = now - then
    const isPLay = getGameState() === GAME_STATE.IS_PLAY

    requestAnimationFrame(loop)

    if (delta > interval) {
      then = now - (delta % interval)

      if (callback) {
        callback(isPLay, wasFirstRender)
      }

      wasFirstRender = true
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

export function registerClickEventToCanvas(canvas) {
  canvas.addEventListener('click', (event) => {
    const gameMapState = getGameMapState()
    const x = event.pageX - canvas.offsetLeft
    const y = event.pageY - canvas.offsetTop
    const targetPosition = [
      Math.floor((x + (cellSize % x) / cellSize) / cellSize),
      Math.floor((y + (cellSize % y) / cellSize) / cellSize),
    ]
    const index = getIndexByPosition(targetPosition)

    if (gameMapState[index] === 1) {
      onRemoveBrick(index)
    } else {
      onAddBrick(index)
    }
  })
}
