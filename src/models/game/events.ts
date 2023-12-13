import { createEvent, EventCallable } from 'effector'
import { Snake } from '../snake'

export const play: EventCallable<void> = createEvent()
export const stop: EventCallable<void> = createEvent()
export const restart: EventCallable<void> = createEvent()

export const addUserToGame: EventCallable<void> = createEvent()
export const removeUserFromGame: EventCallable<void> = createEvent()

export const setCollisionState: EventCallable<void> = createEvent()

export const setIndexesVisible: EventCallable<void> = createEvent()

export const setLoggerState: EventCallable<void> = createEvent()

// update all states per one update
export const updateStates: EventCallable<{
  foods: Array<Food>
  snakes: Array<Snake>
}> = createEvent()

export const changeFps: EventCallable<number> = createEvent()

export const fillEmptyGraphCells: EventCallable<void> = createEvent()
