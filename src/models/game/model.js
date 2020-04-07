import { GAME_STATE } from '../../config'
import { play, stop, restart } from './events'
import {
  $gameState,
  $indexesVisible,
  $collisionState,
  $isLoggerEnabled,
} from './store'

$gameState
  .on(play, () => GAME_STATE.IS_PLAY)
  .on(stop, () => GAME_STATE.IS_PAUSE)
  .reset(restart)

$indexesVisible.reset(restart)

$collisionState.reset(restart)

$isLoggerEnabled.reset(restart)
