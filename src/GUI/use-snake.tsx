import { useStoreMap } from 'effector-react'
import { $snakes, $settingsForSnakes } from '../models/snakes'

export function useSnakeIsCrahedState(snakeId) {
  const isCrash = useStoreMap({
    store: $snakes,
    keys: [snakeId],
    fn: (snakes, [id]) => {
      const snake = snakes.find((s) => s.id === id)

      return snake ? snake.isCrash : null
    },
  })

  return isCrash
}

export function useSnakeScoreState(snakeId) {
  const score = useStoreMap({
    store: $snakes,
    keys: [snakeId],
    fn: (snakes, [id]) => {
      const snake = snakes.find((s) => s.id === id)

      return snake ? snake.score : null
    },
  })

  return score
}

export function useSnakeColorState(snakeId) {
  const colors = useStoreMap({
    store: $snakes,
    keys: [snakeId],
    fn: (snakes, [id]) => {
      const snake = snakes.find((s) => s.id === id)

      return snake ? snake.colors : { head: 'black', tail: 'black' }
    },
  })

  return colors
}

export function useSnakeSetings(snakeId) {
  const settings = useStoreMap({
    store: $settingsForSnakes,
    keys: [snakeId],
    fn: (settings, [id]) => settings[id],
  })

  return settings || {}
}
