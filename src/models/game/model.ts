import { GAME_STATE } from '../../config'
import {
  play,
  stop,
  restart,
  fillEmptyGraphCells,
  setCollisionState,
  setIndexesVisible,
  setLoggerState,
} from './events'
import {
  $gameState,
  $indexesVisible,
  $isEnabledCollisionDetect,
  $isLoggerEnabled,
  $needFillEmptyGraphsCells,
  $fps,
} from './store'

$gameState
  .on(play, () => GAME_STATE.IS_PLAY)
  .on(stop, () => GAME_STATE.IS_PAUSE)
  .reset(restart)

$needFillEmptyGraphsCells
  .on(fillEmptyGraphCells, (state) => !state)
  .reset(restart)

$isEnabledCollisionDetect
  .on(setCollisionState, (state) => !state)
  .reset(restart)

$isLoggerEnabled.on(setLoggerState, (state) => !state).reset(restart)

$indexesVisible.on(setIndexesVisible, (state) => !state).reset(restart)

$fps.reset(restart)
