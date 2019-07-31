export function restorePath(end, start, parent) {
  const path = [end]
  let goal = parent[end]

  while (goal !== start) {
    path.unshift(goal)
    goal = parent[goal]
  }

  return path
}
