import {
  createStore,
  createEffect,
  forward,
  sample,
  guard,
  attach,
  merge,
} from 'effector'
import { GAME_STATE } from '../config'
import { $gameState, $fps, play, stop } from './game'

const $isPlay = $gameState.map((s) => s === GAME_STATE.IS_PLAY)

const tickFx = createEffect().use(
  (fps) =>
    new Promise((rs, rej) => {
      const unbind = stop.watch(() => {
        rej()
        unbind()
      })

      setTimeout(() => {
        rs()
        unbind()
      }, 1000 / fps)
    })
)

export function createTick({ $state, runLogic, runRender }) {
  const $tick = createStore(0)

  const nextTickFx = attach({
    effect: tickFx,
    source: $fps,
    mapParams: (_, fps) => fps,
  })

  $tick.on(nextTickFx.done, (previous) => previous + 1)

  sample($state, nextTickFx).watch(runLogic)
  sample($state, nextTickFx.done).watch(runRender)

  forward({
    from: guard(merge([nextTickFx.done, $isPlay]), { filter: $isPlay }),
    to: nextTickFx,
  })

  return {
    $tick,
    nextTickFx,
  }
}
