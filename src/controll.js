import { DIRECTIONS, cellSize } from './config'
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

export class CanvasInput {
  constructor() {
    this.events = [] /* :Arrray<{type: string, eventListener: (index) => void }> */
    this.eventRegistar = [] /* :Arrray<() => void> */
    this.isMouseDown = false
  }

  registerEventRegistar(eventBuilder /* :() => void */) {
    this.eventRegistar.push(eventBuilder)
  }

  callEventRegistars() {
    this.eventRegistar.forEach((builder) => builder())
  }

  registerClickEventToCanvas(canvas) {
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

      this.events
        .filter((userEvent) => userEvent.type === 'mousedown')
        .forEach((userEvent) => userEvent.eventListener(index))

      this.isMouseDown = true
    })

    canvas.addEventListener('mouseup', () => {
      this.isMouseDown = false
    })

    canvas.addEventListener('mousemove', (event) => {
      if (this.isMouseDown) {
        const index = getTargetIndex(event)

        this.events
          .filter((userEvent) => userEvent.type === 'mousemove')
          .forEach((userEvent) => userEvent.eventListener(index))
      }
    })
  }

  addMouseDownEvent(eventListener) {
    this.events.push({ type: 'mousedown', eventListener })
  }

  addMouseMoveEvent(eventListener) {
    this.events.push({ type: 'mousemove', eventListener })
  }
}

export const canvasInput = new CanvasInput()
