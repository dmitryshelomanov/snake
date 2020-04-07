import { createStore, restore } from 'effector'
import { GAME_STATE, fps } from '../../config'
import {
  setCollisionState,
  setIndexesVisible,
  setLoggerState,
  changeFps,
} from './events'

export const $gameState = createStore(GAME_STATE.IS_PLAY)

export const $collisionState = restore(setCollisionState, true)

export const $indexesVisible = restore(setIndexesVisible, false)

export const $isLoggerEnabled = restore(setLoggerState, false)

export const $fps = restore(changeFps, fps)
