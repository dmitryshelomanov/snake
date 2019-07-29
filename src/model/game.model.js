import { randomPosition } from '../utils'
import {
  $gameStateStore,
  GAME_STATE,
  $appleStore,
  $snakesStore,
  $gameMapStore,
  $algorithmsStore,
} from './game.store'
import {
  onPlay,
  onStop,
  onEatApple,
  onMoveSnake,
  onSetDirectionForSnake,
  onRestart,
  onClearGameMap,
  onUpdateGameMap,
  onCrashSnake,
  onChangeAlgorithm,
} from './game.events'
import {
  setScore,
  moveSnake,
  setDirection,
  addPeaceOfSnake,
  setCrash,
} from './snake'

$gameStateStore
  .on(onPlay, () => GAME_STATE.IS_PLAY)
  .on(onStop, () => GAME_STATE.IS_PAUSE)
  .reset(onRestart)

$appleStore.on(onEatApple, () => randomPosition()).reset(onRestart)

$snakesStore
  .on(onEatApple, (snakes, { id, peaceOfSnake }) =>
    snakes.map((snake) => {
      if (snake.id === id) {
        return addPeaceOfSnake(setScore(snake, snake.score + 1), peaceOfSnake)
      }

      return snake
    })
  )
  .on(onMoveSnake, (snakes, { id, nextPosition }) =>
    snakes.map((snake) => {
      if (snake.id === id) {
        return moveSnake(snake, nextPosition)
      }

      return snake
    })
  )
  .on(onSetDirectionForSnake, (snakes, { id, direction }) =>
    snakes.map((snake) => {
      if (snake.id === id) {
        return setDirection(snake, direction)
      }

      return snake
    })
  )
  .on(onCrashSnake, (snakes, id) =>
    snakes.map((snake) => {
      if (snake.id === id) {
        return setCrash(snake, true)
      }

      return snake
    })
  )
  .reset(onRestart)

$gameMapStore
  .on(onUpdateGameMap, (state, index) => ({
    ...state,
    [index]: 1,
  }))
  .on(onClearGameMap, () => ({}))
  .reset(onRestart)

$algorithmsStore
  .on(onChangeAlgorithm, (state, id) => ({
    ...state,
    active: id,
  }))
  .reset(onRestart)
