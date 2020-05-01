import { createStore } from 'effector'
import { generateRandomFoodByCount } from '../../utils'
import { foodCount } from '../../config'

export const $foods = createStore<Array<Food>>(
  generateRandomFoodByCount(foodCount)
)

export const $bricks = createStore<Array<Coords>>([])
