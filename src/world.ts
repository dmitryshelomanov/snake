import { Graph } from './algorithms'
import { Snake } from './models/snake'
import { SettingsStore } from './models/snakes'

export type World = {
  isLoggerEnabled: boolean
  indexesVisible: boolean
  graph: Graph
  foods: Array<Food>
  isEnabledCollisionDetect: boolean
  needFillEmptyGraphsCells: boolean
  bricks: Array<Coords>
  trimmedEditorCode: string
  customCodeIsEnabled: boolean
  settingsForSnakes: SettingsStore
  snakes: Snake[]
}
