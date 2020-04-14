import { DIRECTIONS, cellSize } from './config'
import { getIndexByPosition } from './utils'

export function getNextPositionByDirection(
  [x, y]: Coords,
  direction: number
): Coords {
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

export function getDirectionByPosition(
  currentPosition: Coords,
  nextPosition: Coords
): DIRECTIONS {
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
  events: Array<{ type: string; eventListener: (index: number) => void }>
  eventRegistar: Array<() => void>
  isMouseDown: boolean

  constructor() {
    this.events = []
    this.eventRegistar = []
    this.isMouseDown = false
  }

  registerEventRegistar(eventBuilder: () => void): void {
    this.eventRegistar.push(eventBuilder)
  }

  callEventRegistars(): void {
    this.eventRegistar.forEach((builder) => builder())
  }

  registerClickEventToCanvas(canvas: HTMLCanvasElement): void {
    function getTargetIndex(event: MouseEvent): number {
      const x = event.pageX - canvas.offsetLeft
      const y = event.pageY - canvas.offsetTop
      const targetPosition: Coords = [
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

  addMouseDownEvent(eventListener: (index: number) => void): void {
    this.events.push({ type: 'mousedown', eventListener })
  }

  addMouseMoveEvent(eventListener: (index: number) => void): void {
    this.events.push({ type: 'mousemove', eventListener })
  }
}

export const canvasInput = new CanvasInput()
