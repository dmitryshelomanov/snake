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
import { updaters } from '../../updaters'
import { addSnake, removeSnake, updateSettingForSnake } from './events'
import {
  $snakes,
  $settingsForSnakes,
  $snakesIterator,
  applySettingsToSnales,
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
      isAi,
      // @ts-ignore
      updater: isAi ? updaters.ai : updaters.user,
    }),
  ])
  .on(removeSnake, (snakes, snakeId) =>
    snakes.filter((snake) => snake.id !== snakeId)
  )
  .reset(restart)

$settingsForSnakes
  .on(removeSnake, (settings, id) => {
    delete settings[id]

    const { ...nextSettiings } = settings

    return nextSettiings
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
  fn: (settings, ids) => applySettingsToSnales(ids, settings),
  target: $settingsForSnakes,
})

sample({
  clock: addUserToGame,
  target: addSnake.prepend(() => ({ snakeId: 'user', isAi: false })),
})

sample({
  clock: removeUserFromGame,
  target: removeSnake.prepend(() => 'user'),
})
