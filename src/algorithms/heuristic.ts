/*
  Note:

  эвристики помогающие определить лучший вариант для определенного случая
  (конкретно тут выбрать следующую позицию которая приблизит к цели)
*/

// reference http://lightcone.ru/manhattan/
export function manhattanDistance({
  p: [x, y],
  p1: [x1, y1],
}: HeuristicProps): number {
  return Math.abs(x1 - x) + Math.abs(y1 - y)
}

export function chebyshevDistance({
  p: [x, y],
  p1: [x1, y1],
}: HeuristicProps): number {
  return Math.max(x1 - x, y1 - y)
}
