/* eslint-disable unicorn/prevent-abbreviations */
import { combine } from 'effector'
import {
  getLocalSize,
  getGlobalSize,
  getIndexByPosition,
  randomPosition,
  setValuesToGraph,
} from './utils'
import { buildGrid, renderPath, renderProcessed, renderSnake } from './renderer'
import { pageHeight, pageWidth, PLACE_TYPE } from './config'
import { canvasInput } from './controll'
import { convigureCanvas } from './canvas'
import {
  setDirection,
  updateBody,
  addPeaceOfSnake,
  setScore,
  setCrash,
  setMeta,
  buildSettingsForSnake,
} from './models/snake'
import { Graph } from './algorithms'
import { renderGUI } from './GUI'
import { $snakes, $settingsForSnakes } from './models/snakes'
import { $graph } from './models/graph'
import { $foods } from './models/objects'
import { createTick } from './models/tick'
import {
  $isLoggerEnabled,
  $indexesVisible,
  updateStates,
  $isEnabledCollisionDetect,
} from './models/game'
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
  isEnabledCollisionDetect: $isEnabledCollisionDetect,
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
      setValuesToGraph(graph, [
        ...foods
          .map(([position, id]) => {
            const index = getIndexByPosition(position)
            const vertex = graph.getVertex(index)

            if (vertex.value.type === PLACE_TYPE.EMPTY) {
              return {
                type: PLACE_TYPE.FOOD,
                value: id,
                index,
              }
            }

            return undefined
          })
          .filter(Boolean),
      ])
    }

    function handleEatFood({ snake, nextPosition, foodId }) {
      const nextSnake = addPeaceOfSnake(
        setScore(snake, snake.score + 1),
        nextPosition
      )

      foods = foods.map((food) => {
        if (foodId === food[1]) {
          return [randomPosition(), food[1]]
        }

        return food
      })

      return nextSnake
    }

    function reCreateSnakeInGraph(prevSnake, nextSnake) {
      setValuesToGraph(graph, [
        ...prevSnake.body.map((position) => {
          return {
            type: PLACE_TYPE.EMPTY,
            index: getIndexByPosition(position),
          }
        }),
        ...nextSnake.body.map((position) => {
          return {
            type: PLACE_TYPE.GAME_OBJECT,
            index: getIndexByPosition(position),
            value: nextSnake.id,
          }
        }),
      ])
    }

    markFoodOnGraph()

    nextState.computedSnakes
      .filter(({ snake }) => !snake.isCrash)
      .forEach(({ snake, algorithm }) => {
        const { nextDirection, nextPosition, meta } = snake.updater({
          withLogger: nextState.isLoggerEnabled,
          isEnabledCollisionDetect: nextState.isEnabledCollisionDetect,
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

        switch (nextVertex?.value?.type) {
          case PLACE_TYPE.FOOD: {
            nextSnake = handleEatFood({
              snake: nextSnake,
              nextPosition,
              foodId: nextVertex.value.foodId,
            })
            break
          }

          case PLACE_TYPE.GAME_OBJECT: {
            if (nextState.isEnabledCollisionDetect) {
              nextSnake = setCrash(nextSnake, true)

              break
            }
          }

          // eslint-disable-next-line no-fallthrough
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
    const { computedSnakes, foods, indexesVisible } = nextState

    clearGame()

    renderFoods(context, foods)

    computedSnakes.forEach(({ snake, settings }) => {
      if (snake.isAi) {
        const { showAIPathToTarget, showProcessedCells } = settings

        renderSnake({ context, snake, indexesVisible })

        if (showProcessedCells) {
          renderProcessed(context, snake.meta.processed, snake.colors.processed)
        }

        if (showAIPathToTarget) {
          renderPath(context, snake.meta.path, snake.colors.head)
        }
      } else {
        renderSnake({ context, snake, indexesVisible })
      }
    })

    gridData.applyStyles()
    context.stroke(gridData.grid)
  }

  createTick({
    $state,
    runLogic,
    runRender,
  }).start()
}

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

main(canvas, context)
