import { createEvent } from 'effector'

export const generateFoods = createEvent()

export const addBrick = createEvent<Coords>()
