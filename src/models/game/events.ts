import { createEvent } from 'effector'

export const play = createEvent()
export const stop = createEvent()
export const restart = createEvent()

export const addUserToGame = createEvent()
export const removeUserFromGame = createEvent()

export const setCollisionState = createEvent()

export const setIndexesVisible = createEvent()

export const setLoggerState = createEvent()

// update all states per one update
export const updateStates = createEvent()

export const changeFps = createEvent()

export const fillEmptyGraphCells = createEvent()
