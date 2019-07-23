export const KEYS = {
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
  TOP_ARROW: 38,
  DOWN_ARROW: 40,
}

export function keyboradFactory() {
  let pressedKeys = {}

  document.addEventListener('keyup', (e) => {
    e.preventDefault()

    pressedKeys = {}

    if (Object.values(KEYS).includes(e.keyCode)) {
      pressedKeys[e.keyCode] = true
    }
  })

  return {
    isDown: (keyCode) => pressedKeys[keyCode],
  }
}
