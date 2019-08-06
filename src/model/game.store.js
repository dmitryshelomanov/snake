import { createStore } from 'effector'
import {
  breadthFirstSearch,
  depthFirstSearch,
  dijkstra,
  greedy,
  aStar,
} from '../algorithms'
import { manhattanDistance, chebyshevDistance } from '../algorithms/heuristic'
import { randomPosition, generateRandomFoodByCount } from '../utils'
import { Snake } from './snake'

export const GAME_STATE = {
  IS_PLAY: 1,
  IS_PAUSE: 2,
}

export const PLACE_TYPE = {
  EMPTY: undefined,
  GAME_OBJECT: 1,
  BRICK: 2,
  FOOD: 3,
}

export const $gameStateStore = createStore(GAME_STATE.IS_PAUSE)

export const $foodsStore = createStore(generateRandomFoodByCount(6))

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
      head: 'rgb(255, 221, 0)',
      tail: 'rgb(255, 251, 152)',
    },
    id: 'ai-1',
  }),
])

export const $gameCollisionStateStore = createStore(true)

export const $snakeIterator = createStore(
  Array.from(
    { length: $snakesStore.getState().length },
    (_, i) => $snakesStore.getState()[i].id
  )
)

export const $heuristicsStore = createStore([
  {
    id: 'manhattan',
    name: 'Manhattan',
    alg: manhattanDistance,
  },
  {
    id: 'chebyshev',
    name: 'Chebyshev',
    alg: chebyshevDistance,
  },
])

export const $algorithmsStore = createStore([
  {
    id: 'breadth',
    alg: breadthFirstSearch,
    name: 'Breadth first search',
  },
  {
    id: 'depth',
    alg: depthFirstSearch,
    name: 'Depth first search',
  },
  {
    id: 'dijkstra',
    alg: dijkstra,
    name: 'Dijkstra algorighm',
  },
  {
    id: 'greedy',
    alg: greedy,
    name: 'Greedy algorighm (has heuristic)',
    activeHeuristic: 'manhattan',
    hasHeuristic: true,
  },
  {
    id: 'aStar',
    alg: aStar,
    name: 'A* algorighm (has heuristic)',
    activeHeuristic: 'manhattan',
    hasHeuristic: true,
  },
])

export function buildSettingsForSnake() {
  return {
    showAIPathToTarget: false,
    activeAlgorithm: 'breadth',
    activeHeuristic: 'manhattan',
  }
}

export const $settingsForSnakesStore = createStore(
  $snakesStore.getState().reduce(
    (acc, snake) => ({
      ...acc,
      [snake.id]: buildSettingsForSnake(),
    }),
    {}
  )
)

export const $brickStore = createStore([])

export const $userInGameStore = createStore(false)

export const $indexesVisibleStore = createStore(false)

export const $enableLoggerStore = createStore(false)
