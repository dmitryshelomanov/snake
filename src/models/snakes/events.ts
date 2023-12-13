import { createEvent, EventCallable } from 'effector'
import { SnakeSettings } from '../snake'

export const addSnake: EventCallable<{ snakeId: string; isAi: boolean }> =
  createEvent()
export const removeSnake: EventCallable<string> = createEvent()

export const updateSettingForSnake: EventCallable<{
  snakeId: string
  settings: Partial<SnakeSettings>
}> = createEvent()
