import uniqby from 'lodash-es/uniqBy'
import { updateStates } from '../game'
import { $foods } from './store'

$foods.on(updateStates, (prevFoods, { foods }) =>
  uniqby([...foods, ...prevFoods], (food) => food[1])
)
