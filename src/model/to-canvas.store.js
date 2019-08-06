import { manhattanDistance } from '../algorithms/heuristic'
import {
  $gameStateStore,
  $foodsStore,
  $gameMapStore,
  $snakesStore,
  $gameCollisionStateStore,
  $brickStore,
  $indexesVisibleStore,
  $enableLoggerStore,
  $settingsForSnakesStore,
  $algorithmsStore,
  $heuristicsStore,
} from './game.store'

export const getGameState = () => $gameStateStore.getState()

export const getFoodsState = () => $foodsStore.getState()

export const getGameMapState = () => $gameMapStore.getState()

export const getSnakesState = () => $snakesStore.getState()

export const getGameCollisionState = () => $gameCollisionStateStore.getState()

export const getBrickState = () => $brickStore.getState()

export const getIndexesVisibleStore = () => $indexesVisibleStore.getState()

export const getLoggerState = () => $enableLoggerStore.getState()

export const getSettingsForSnakeState = (snakeId) =>
  $settingsForSnakesStore.getState()[snakeId]

export const getAlgorithmStateById = (id) =>
  $algorithmsStore.getState().find((alg) => alg.id === id)

export const getHeuristicStateById = (id) =>
  $heuristicsStore.getState().find((heuristic) => heuristic.id === id)

export const getNearestFood = (position) =>
  $foodsStore
    .getState()
    .sort(
      (a, b) =>
        manhattanDistance(a[0], position) - manhattanDistance(b[0], position)
    )[0]
