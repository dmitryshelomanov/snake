import { randomPosition, getPositionByIndex } from '../utils'
import {
  $gameStateStore,
  $foodsStore,
  $snakesStore,
  $gameMapStore,
  $gameCollisionStateStore,
  $brickStore,
  $userInGameStore,
  $snakeIterator,
  $indexesVisibleStore,
  $enableLoggerStore,
  $settingsForSnakesStore,
  PLACE_TYPE,
  GAME_STATE,
} from './game.store'
import {
  onPlay,
  onStop,
  onEatFood,
  onGenerateFoods,
  onMoveSnake,
  onSetDirectionForSnake,
  onRestart,
  onClearGameMap,
  onUpdateGameMap,
  onCrashSnake,
  onSetCollisionState,
  onAddBrick,
  onRemoveBrick,
  onAddUserToGame,
  onRemoveUserFromGame,
  onSetIndexesVisible,
  onToggleLoggerState,
  onUpdateSettingForSnake,
  onUpdateGameMapWithNexState,
  onAddSnake,
  onRemoveSnake,
} from './game.events'
import {
  setScore,
  moveSnake,
  setDirection,
  addPeaceOfSnake,
  setCrash,
  Snake,
  getColorsForSnake,
  buildSettingsForSnake,
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

// [[x,y], id]
$foodsStore
  .on(onEatFood, (state, { foodId }) =>
    state.map((food) => {
      if (food[1] === foodId) {
        return [randomPosition(), food[1]]
      }

      return food
    })
  )
  .on(onGenerateFoods, (state, foods) => [...state, ...foods])
  .reset(onRestart)

$snakesStore
  .on(onEatFood, (snakes, { id, peaceOfSnake }) =>
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
  .on(onAddSnake, (snakes, snakeId) => [
    ...snakes,
    Snake.build(randomPosition(), {
      colors: getColorsForSnake(),
      id: snakeId,
    }),
  ])
  .on(onRemoveSnake, (snakes, snakeId) =>
    snakes.filter((snake) => snake.id !== snakeId)
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
  .on(onRemoveBrick, (state, index) => ({
    ...state,
    [index]: undefined,
  }))
  .on(onUpdateGameMapWithNexState, (state, nextState) => ({
    ...state,
    ...nextState,
  }))
  .on(onClearGameMap, () => ({}))
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
  .on(onAddSnake, (snakeIds, snakeId) => [...snakeIds, snakeId])
  .on(onRemoveSnake, (snakeIds, snakeId) =>
    snakeIds.filter((id) => id !== snakeId)
  )
  .reset(onRestart)

$indexesVisibleStore
  .on(onSetIndexesVisible, (_, state) => state)
  .reset(onRestart)

$enableLoggerStore.on(onToggleLoggerState, (_, state) => state).reset(onRestart)

$settingsForSnakesStore
  .on(onUpdateSettingForSnake, (state, { snakeId, settingName, value }) => ({
    ...state,
    [snakeId]: {
      ...state[snakeId],
      [settingName]: value,
    },
  }))
  .on(onAddSnake, (settings, snakeId) => ({
    ...settings,
    [snakeId]: buildSettingsForSnake(),
  }))
  .reset(onRestart)
