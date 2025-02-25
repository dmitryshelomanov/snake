import { createStore, StoreWritable } from 'effector'
import {
  getColorsForSnake,
  buildSnake,
  SnakeSettings,
  Snake,
  buildSettingsForSnake,
} from '../snake'
import { randomPosition } from '../../utils'
import { snakeCount } from '../../config'

export type SettingsStore = {
  [key: string]: SnakeSettings
}

function buildSnakesByCount(count: number): Array<Snake> {
  const snakes = []

  for (let i = 1; i <= count; i++) {
    snakes.push(
      buildSnake(randomPosition(), {
        colors: getColorsForSnake(),
        id: `ai-${i}`,
        type: 'AI',
      })
    )
  }

  return snakes
}

export function applySettingsToSnakes(ids: string[], settings: SettingsStore) {
  return ids.reduce((nextSettings, id) => {
    if (!nextSettings[id]) {
      nextSettings[id] = buildSettingsForSnake()
    }

    return nextSettings
  }, settings)
}

const initialSnakes = buildSnakesByCount(snakeCount)

export const $snakes = createStore(initialSnakes)

export const $settingsForSnakes: StoreWritable<SettingsStore> = createStore(
  applySettingsToSnakes(
    initialSnakes.map((snake) => snake.id),
    {}
  )
)

export const $snakeIdsAsString = $snakes.map((snakes) =>
  snakes.map((snake) => snake.id).join(',')
)

export const $snakesIterator = $snakeIdsAsString.map((idsAsString) =>
  idsAsString.split(',')
)

export const $isUserInGame = $snakes.map(
  (snakes) => !!snakes.find((snake) => snake.id === 'user')
)
