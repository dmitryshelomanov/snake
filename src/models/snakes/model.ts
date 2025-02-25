import { sample } from 'effector'
import uniqBy from 'lodash-es/uniqBy'
import { randomPosition } from '../../utils'
import { getColorsForSnake, buildSnake } from '../snake'
import {
  addUserToGame,
  removeUserFromGame,
  restart,
  updateStates,
} from '../game'
import { addSnake, removeSnake, updateSettingForSnake } from './events'
import {
  $snakes,
  $settingsForSnakes,
  $snakesIterator,
  applySettingsToSnakes,
} from './store'

$snakes
  .on(updateStates, (prev, { snakes }) =>
    uniqBy([...snakes, ...prev], (snake) => snake.id)
  )
  .on(addSnake, (snakes, { snakeId, isAi }) => [
    ...snakes,
    buildSnake(randomPosition(), {
      colors: getColorsForSnake(),
      id: snakeId,
      type: isAi ? 'AI' : 'USER',
    }),
  ])
  .on(removeSnake, (snakes, snakeId) =>
    snakes.filter((snake) => snake.id !== snakeId)
  )
  .reset(restart)

$settingsForSnakes
  .on(removeSnake, (settings, id) => {
    const { [id]: _, ...nextSettings } = settings

    return nextSettings
  })
  .on(updateSettingForSnake, (state, { snakeId, settings }) => {
    if (state[snakeId]) {
      return {
        ...state,
        [snakeId]: {
          ...state[snakeId],
          ...settings,
        },
      }
    }

    return state
  })
  .reset(restart)

sample({
  source: $settingsForSnakes,
  clock: $snakesIterator,
  fn: (settings, ids) => applySettingsToSnakes(ids, settings),
  target: $settingsForSnakes,
})

sample({
  clock: addUserToGame,
  fn: () => ({ snakeId: 'user', isAi: false }),
  target: addSnake,
})

sample({
  clock: removeUserFromGame,
  fn: () => 'user',
  target: removeSnake,
})
