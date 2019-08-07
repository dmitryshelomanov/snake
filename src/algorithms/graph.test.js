import { Graph } from './graph'

/*
Graph 10x6

[top,left,down,right]

[0 ][1 ][2 ][3 ][4 ][5 ][6 ][7 ][8 ][9 ]
[10][11][12][13][14][15][16][17][18][19]
[20][21][22][23][24][25][26][27][28][29]
[30][31][32][33][34][35][36][37][38][39]
[40][41][42][43][44][45][46][47][48][49]
[50][51][52][53][54][55][56][57][58][59]

*/
describe('Graph', () => {
  it('should get all neighbors graph', () => {
    const graph = new Graph({ w: 10, h: 6 })

    expect(graph.getNeighbors(0)).toEqual([50, 9, 10, 1])
    expect(graph.getNeighbors(10)).toEqual([0, 19, 20, 11])
  })
})
