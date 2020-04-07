import { createStore } from 'effector'
import {
  breadthFirstSearch,
  depthFirstSearch,
  dijkstra,
  greedy,
  aStar,
} from '../../algorithms'
import {
  manhattanDistance,
  chebyshevDistance,
} from '../../algorithms/heuristic'

export const $heuristics = createStore([
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

export const $algorithms = createStore([
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
