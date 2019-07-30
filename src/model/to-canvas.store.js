import {
  $gameStateStore,
  $appleStore,
  $gameMapStore,
  $snakesStore,
  $activeAlgorithmStore,
  $gameCollisionStateStore,
  $brickStore,
  $showAIPathToTargetStore,
} from './game.store'

export const getGameState = () => $gameStateStore.getState()

export const getAppleState = () => $appleStore.getState()

export const getGameMapState = () => $gameMapStore.getState()

export const getSnakesState = () => $snakesStore.getState()

export const getGameCollisionState = () => $gameCollisionStateStore.getState()

export const getActiveAlgorithmStore = () => $activeAlgorithmStore.getState()

export const getBrickState = () => $brickStore.getState()

export const getShowAIPathToTargetState = () =>
  $showAIPathToTargetStore.getState()
