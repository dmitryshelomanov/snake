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

export function restorePathFromMap({
  end,
  start,
  parent,
}: {
  end: number
  start: number
  parent: Map<number, number>
}) {
  const path = [end]
  let goal = parent.get(end)

  while (goal !== undefined && goal !== start) {
    path.unshift(goal)
    goal = parent.get(goal)
  }

  return path
}
