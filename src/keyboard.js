export const KEYS = {
  LEFT_ARROW: 65,
  RIGHT_ARROW: 68,
  TOP_ARROW: 87,
  DOWN_ARROW: 83,
}

export function keyboradFactory() {
  let pressedKeys = {}

  document.addEventListener('keyup', (event) => {
    event.preventDefault()

    pressedKeys = {}

    if (Object.values(KEYS).includes(event.key)) {
      pressedKeys[event.key] = true
    }
  })

  return {
    isDown: (keyCode) => pressedKeys[keyCode],
  }
}
