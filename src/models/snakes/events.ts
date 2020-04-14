import { createEvent, Event } from 'effector'
import { SnakeSettings } from '../snake'

export const addSnake: Event<{ snakeId: string; isAi: boolean }> = createEvent()
export const removeSnake: Event<string> = createEvent()

export const updateSettingForSnake: Event<{
  snakeId: string
  settings: Partial<SnakeSettings>
}> = createEvent()
