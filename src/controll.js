export const DIRECTIONS = {
  LEFT: 37,
  RIGHT: 39,
  TOP: 38,
  DOWN: 40,
}

export function getNextPositionByDirection([x, y], dir) {
  switch (dir) {
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

export function keyboardHandle(handle) {
  document.addEventListener('keyup', (e) => {
    e.preventDefault()

    if (Object.values(DIRECTIONS).includes(e.keyCode)) {
      handle(e.keyCode)
    }
  })
}

export function createTimeController(interval) {
  let callback = null
  let now = null
  let then = Date.now()
  let isPause = false

  function loop() {
    now = Date.now()
    const delta = now - then

    requestAnimationFrame(loop)

    if (delta > interval && !isPause) {
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
      isPause = true
    },
    play: () => {
      isPause = false
    },
  }
}
