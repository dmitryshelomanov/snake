import { createEvent, restore } from 'effector'
import { createStore } from 'effector-logger'

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
} = params // !important this is bridge between your code and snake vars

return {
  path: [],
  processed: []
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
