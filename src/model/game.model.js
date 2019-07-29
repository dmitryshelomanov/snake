import { merge } from 'effector'
import { randomPosition, getPositionByIndex } from '../utils'
import {
  $gameStateStore,
  $appleStore,
  $snakesStore,
  $gameMapStore,
  $algorithmsStore,
  $gameCollisionStateStore,
  $brickStore,
  PLACE_TYPE,
  GAME_STATE,
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
  onSetCollisionState,
  onAddBrick,
  onRemoveBrick,
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
  .on(onUpdateGameMap, (state, { index, placeType }) => ({
    ...state,
    [index]: placeType,
  }))
  .on(onAddBrick, (state, index) => ({
    ...state,
    [index]: PLACE_TYPE.BRICK,
  }))
  .on(merge([onClearGameMap, onRemoveBrick]), (state, index) => ({
    ...state,
    [index]: undefined,
  }))
  .reset(onRestart)

$algorithmsStore
  .on(onChangeAlgorithm, (state, id) => ({
    ...state,
    active: id,
  }))
  .reset(onRestart)

$gameCollisionStateStore.on(onSetCollisionState, (_, state) => state)

$brickStore
  .on(onAddBrick, (bricks, index) => [...bricks, getPositionByIndex(index)])
  .on(onRemoveBrick, (bricks, index) => {
    const [x, y] = getPositionByIndex(index)

    return bricks.filter(([x1, y1]) => x1 !== x || y1 !== y)
  })
  .reset(onRestart)
