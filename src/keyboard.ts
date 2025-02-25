export enum KEYS {
  LEFT_ARROW = 65,
  RIGHT_ARROW = 68,
  TOP_ARROW = 87,
  DOWN_ARROW = 83,
}

export function keyboardFactory(): { isDown: (arg0: number) => boolean } {
  let pressedKeys: Record<number, boolean> = {}

  document.addEventListener('keydown', (event) => {
    pressedKeys = {}

    if (Object.values(KEYS).includes(event.keyCode)) {
      pressedKeys[event.keyCode] = true
    }
  })

  return {
    isDown: (keyCode: number) => pressedKeys[keyCode],
  }
}
