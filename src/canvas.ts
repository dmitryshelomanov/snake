export function setCanvasSize(
  canvas: HTMLCanvasElement,
  { w, h }: { w: number; h: number }
) {
  canvas.height = h
  canvas.width = w
}

export function convigureCanvas(
  canvas: HTMLCanvasElement,
  globalSize: { w: number; h: number }
) {
  setCanvasSize(canvas, globalSize)
}
