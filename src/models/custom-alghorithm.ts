import { createEvent, restore, createStore } from 'effector'

const emptyRow = Array.from(
  { length: 25 },
  () => `
`
).join('')

const code = `
/* Инструкция

Алгоритм вызывается на каждый тик
На вход и выход принимает определенные типы
Писать нужно сразу тело функции
Все параметры будут переданы на вход

declare type TraverseAlgorithmProps<G, V> = {
  startIndex: number // Голова змеи head Coords
  endIndex: number // Цель - найденная ближашая доступная еда (Food)
  graph: G
  canTraverse: (arg0: V) => boolean
  getCostByIndex: (arg0: V) => number
  withLogger: boolean
  heuristic: HeuristicFunction
} as params in global

!!Так же может понадобиться утилита для получения координат по индексу
В графе всем соседям присвоен индекс (https://github.com/dmitryshelomanov/snake/blob/master/src/algorithms/graph.ts)
доступные утилиты находятся в utils (in global)
{
  getPositionByIndex: (index: number) => Coords,
  getIndexByPosition: (index: Coords) => number
}

declare type TraverseAlgorithmResult = {
  path: Array<number>
  processed: Array<number>
}

*/

/*
  @example
  Визуализация - Disable algorithm в настройках змейки

  Функция вызывается в ai updater (https://github.com/dmitryshelomanov/snake/blob/master/src/updaters/ai.ts#L118)
  Если ничего не вернули как в примере - змейка пойдет в первый свободный путь
  Графический пример
  з - змейка
  б - блок
  [] - свободная клетка

  [ ][ ][ ][ ][ ][ ]
  [ ][ ][б][б][б][ ]
  [ ][з][з][→][б][ ]
  [ ][↑][б][↓][ ][ ]
  [ ][←][←][↓][ ][ ]
*/

const {
  startIndex,
  endIndex,
  graph,
} = params // !important this is bridge between your code and snake vars

const { getPositionByIndex } = utils

function manhattanDistance({
  p: [x, y],
  p1: [x1, y1],
}) {
  return Math.abs(x1 - x) + Math.abs(y1 - y)
}

let path = []
let processed = []

const vertex = graph.getVertex(startIndex)

if(vertex) {
  const positions = vertex.neigbors
    .filter((index) => {
      // нужно что бы змейка не пошла в блок или в себя
      // для теста можно отключать коллизию
      const nvertex = graph.getVertex(index)

      // https://github.com/dmitryshelomanov/snake/blob/master/src/config.ts#L23
      return nvertex.value.type === 0 || nvertex.value.type === 3 // EMPTY or FOOD (PLACE_TYPE)
    })
    .map((index) => {
      return [
        index,
        manhattanDistance({ p: getPositionByIndex(index), p1: getPositionByIndex(endIndex) })
      ]
    })
    // get nearest index
    .sort((a, b) => a[1] - b[1])

  path = positions[0] ? [positions[0][0]] : path
  processed = vertex.neigbors
}

return {
  path,
  processed
}

${emptyRow}
`

export const changeEditorCode = createEvent<string>()
export const toggleCustomCode = createEvent()
export const changeTheme = createEvent<string>()

export const $editorCode = restore(changeEditorCode, code)

export const $trimmedEditorCode = $editorCode.map((it) => it.trim())

export const $customCodeIsEnabled = createStore(false).on(
  toggleCustomCode,
  (state) => !state
)

export const $editorTheme = restore(changeTheme, 'xcode')
