import { useStoreMap } from 'effector-react'
import { $snakesStore } from '../model'

export function useSnakeIsCrahedState(snakeId) {
  const isCrash = useStoreMap({
    store: $snakesStore,
    keys: [snakeId],
    fn: (snakes, [id]) => {
      const snake = snakes.find((s) => s.id === id)

      return snake ? snake.isCrash : undefined
    },
  })

  return isCrash
}

export function useSnakeScoreState(snakeId) {
  const score = useStoreMap({
    store: $snakesStore,
    keys: [snakeId],
    fn: (snakes, [id]) => {
      const snake = snakes.find((s) => s.id === id)

      return snake ? snake.score : undefined
    },
  })

  return score
}

export function useSnakeColorState(snakeId) {
  const colors = useStoreMap({
    store: $snakesStore,
    keys: [snakeId],
    fn: (snakes, [id]) => {
      const snake = snakes.find((s) => s.id === id)

      return snake ? snake.colors : { head: 'black', tail: 'black' }
    },
  })

  return colors
}
