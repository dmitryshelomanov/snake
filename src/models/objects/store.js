import { createStore } from 'effector'
import { generateRandomFoodByCount } from '../../utils'

export const $foods = createStore(generateRandomFoodByCount(50))
