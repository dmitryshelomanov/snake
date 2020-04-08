export function createFirstEmptyCellSaver() {
  let cell

  return {
    getCell: () => {
      return [cell].filter(Boolean)
    },
    saveCell: (nextCell) => {
      if (!cell) {
        cell = nextCell
      }
    },
  }
}
