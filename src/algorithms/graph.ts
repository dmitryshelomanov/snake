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

import { PLACE_TYPE } from '../config'

export type VertexValue =
| { type: PLACE_TYPE.EMPTY }
| { type: PLACE_TYPE.GAME_OBJECT; snakeId: string }
| { type: PLACE_TYPE.FOOD; foodId: string }

export type Vertex = {
  neigbors: Array<number>
  value: VertexValue
  index: number
}

function filterNeigbors(neigbors: Array<number | void>): Array<number> {
  // @ts-ignore
  return neigbors.filter((i) => typeof i !== 'undefined')
}

export class Graph {
  w: number
  h: number
  withBounds?: boolean
  emptyGraph: Array<Vertex>
  graph: Array<Vertex>

  constructor({
    w,
    h,
    withBounds = false,
    emptyGraph,
    graph,
  }: {
    w: number
    h: number
    withBounds?: boolean
    emptyGraph?: Array<Vertex>
    graph?: Array<Vertex>
  }) {
    this.w = w
    this.h = h
    this.withBounds = withBounds
    this.emptyGraph =
      typeof emptyGraph !== 'undefined'
        ? emptyGraph
        : Array.from({ length: w * h }, (_, index) => ({
            neigbors: filterNeigbors([
              this.getTopNeigbour(index),
              this.getLeftNeigbour(index),
              this.getDownNeigbour(index),
              this.getRightNeigbour(index),
            ]),
            value: { type: PLACE_TYPE.EMPTY },
            index,
          }))
    this.graph = typeof graph !== 'undefined' ? graph : this.emptyGraph.slice()
  }

  static extend(graph: Graph) {
    return new Graph({
      w: graph.w,
      h: graph.h,
      withBounds: graph.withBounds,
      graph: graph.graph.slice(),
      emptyGraph: graph.emptyGraph.slice(),
    })
  }

  private getTopNeigbour(index: number) {
    const hasTopNeighbour = Math.floor(index / this.w) > 0

    if (hasTopNeighbour) {
      return index - this.w
    }

    return this.withBounds
      ? undefined
      : this.w * (this.h - 1) + (index % this.w)
  }

  private getLeftNeigbour(index: number) {
    const hasLeftNeighbour = index % this.w > 0

    if (hasLeftNeighbour) {
      return index - 1
    }

    return this.withBounds ? undefined : index + (this.w - 1)
  }

  private getRightNeigbour(index: number) {
    const hasRightNeighbour = index % this.w < this.w - 1

    if (hasRightNeighbour) {
      return index + 1
    }

    return this.withBounds ? undefined : index - (this.w - 1)
  }

  private getDownNeigbour(index: number) {
    const hasDownNeighbour = Math.floor(index / this.w) < this.h - 1

    if (hasDownNeighbour) {
      return index + this.w
    }

    return this.withBounds ? undefined : index % this.w
  }

  getVertex(index: number | void): Vertex | void {
    if (index) {
      return this.graph[index]
    }

    return undefined
  }

  setValueByIndex(index: number, value: VertexValue) {
    if (this.graph[index]) {
      this.graph[index] = { ...this.graph[index], value }
    }
  }

  getVertexes(): Array<Vertex> {
    return this.graph
  }

  clear() {
    this.graph = this.emptyGraph.slice()
  }
}
