import { createEvent } from 'effector'

export const onPlay = createEvent('play game')
export const onStop = createEvent('stop game')
export const onRestart = createEvent('restart game')

export const onEatFood = createEvent('eat food')
export const onGenerateFoods = createEvent('generate food')

export const onMoveSnake = createEvent('move snake')
export const onSetDirectionForSnake = createEvent(`set snake's direction`)
export const onCrashSnake = createEvent('on crash snake')

export const onClearGameMap = createEvent('clear game map')
export const onUpdateGameMap = createEvent('upadte game map')
export const onUpdateGameMapWithNexState = createEvent(
  'upadte game map with next state'
)

export const onChangeAlgorithm = createEvent('change algoright')
export const onChangeHeuristic = createEvent('change heuristic')

export const onSetCollisionState = createEvent('set collision state')

export const onAddBrick = createEvent('add brick')
export const onRemoveBrick = createEvent('remove brick')

export const onAddUserToGame = createEvent('add user to game')
export const onRemoveUserFromGame = createEvent('remove user from game')

export const onSetAiPathVisibleToTarget = createEvent(
  'set visible path to target'
)

export const onSetIndexesVisible = createEvent('set visible indexes')

export const onToggleLoggerState = createEvent('on toggle logger')

export const onUpdateSettingForSnake = createEvent('upadte setting for snake')
