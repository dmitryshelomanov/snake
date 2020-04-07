/* eslint-disable unicorn/prevent-abbreviations */
import { combine } from 'effector'
import {
  getLocalSize,
  getGlobalSize,
  getIndexByPosition,
  randomPosition,
} from './utils'
import { buildGrid, renderPath, renderProcessed, renderSnake } from './renderer'
import { pageHeight, pageWidth, PLACE_TYPE } from './config'
import { canvasInput } from './controll'
import { convigureCanvas } from './canvas'
import {
  headSnake,
  setDirection,
  updateBody,
  addPeaceOfSnake,
  setScore,
  setCrash,
  tailSnake,
  setMeta,
  buildSettingsForSnake,
} from './models/snake'
import { Graph } from './algorithms'
import { renderGUI } from './GUI'
import { $snakes, $settingsForSnakes } from './models/snakes'
import { $graph } from './models/graph'
import { $foods } from './models/objects'
import { createTick } from './models/tick'
import { $isLoggerEnabled, $indexesVisible, updateStates } from './models/game'
import { renderFoods } from './renderer/foods'
import 'reset-css'
import { $algorithms, $heuristics } from './models/algorithms'

const defaultSettings = buildSettingsForSnake()

const $computedSnakes = combine(
  $snakes,
  $algorithms,
  $heuristics,
  $settingsForSnakes,
  (snakes, algorithms, heuristics, settings) =>
    snakes.map((snake) => {
      if (snake.isAi) {
        const settingsForSnake = settings[snake.id] || defaultSettings

        const traverseAlgorithm = algorithms.find(
          (algorithm) => algorithm.id === settingsForSnake.activeAlgorithm
        )

        const heuristic = heuristics.find(
          (it) => it.id === settingsForSnake.activeHeuristic
        )

        return {
          snake,
          settings: settingsForSnake,
          algorithm: {
            traverseAlgorithm: traverseAlgorithm?.alg,
            heuristic: heuristic?.alg,
          },
        }
      }

      return { snake }
    })
)

const $state = combine({
  isLoggerEnabled: $isLoggerEnabled,
  indexesVisible: $indexesVisible,
  graph: $graph,
  foods: $foods,
  computedSnakes: $computedSnakes,
})

function main(canvas, context) {
  renderGUI()
  canvasInput.registerClickEventToCanvas(canvas)
  canvasInput.callEventRegistars()

  const gridData = buildGrid(context)
  const localSize = getLocalSize(pageWidth, pageHeight)
  const globalSize = getGlobalSize(localSize.w, localSize.h)

  convigureCanvas(canvas, localSize, globalSize)

  function clearGame() {
    context.clearRect(0, 0, globalSize.w, globalSize.h)
  }

  function runLogic(nextState) {
    const nextSnakes = []
    const graph = Graph.extend(nextState.graph)
    let { foods } = nextState

    function markFoodOnGraph() {
      foods.forEach((food) => {
        const [position] = food
        const idx = getIndexByPosition(position)
        const vertex = graph.getVertex(idx)

        if (vertex.value === PLACE_TYPE.EMPTY) {
          graph.setValueByIndex(idx, PLACE_TYPE.FOOD)
        }
      })
    }

    function handleEatFood({ snake, nextPosition, nextIndex }) {
      const nextSnake = addPeaceOfSnake(
        setScore(snake, snake.score + 1),
        nextPosition
      )

      foods = foods.map((food) => {
        const [position, id] = food

        if (getIndexByPosition(position) === nextIndex) {
          return [randomPosition(), id]
        }

        return food
      })

      return nextSnake
    }

    function reCreateSnakeInGraph(prevSnake, nextSnake) {
      const tail = tailSnake(prevSnake)
      const head = headSnake(nextSnake)

      graph.setValueByIndex(getIndexByPosition(tail), PLACE_TYPE.EMPTY)
      graph.setValueByIndex(getIndexByPosition(head), PLACE_TYPE.GAME_OBJECT)
    }

    markFoodOnGraph()

    nextState.computedSnakes
      .filter(({ snake }) => !snake.isCrash)
      .forEach(({ snake, algorithm }) => {
        const { nextDirection, nextPosition, meta } = snake.updater({
          snake,
          ...algorithm,
          state: {
            ...nextState,
            graph,
            foods,
          },
        })

        const nextIndex = getIndexByPosition(nextPosition)
        const nextVertex = graph.getVertex(nextIndex)

        let nextSnake = snake

        if (meta && snake.isAi) {
          nextSnake = setMeta(snake, meta)
        }

        switch (nextVertex?.value) {
          case PLACE_TYPE.FOOD: {
            nextSnake = handleEatFood({
              snake: nextSnake,
              nextPosition,
              nextIndex,
            })
            break
          }

          case PLACE_TYPE.GAME_OBJECT: {
            nextSnake = setCrash(nextSnake, true)
            break
          }

          default: {
            nextSnake = setDirection(
              updateBody(nextSnake, nextPosition),
              nextDirection
            )
          }
        }

        reCreateSnakeInGraph(snake, nextSnake)

        nextSnakes.push(nextSnake)
      })

    updateStates({ snakes: nextSnakes, graph, foods })
  }

  function runRender(nextState) {
    const { computedSnakes, foods } = nextState

    clearGame()

    renderFoods(context, foods)

    computedSnakes.forEach(({ snake, settings }) => {
      if (snake.isAi) {
        const {
          showAIPathToTarget = false,
          showProcessedCells = false,
        } = settings

        renderSnake({ context, snake })

        if (showProcessedCells) {
          renderProcessed(context, snake.meta.processed, snake.colors.processed)
        }

        if (showAIPathToTarget) {
          renderPath(context, snake.meta.path, snake.colors.head)
        }
      } else {
        renderSnake({ context, snake })
      }
    })

    gridData.applyStyles()
    context.stroke(gridData.grid)
  }

  createTick({
    $state,
    runLogic,
    runRender,
  }).nextTickFx()
}

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

main(canvas, context)
