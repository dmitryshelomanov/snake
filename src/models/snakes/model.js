import { forward } from 'effector'
import uniqBy from 'lodash-es/uniqBy'
import { randomPosition } from '../../utils'
import { Snake, getColorsForSnake } from '../snake'
import {
  addUserToGame,
  removeUserFromGame,
  restart,
  updateStates,
} from '../game'
import { updaters } from '../../updaters'
import { addSnake, removeSnake, updateSettingForSnake } from './events'
import { $snakes, $settingsForSnakes } from './store'

$snakes
  .on(updateStates, (prev, { snakes }) =>
    uniqBy([...snakes, ...prev], (snake) => snake.id)
  )
  .on(addSnake, (snakes, { snakeId, isAi }) => [
    ...snakes,
    Snake.build(randomPosition(), {
      colors: getColorsForSnake(),
      id: snakeId,
      isAi,
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
  .on(updateSettingForSnake, (state, { snakeId, settingName, value }) => {
    if (state[snakeId]) {
      return {
        ...state,
        [snakeId]: {
          ...state[snakeId],
          [settingName]: value,
        },
      }
    }

    return state
  })
  .reset(restart)

forward({
  from: addUserToGame,
  to: addSnake.prepend(() => ({ snakeId: 'user', isAi: false })),
})

forward({
  from: removeUserFromGame,
  to: removeSnake.prepend(() => 'user'),
})
