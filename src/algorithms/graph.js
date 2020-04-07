/*
  Note:

  Представление графа в виде массива index => [top,left,down,right]
  Это все можно узнать из одномеррного массива, но в качестве оптимизации
    тут это статичиски построется
  Вся карта змеек это представление ячеек
    [0][1][2]
    [3][4][5]
    [6][7][8]

  reference: https://habr.com/ru/post/331192/
*/

export class Graph {
  constructor({ w, h, withBounds = false }) {
    this.w = w
    this.h = h
    this.withBounds = withBounds
    this.graph = Array.from({ length: w * h }, (_, index) =>
      [
        this.getTopNeigbour(index),
        this.getLeftNeigbour(index),
        this.getDownNeigbour(index),
        this.getRightNeigbour(index),
      ].filter((i) => typeof i !== 'undefined')
    )
  }

  getTopNeigbour(index) {
    const hasTopNeighbour = Math.floor(index / this.w) > 0

    if (hasTopNeighbour) {
      return index - this.w
    }

    return this.withBounds
      ? undefined
      : this.w * (this.h - 1) + (index % this.w)
  }

  getLeftNeigbour(index) {
    const hasLeftNeighbour = index % this.w > 0

    if (hasLeftNeighbour) {
      return index - 1
    }

    return this.withBounds ? undefined : index + (this.w - 1)
  }

  getRightNeigbour(index) {
    const hasRightNeighbour = index % this.w < this.w - 1

    if (hasRightNeighbour) {
      return index + 1
    }

    return this.withBounds ? undefined : index - (this.w - 1)
  }

  getDownNeigbour(index) {
    const hasDownNeighbour = Math.floor(index / this.w) < this.h - 1

    if (hasDownNeighbour) {
      return index + this.w
    }

    return this.withBounds ? undefined : index % this.w
  }

  getNeighbors(index) {
    return this.graph[index] || []
  }
}