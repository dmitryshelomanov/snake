import { createStore, restore } from 'effector'
import { GAME_STATE, fps } from '../../config'
import { changeFps } from './events'

export const $gameState = createStore(GAME_STATE.IS_PAUSE)

export const $isEnabledCollisionDetect = createStore(true)

export const $indexesVisible = createStore(false)

export const $isLoggerEnabled = createStore(false)

export const $fps = restore(changeFps, fps)

export const $needFillEmptyGraphsCellls = createStore(false)
