import { drawSquare, renderText } from './renderer'
import { getIndexByPosition } from './utils'
import {
  getIndexesVisibleStore,
  getGameMapState,
  onAddBrick,
  onRemoveBrick,
  PLACE_TYPE,
} from './model'
import { registerClickEventToCanvas } from './controll'

export function renderBrick(context, brick, callback) {
  const index = getIndexByPosition(brick)

  callback(index)
  drawSquare(context, brick, { color: '#d2b3b3' })

  if (getIndexesVisibleStore()) {
    renderText(context, index, brick)
  }
}

export function renderBricks(context, briks, callback) {
  for (const brick of briks) {
    renderBrick(context, brick, callback)
  }
}

export function registerEvents() {
  let isRemove = false

  function addBrick(index) {
    const gameMapState = getGameMapState()

    if (gameMapState[index] !== PLACE_TYPE.GAME_OBJECT) {
      onAddBrick(index)
    }
  }

  function removeBrick(index) {
    const gameMapState = getGameMapState()

    if (gameMapState[index] === PLACE_TYPE.BRICK) {
      onRemoveBrick(index)
    }
  }

  registerClickEventToCanvas.addMouseDownEvent((index) => {
    const gameMapState = getGameMapState()

    if (gameMapState[index] === PLACE_TYPE.BRICK) {
      isRemove = true
      removeBrick(index)
    } else {
      isRemove = false
      addBrick(index)
    }
  })

  registerClickEventToCanvas.addMouseMoveEvent((index) => {
    if (isRemove) {
      removeBrick(index)
    } else {
      addBrick(index)
    }
  })
}

registerClickEventToCanvas.addEventsForRegister(registerEvents)
