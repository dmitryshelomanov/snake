// Array where index is node
export function buildGraph({ w, h }) {
  const graph = Array.from({ length: w * h }, (_, index) => index)

  return graph
}
