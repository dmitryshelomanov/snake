import { cellSize, pageHeight, pageWidth, PLACE_TYPE } from './config'
import { Graph } from './algorithms'

/**
  cellSize = 20
  getLocalSize(500, 500) // => { w: 25, h: 25 }
*/
export function getLocalSize(w: number, h: number) {
  return {
    w: Math.floor(w / cellSize),
    h: Math.floor(h / cellSize),
  }
}

/**
  cellSize = 20
  getLocalSize(20, 20) // => { w: 400, h: 400 }
*/
export function getGlobalSize(w: number, h: number) {
  return {
    w: Math.floor(w * cellSize),
    h: Math.floor(h * cellSize),
  }
}

/**
  localX = 5
  localY = 10
  cellSize = 20
  convertGlobalPositionToLocal([localX, localY]) // => [100, 200]
*/
export function convertLocalPositionToGlobal([x, y]: Coords): Coords {
  return [x * cellSize, y * cellSize]
}

/**
  x = 100
  y = 200
  cellSize = 20
  convertGlobalPositionToLocal([x, y]) // => [5, 10]
*/
export function convertGlobalPositionToLocal([x, y]: Coords): Coords {
  return [x / cellSize, y / cellSize]
}

export function randomPosition(): Coords {
  const { w, h } = getLocalSize(pageWidth, pageHeight)

  function intNumber(n: number): number {
    return Math.floor(Math.random() * n)
  }

  return [intNumber(w), intNumber(h)]
}

export function getIndexByPosition([x, y]: Coords): number {
  const { w } = getLocalSize(pageWidth, pageHeight)

  return y * w + x
}

export function getPositionByIndex(index: number): Coords {
  const { w } = getLocalSize(pageWidth, pageHeight)
  const y = Math.floor(index / w)
  const x = index - y * w

  return [x, y]
}

export function randomId(): string {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString()
}

export function createOperationLogger(
  name: string
): { log: () => void; increment: () => void } {
  let operation = 0

  return {
    log: () => {
      console.log(`[SNAKE] => ${name} operation count - ${operation}`)
    },
    increment: () => {
      operation += 1
    },
  }
}

export function generateRandomFoodByCount(count: number): Array<Food> {
  const foods: Array<Food> = []

  for (let i = 0; i < count; i++) {
    foods.push([randomPosition(), randomId()])
  }

  return foods
}

export function getDifferenceBetweenPositions(
  [x, y]: Coords,
  [x1, y1]: Coords
): number {
  return Math.abs(x1 + y1 - (x + y))
}

export function setValuesToGraph(
  graph: Graph,
  values: Array<{ index: number; type: PLACE_TYPE; value: string }>
): void {
  values.forEach(({ type, value, index }) => {
    switch (type) {
      case PLACE_TYPE.FOOD: {
        graph.setValueByIndex(index, {
          type,
          foodId: value,
        })

        break
      }

      case PLACE_TYPE.GAME_OBJECT: {
        graph.setValueByIndex(index, {
          type,
          snakeId: value,
        })

        break
      }

      case PLACE_TYPE.BRICK: {
        graph.setValueByIndex(index, {
          type,
        })

        break
      }

      default: {
        graph.setValueByIndex(index, {
          type: PLACE_TYPE.EMPTY,
        })
      }
    }
  })
}

export function pointsAreEquals([x, y]: Coords, [x1, y1]: Coords): boolean {
  return x === x1 && y === y1
}
