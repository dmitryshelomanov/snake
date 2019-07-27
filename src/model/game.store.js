import { createStore } from 'effector'
import { randomPosition } from '../utils'
import { Snake } from './snake'

export const GAME_STATE = {
  IS_PLAY: 1,
  IS_PAUSE: 2,
}

export const $gameStateStore = createStore(GAME_STATE.IS_PLAY)

export const getGameState = () => $gameStateStore.getState()

export const $appleStore = createStore(randomPosition())

export const getAppleState = () => $appleStore.getState()

export const $gameMapStore = createStore({})

export const getGameMapState = () => $gameMapStore.getState()

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

export const getSnakesState = () => $snakesStore.getState()

export const getSnakeState = (id) =>
  getSnakesState().find((snake) => snake.id === id)

export const $gameCollisionStore = createStore(true)

export const getCollisionState = () => $gameCollisionStore.getState()
