export function restorePathFromMap({
  end,
  start,
  parent,
}: {
  end: number
  start: number
  parent: Map<number, number>
}): Array<number> {
  const path = [end]
  let goal = parent.get(end)

  while (goal !== undefined && goal !== start) {
    path.unshift(goal)
    goal = parent.get(goal)
  }

  return path
}
