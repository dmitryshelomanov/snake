import { createStore } from 'effector'
import { breadthFirstSearch } from '../algorithms'
import { randomPosition } from '../utils'
import { Snake } from './snake'

export const GAME_STATE = {
  IS_PLAY: 1,
  IS_PAUSE: 2,
}

export const $gameStateStore = createStore(GAME_STATE.IS_PLAY)

export const $appleStore = createStore(randomPosition())

export const $gameMapStore = createStore({})

export const $snakesStore = createStore([
  Snake.build(randomPosition(), {
    colors: {
      head: 'rgb(0, 221, 0)',
      tail: 'rgb(152, 251, 152)',
    },
    id: 'ai',
  }),
  Snake.build(randomPosition(), {
    colors: {
      head: 'rgb(0, 132, 255)',
      tail: 'rgba(0, 132, 255, 0.7)',
    },
    id: 'user',
  }),
])

export const $gameCollisionStore = createStore(true)

export const $snakeIterator = createStore(
  Array.from(
    { length: $snakesStore.getState().length },
    (_, i) => $snakesStore.getState()[i].id
  )
)

export const $algorithmsStore = createStore({
  active: 'breadth',
  list: [
    {
      id: 'breadth',
      alg: breadthFirstSearch,
      name: 'Breadth first search',
    },
    {
      id: 'depth',
      alg: breadthFirstSearch,
      name: 'Depth first search',
    },
  ],
})

export const $activeAlgorithmStore = $algorithmsStore.map((algorithms) =>
  algorithms.list.find((alg) => alg.id === algorithms.active)
)