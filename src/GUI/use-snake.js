import { useStoreMap } from 'effector-react'
import { $snakesStore } from '../model'

export function useSnakeIsCrahedState(snakeId) {
  const isCrash = useStoreMap({
    store: $snakesStore,
    keys: [snakeId],
    fn: (snakes, [id]) => snakes.find((s) => s.id === id).isCrash,
  })

  return isCrash
}

export function useSnakeScoreState(snakeId) {
  const score = useStoreMap({
    store: $snakesStore,
    keys: [snakeId],
    fn: (snakes, [id]) => snakes.find((s) => s.id === id).score,
  })

  return score
}
