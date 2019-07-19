export class Graph {
  constructor({ w, h }) {
    this.w = w
    this.h = h
  }

  getTopNeigbour(index) {
    const hasTopNeighbour = Math.floor(index / this.w) > 0

    return hasTopNeighbour
      ? index - this.w
      : this.w * (this.h - 1) + (index % this.w)
  }

  getLeftNeigbour(index) {
    const hasLeftNeighbour = index % this.w > 0

    return hasLeftNeighbour ? index - 1 : index + (this.w - 1)
  }

  getRightNeigbour(index) {
    const hasRightNeighbour = index % this.w < this.w - 1

    return hasRightNeighbour ? index + 1 : index - (this.w - 1)
  }

  getDownNeigbour(index) {
    const hasDownNeighbour = Math.floor(index / this.w) < this.h - 1

    return hasDownNeighbour
      ? index + this.w
      : index - (this.w * (this.h - 1) + (index % this.w))
  }

  getNeighbors(index) {
    return [
      this.getTopNeigbour(index),
      this.getLeftNeigbour(index),
      this.getDownNeigbour(index),
      this.getRightNeigbour(index),
    ]
  }
}
