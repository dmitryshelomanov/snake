export function setCanvasSize(
  canvas: HTMLCanvasElement,
  { w, h }: { w: number; h: number }
): void {
  canvas.height = h
  canvas.width = w
}

export function configureCanvas(
  canvas: HTMLCanvasElement,
  globalSize: { w: number; h: number }
): void {
  setCanvasSize(canvas, globalSize)
}
