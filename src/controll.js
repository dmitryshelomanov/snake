import { DIRECTIONS, cellSize } from './config'
import { getGameState, onPlay, onStop, GAME_STATE } from './model'
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

export function createTimeController(fps) {
  const fpsInterval = 1000 / fps
  let callback = null
  let now = null
  let then = Date.now()
  let wasFirstRender = false

  function loop() {
    now = Date.now()
    const delta = now - then
    const isPLay = getGameState() === GAME_STATE.IS_PLAY

    requestAnimationFrame(loop)

    if (delta > fpsInterval) {
      then = now - (delta % fpsInterval)

      if (callback) {
        callback(isPLay, wasFirstRender)
      }

      wasFirstRender = true
    }
  }

  return {
    start: (fn) => {
      callback = fn
      loop()
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
  let isMouseDown = false

  function getTargetIndex(event) {
    const x = event.pageX - canvas.offsetLeft
    const y = event.pageY - canvas.offsetTop
    const targetPosition = [
      Math.floor((x + (cellSize % x) / cellSize) / cellSize),
      Math.floor((y + (cellSize % y) / cellSize) / cellSize),
    ]

    return getIndexByPosition(targetPosition)
  }

  canvas.addEventListener('mousedown', (event) => {
    const index = getTargetIndex(event)

    registerClickEventToCanvas.events
      .filter((userEvent) => userEvent.type === 'mousedown')
      .forEach((userEvent) => userEvent.event(index))

    isMouseDown = true
  })

  canvas.addEventListener('mouseup', () => {
    isMouseDown = false
  })

  canvas.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
      const index = getTargetIndex(event)

      registerClickEventToCanvas.events
        .filter((userEvent) => userEvent.type === 'mousemove')
        .forEach((userEvent) => userEvent.event(index))
    }
  })
}

registerClickEventToCanvas.events = []
registerClickEventToCanvas.eventsForRegister = []

registerClickEventToCanvas.addMouseDownEvent = function addMouseDownEvent(
  event
) {
  registerClickEventToCanvas.events.push({ type: 'mousedown', event })
}

registerClickEventToCanvas.addMouseMoveEvent = function addMouseMoveEvent(
  event
) {
  registerClickEventToCanvas.events.push({ type: 'mousemove', event })
}

registerClickEventToCanvas.addEventsForRegister = function addEventsForRegister(
  event
) {
  registerClickEventToCanvas.eventsForRegister.push(event)
}

registerClickEventToCanvas.releaseRegistredEvents = function releaseRegistredEvents() {
  registerClickEventToCanvas.eventsForRegister.forEach((event) => event())
}
