import uniqby from 'lodash-es/uniqBy'
import { pointsAreEquals } from '../../utils'
import { updateStates, restart } from '../game'
import { $foods, $bricks } from './store'
import { addBrick } from './events'

$foods
  .on(updateStates, (prevFoods, { foods }) =>
    uniqby([...foods, ...prevFoods], (food) => food[1])
  )
  .reset(restart)

$bricks
  .on(addBrick, (bricks, brick) => {
    const hasBrick = bricks.find((pos) => pointsAreEquals(pos, brick))

    if (hasBrick) {
      return bricks.filter((pos) => !pointsAreEquals(pos, brick))
    }

    return [...bricks, brick]
  })
  .reset(restart)
