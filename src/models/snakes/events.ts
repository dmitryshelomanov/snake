import { createEvent, Event } from 'effector'
import { SnakeSettings } from 'models/snake'

export const addSnake: Event<{ snakeId: string; isAi: boolean }> = createEvent()
export const removeSnake: Event<string> = createEvent()

export const updateSettingForSnake: Event<{
  snakeId: string
  settings: Partial<SnakeSettings>
}> = createEvent()
