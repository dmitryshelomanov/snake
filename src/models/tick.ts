import {
  createStore,
  createEffect,
  sample,
  attach,
  createEvent,
  combine,
  Store,
  EventCallable,
  merge,
} from 'effector'
import { GAME_STATE } from '../config'
import { $gameState, $fps, restart, play } from './game'
import { World } from '../world'

const $isPlay = $gameState.map((s) => s === GAME_STATE.IS_PLAY)
const $isPause = $gameState.map((s) => s === GAME_STATE.IS_PAUSE)

const tickFx = createEffect<number, void>().use(
  (fps) =>
    new Promise((rs) => {
      setTimeout(rs, 1000 / fps)
    })
)

type Props = {
  $state: Store<World>
  runLogic: (arg0: { state: World; tick: number }) => void
  runRender: (arg0: { state: World; tick: number }) => void
}

type TickResult = { $tick: Store<number>; start: EventCallable<void> }

export function createTick({ $state, runLogic, runRender }: Props): TickResult {
  const $tick = createStore(0)
  const render = createEvent()
  const start = createEvent()

  const $combinedState = combine($tick, $state, (tick, state) => ({
    tick,
    state,
  }))

  const nextTickFx = attach({
    effect: tickFx,
    source: $fps,
    mapParams: (_, fps) => fps,
  })

  const triggerTick = sample({
    clock: merge([nextTickFx.done, play]),
    filter: $isPlay,
  })

  const triggerRender = sample({ clock: $state, filter: $isPause })

  $tick.on(nextTickFx.done, (previous) => previous + 1).reset(restart)

  sample({ source: $combinedState, clock: nextTickFx }).watch((state) => {
    runLogic(state)
  })
  sample({ source: $combinedState, clock: render }).watch((state) => {
    runRender(state)
  })

  sample({
    clock: [start, triggerTick],
    target: nextTickFx,
  })

  sample({
    clock: [triggerRender, nextTickFx.done],
    target: render,
  })

  return {
    $tick,
    start,
  }
}
