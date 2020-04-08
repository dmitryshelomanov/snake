import { createStore } from 'effector'
import { generateRandomFoodByCount } from '../../utils'
import { foodCount } from '../../config'

export const $foods = createStore(generateRandomFoodByCount(foodCount))
