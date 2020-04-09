import { createStore } from 'effector'
import { updaters } from '../../updaters'
import { buildSettingsForSnake, Snake, getColorsForSnake } from '../snake'
import { randomPosition } from '../../utils'
import { snakeCount } from '../../config'

function buildSnakesByCount(count) {
  const snakes = []

  for (let i = 1; i <= count; i++) {
    snakes.push(
      Snake.build(randomPosition(), {
        colors: getColorsForSnake(),
        id: `ai-${i}`,
        isAi: true,
        updater: updaters.ai,
      })
    )
  }

  return snakes
}

export const $snakes = createStore(buildSnakesByCount(snakeCount))

export const $snakeIdsAsString = $snakes.map(
  (snakes) => snakes.map((snake) => snake.id).join(','),
  ''
)

export const $snakesIterator = $snakeIdsAsString.map(
  (idsAsString) => idsAsString.split(','),
  []
)

export const $settingsForSnakes = $snakesIterator.map(
  (ids, settings) =>
    ids.reduce((nextSettiings, id) => {
      if (!settings[id]) {
        nextSettiings[id] = buildSettingsForSnake()
      }

      return nextSettiings
    }, settings),
  {}
)

export const $isUserInGame = $snakes.map(
  (snakes) => !!snakes.find((snake) => snake.id === 'user')
)
