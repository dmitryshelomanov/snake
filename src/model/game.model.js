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
  $userInGameStore,
  $snakeIterator,
  $showAIPathToTargetStore,
  $indexesVisibleStore,
  $processedItemsVisibleStore,
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
  onAddUserToGame,
  onRemoveUserFromGame,
  onSetAiPathVisibleToTarget,
  onSetIndexesVisible,
  onSetProcessedItemsVisible,
  onChangeHeuristic,
} from './game.events'
import {
  setScore,
  moveSnake,
  setDirection,
  addPeaceOfSnake,
  setCrash,
  Snake,
} from './snake'

function getUserSnake() {
  return Snake.build(randomPosition(), {
    colors: {
      head: 'rgb(0, 132, 255)',
      tail: 'rgba(0, 132, 255, 0.7)',
    },
    id: 'user',
  })
}

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
  .on(onAddUserToGame, (snakes) => [...snakes, getUserSnake()])
  .on(onRemoveUserFromGame, (snakes) =>
    snakes.filter((snake) => snake.id !== 'user')
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
  .on(onChangeHeuristic, (state, { algId, heuristicId }) => ({
    ...state,
    list: state.list.map((alg) => {
      if (alg.id === algId) {
        return {
          ...alg,
          activeHeuristic: heuristicId,
        }
      }

      return alg
    }),
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

$userInGameStore
  .on(onAddUserToGame, () => true)
  .on(onRemoveUserFromGame, () => false)
  .reset(onRestart)

$snakeIterator
  .on(onAddUserToGame, (snakeIds) => [...snakeIds, 'user'])
  .on(onRemoveUserFromGame, (snakeIds) =>
    snakeIds.filter((id) => id !== 'user')
  )
  .reset(onRestart)

$showAIPathToTargetStore
  .on(onSetAiPathVisibleToTarget, (_, state) => state)
  .reset(onRestart)

$indexesVisibleStore
  .on(onSetIndexesVisible, (_, state) => state)
  .reset(onRestart)

$processedItemsVisibleStore
  .on(onSetProcessedItemsVisible, (_, state) => state)
  .reset(onRestart)
