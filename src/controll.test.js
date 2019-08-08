import { getDirectionByPosition } from './controll'
import { DIRECTIONS } from './config'

/*
Map 4x4

[0,0][1,0][2,0][3,0]
[0,1][1,1][2,1][3,1]
[0,2][1,2][2,2][3,2]
[0,3][1,3][2,3][3,3]
*/

describe('controll', () => {
  it('should return valid direction by position', () => {
    expect(getDirectionByPosition([0, 0], [1, 0])).toBe(DIRECTIONS.RIGHT)
  })
})
