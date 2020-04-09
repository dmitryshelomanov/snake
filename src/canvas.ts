export function setCanvasSize(canvas, { w, h }) {
  canvas.height = h
  canvas.width = w
}

export function convigureCanvas(canvas, localSize, globalSize) {
  setCanvasSize(canvas, globalSize)
}
