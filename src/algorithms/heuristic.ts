/*
  Note:

  эвристики помогающие определить лучший вариант для определенного случая
  (конкретно тут выбрать следующую позицию которая приблизит к цели)
*/

// reference http://lightcone.ru/manhattan/
export function manhattanDistance([x, y]: Coords, [x1, y1]: Coords): number {
  return Math.abs(x - x1) + Math.abs(y - y1)
}

export function chebyshevDistance([x, y]: Coords, [x1, y1]: Coords): number {
  return Math.max(x - x1, y - y1)
}
