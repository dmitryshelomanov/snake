import {
  $gameStateStore,
  $appleStore,
  $gameMapStore,
  $snakesStore,
  $gameCollisionStore,
  $activeAlgorithmStore,
} from './game.store'

export const getGameState = () => $gameStateStore.getState()

export const getAppleState = () => $appleStore.getState()

export const getGameMapState = () => $gameMapStore.getState()

export const getSnakesState = () => $snakesStore.getState()

export const getCollisionState = () => $gameCollisionStore.getState()

export const getActiveAlgorithmStore = () => $activeAlgorithmStore.getState()
