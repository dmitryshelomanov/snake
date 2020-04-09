import { createEvent, Event } from 'effector'
import { Snake } from 'models/snake'

export const play: Event<void> = createEvent()
export const stop: Event<void> = createEvent()
export const restart: Event<void> = createEvent()

export const addUserToGame: Event<void> = createEvent()
export const removeUserFromGame: Event<void> = createEvent()

export const setCollisionState: Event<void> = createEvent()

export const setIndexesVisible: Event<void> = createEvent()

export const setLoggerState: Event<void> = createEvent()

// update all states per one update
export const updateStates: Event<{
  foods: Array<Food>
  snakes: Array<Snake>
}> = createEvent()

export const changeFps: Event<number> = createEvent()

export const fillEmptyGraphCells: Event<void> = createEvent()
