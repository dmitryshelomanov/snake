export function createFirstEmptyCellSaver() {
  let cell: number

  return {
    getCell: (): Array<number> => {
      return [cell].filter(Boolean)
    },
    saveCell: (nextCell: number) => {
      if (!cell) {
        cell = nextCell
      }
    },
  }
}
