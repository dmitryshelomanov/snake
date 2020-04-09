export function restorePath(
  end: number,
  start: number,
  parent: { [key: number]: number }
) {
  const path = [end]
  let goal = parent[end]

  while (goal !== start) {
    path.unshift(goal)
    goal = parent[goal]
  }

  return path
}
