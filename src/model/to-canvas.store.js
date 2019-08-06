import {
  $gameStateStore,
  $foodsStore,
  $gameMapStore,
  $snakesStore,
  $gameCollisionStateStore,
  $brickStore,
  $indexesVisibleStore,
  $enableLoggerStore,
  $settingsForSnakeStore,
  $heuristicByIdState,
  $algorithmByIdState,
  $nearestFoodState,
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
  $settingsForSnakeStore(snakeId).getState()

export const getAlgorithmStateById = (id) => $algorithmByIdState(id).getState()

export const getHeuristicStateById = (id) => $heuristicByIdState(id).getState()

export const getNearestFood = (position) =>
  $nearestFoodState(position).getState()
