import {
  $gameStateStore,
  $appleStore,
  $gameMapStore,
  $snakesStore,
  $activeAlgorithmStore,
  $gameCollisionStateStore,
  $brickStore,
  $showAIPathToTargetStore,
  $indexesVisibleStore,
  $processedItemsVisibleStore,
  $activeHeuristicForActiveAlgorithm,
} from './game.store'

export const getGameState = () => $gameStateStore.getState()

export const getAppleState = () => $appleStore.getState()

export const getGameMapState = () => $gameMapStore.getState()

export const getSnakesState = () => $snakesStore.getState()

export const getGameCollisionState = () => $gameCollisionStateStore.getState()

export const getActiveAlgorithmStore = () => ({
  alg: $activeAlgorithmStore.getState().alg,
  heuristic: $activeHeuristicForActiveAlgorithm.getState(),
})

export const getBrickState = () => $brickStore.getState()

export const getShowAIPathToTargetState = () =>
  $showAIPathToTargetStore.getState()

export const getIndexesVisibleStore = () => $indexesVisibleStore.getState()

export const getProcessedItemsVisibleState = () =>
  $processedItemsVisibleStore.getState()
