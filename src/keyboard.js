/* eslint-disable unicorn/prefer-event-key */
export const KEYS = {
  LEFT_ARROW: 65,
  RIGHT_ARROW: 68,
  TOP_ARROW: 87,
  DOWN_ARROW: 83,
}

export function keyboradFactory() {
  let pressedKeys = {}

  document.addEventListener('keydown', (event) => {
    event.preventDefault()

    pressedKeys = {}

    if (Object.values(KEYS).includes(event.keyCode)) {
      pressedKeys[event.keyCode] = true
    }
  })

  return {
    isDown: (keyCode) => pressedKeys[keyCode],
  }
}
