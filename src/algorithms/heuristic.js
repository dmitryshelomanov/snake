/* reference http://lightcone.ru/manhattan/ */

export function manhattanDistance([x, y], [x1, y1]) {
  return Math.abs(x - x1) + Math.abs(y - y1)
}

export function pifagorDistance([x, y], [x1, y1]) {
  const [x3, y3] = [x - x1, y - y1]

  return Math.sqrt(x3 ** 2 + y3 ** 2)
}

export function chebyshevDistance([x, y], [x1, y1]) {
  return Math.max(x - x1, y - y1)
}
