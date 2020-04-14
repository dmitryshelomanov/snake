import {
  createStore,
  createEffect,
  forward,
  sample,
  guard,
  attach,
  merge,
  createEvent,
  combine,
  Store,
  Event,
} from 'effector'
import { GAME_STATE } from '../config'
import { $gameState, $fps, restart, play } from './game'

const $isPlay = $gameState.map((s) => s === GAME_STATE.IS_PLAY)
const $isPause = $gameState.map((s) => s === GAME_STATE.IS_PAUSE)

const tickFx = createEffect<number, void>().use(
  (fps) =>
    new Promise((rs) => {
      setTimeout(rs, 1000 / fps)
    })
)

type Props<State> = {
  $state: Store<State>
  runLogic: (arg0: { state: State; tick: number }) => void
  runRender: (arg0: { state: State; tick: number }) => void
}

type TickResult = { $tick: Store<number>; start: Event<void> }

export function createTick<State>({
  $state,
  runLogic,
  runRender,
}: Props<State>): TickResult {
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

  const triggerTick = guard(merge([nextTickFx.done, play]), { filter: $isPlay })

  const triggerRender = guard($state, { filter: $isPause })

  $tick.on(nextTickFx.done, (previous) => previous + 1).reset(restart)

  sample($combinedState, nextTickFx).watch(runLogic)
  sample($combinedState, render).watch(runRender)

  forward({
    from: merge([start, triggerTick]),
    to: nextTickFx,
  })

  forward({
    from: merge([triggerRender, nextTickFx.done]),
    to: render,
  })

  return {
    $tick,
    start,
  }
}
