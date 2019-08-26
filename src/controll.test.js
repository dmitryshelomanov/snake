import {
  getDirectionByPosition,
  getNextPositionByDirection,
  createTimeController,
} from './controll'
import { DIRECTIONS } from './config'

/*
Map 4x4

[0,0][1,0][2,0][3,0] is equals to [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
[0,1][1,1][2,1][3,1]
[0,2][1,2][2,2][3,2]
[0,3][1,3][2,3][3,3]
*/

describe('controll', () => {
  it('should return valid direction by position', () => {
    expect(getDirectionByPosition([0, 0], [1, 0])).toBe(DIRECTIONS.RIGHT)
  })

  it('should return valid position', () => {
    expect(getNextPositionByDirection([0, 0], DIRECTIONS.RIGHT)).toEqual([1, 0])
    expect(getNextPositionByDirection([3, 0], DIRECTIONS.LEFT)).toEqual([2, 0])
    expect(getNextPositionByDirection([3, 1], DIRECTIONS.TOP)).toEqual([3, 0])
    expect(getNextPositionByDirection([3, 1], DIRECTIONS.DOWN)).toEqual([3, 2])
  })

  const pause = jest.spyOn(createTimeController(), 'pause')
  const play = jest.spyOn(createTimeController(), 'play')

  it('controll buttons', () => {
    expect(pause()).toEqual(onStop())
    expect(play()).toEqual(onPlay())
  })
})
