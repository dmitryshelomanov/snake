import { createEvent } from 'effector'

export const addSnake = createEvent('add snake to game')
export const removeSnake = createEvent('remove snake from game')

export const updateSettingForSnake = createEvent('upadte setting for snake')
