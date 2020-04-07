import { createEvent } from 'effector'

export const play = createEvent('play game')
export const stop = createEvent('stop game')
export const restart = createEvent('restart game')

export const addUserToGame = createEvent('add user to game')
export const removeUserFromGame = createEvent('remove user from game')

export const setCollisionState = createEvent('set collision state')

export const setIndexesVisible = createEvent('set visible indexes')

export const setLoggerState = createEvent('on toggle logger')

// update all states per one update
export const updateStates = createEvent('update states')

export const changeFps = createEvent('change fps')
