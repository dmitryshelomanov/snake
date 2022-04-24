/* eslint-disable unicorn/prevent-abbreviations */
import { combine } from 'effector'
import {
  getLocalSize,
  getGlobalSize,
  getIndexByPosition,
  randomPosition,
  setValuesToGraph,
  getPositionByIndex,
} from './utils'
import {
  buildGrid,
  renderPath,
  renderProcessed,
  renderSnake,
  drawSquare,
} from './renderer'
import { pageHeight, pageWidth, PLACE_TYPE, colorScheme } from './config'
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
  tailSnake,
  headSnake,
  Snake,
  SnakeSettings,
} from './models/snake'
import { Graph, Vertex } from './algorithms'
import { renderGUI } from './GUI'
import { $snakes, $settingsForSnakes } from './models/snakes'
import { $graph, adddBrickToGraph } from './models/graph'
import { $foods, $bricks } from './models/objects'
import { createTick } from './models/tick'
import {
  $isLoggerEnabled,
  $indexesVisible,
  updateStates,
  $isEnabledCollisionDetect,
  $needFillEmptyGraphsCellls,
} from './models/game'
import { renderFoods } from './renderer/foods'
import { renderBricks } from './renderer/bricks'
import { $algorithms, $heuristics } from './models/algorithms'
import {
  $trimmedEditorCode,
  $customCodeIsEnabled,
} from './models/custom-alghorithm'
import 'reset-css'

const defaultSettings = buildSettingsForSnake()

const utilsForEditor = {
  getIndexByPosition,
  getPositionByIndex,
}

type ComputedSnake = {
  snake: Snake
  settings: { [key: string]: SnakeSettings }
  algorithm: {
    traverseAlgorithm: TraverseAlgorithmFunction<Graph, Vertex> | void
    heuristic: HeuristicFunction | void
  }
}

type State = {
  isLoggerEnabled: boolean
  indexesVisible: boolean
  graph: Graph
  foods: Array<Food>
  computedSnakes: Array<ComputedSnake>
  isEnabledCollisionDetect: boolean
  needFillEmptyGraphsCellls: boolean
  bricks: Array<Coords>
  trimmedEditorCode: string
  customCodeIsEnabled: boolean
}

function buildOwnAlgorithm(code: string) {
  return {
    traverseAlgorithm: (
      params: TraverseAlgorithmProps<Graph, Vertex>
    ): TraverseAlgorithmResult => {
      try {
        const fn = new Function('params', 'utils', code)

        return fn(params, utilsForEditor)
      } catch (error) {
        console.warn('custom algorithm was failed')
        console.warn(error)
        console.warn(code)

        return {
          path: [],
          processed: [],
        }
      }
    },
  }
}

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
            traverseAlgorithm: traverseAlgorithm && traverseAlgorithm.alg,
            heuristic: heuristic && heuristic.alg,
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
  bricks: $bricks,
  computedSnakes: $computedSnakes,
  isEnabledCollisionDetect: $isEnabledCollisionDetect,
  needFillEmptyGraphsCellls: $needFillEmptyGraphsCellls,
  trimmedEditorCode: $trimmedEditorCode,
  customCodeIsEnabled: $customCodeIsEnabled,
})

function main(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
): void {
  renderGUI()

  canvasInput.registerClickEventToCanvas(canvas)

  canvasInput.addMouseMoveEvent((index) => {
    adddBrickToGraph(getPositionByIndex(index))
  })

  canvasInput.callEventRegistars()

  const gridData = buildGrid(context)
  const localSize = getLocalSize(pageWidth, pageHeight)
  const globalSize = getGlobalSize(localSize.w, localSize.h)

  convigureCanvas(canvas, globalSize)

  function clearGame(): void {
    context.clearRect(0, 0, globalSize.w, globalSize.h)
  }

  function runLogic({
    state: nextState,
  }: {
    state: State
    tick: number
  }): void {
    const nextSnakes: Array<Snake> = []
    const graph = Graph.extend(nextState.graph)

    let { foods } = nextState

    function handleEatFood({
      snake,
      nextPosition,
      foodId,
    }: {
      snake: Snake
      nextPosition: Coords
      foodId: string
    }): Snake {
      const nextSnake = addPeaceOfSnake(
        setScore(snake, snake.score + 1),
        nextPosition
      )

      const position = randomPosition()

      setValuesToGraph(graph, [
        {
          type: PLACE_TYPE.FOOD,
          index: getIndexByPosition(position),
          value: foodId,
        },
      ])

      foods = foods.map((food) => {
        if (foodId === food[1]) {
          return [position, foodId]
        }

        return food
      })

      return nextSnake
    }

    function reCreateSnakeInGraph(prevSnake: Snake, nextSnake: Snake): void {
      const tail = tailSnake(prevSnake)
      const head = headSnake(nextSnake)

      setValuesToGraph(graph, [
        {
          type: PLACE_TYPE.EMPTY,
          index: getIndexByPosition(tail),
          value: '',
        },
        {
          type: PLACE_TYPE.GAME_OBJECT,
          index: getIndexByPosition(head),
          value: nextSnake.id,
        },
      ])
    }

    const { customCodeIsEnabled, trimmedEditorCode } = nextState

    const customAlgorithm = buildOwnAlgorithm(trimmedEditorCode)

    nextState.computedSnakes
      .filter(({ snake }) => !snake.isCrash)
      .forEach(({ snake, algorithm }) => {
        const preparedAlgh = customCodeIsEnabled ? customAlgorithm : algorithm
        // @ts-ignore
        const { nextDirection, nextPosition, meta } = snake.updater({
          withLogger: nextState.isLoggerEnabled,
          isEnabledCollisionDetect: nextState.isEnabledCollisionDetect,
          snake,
          ...preparedAlgh,
          state: {
            ...nextState,
            graph,
            foods,
          },
        })

        let nextSnake = snake

        const nextIndex = getIndexByPosition(nextPosition)
        const nextVertex = graph.getVertex(nextIndex)
        const type = nextVertex && nextVertex.value.type

        if (meta && snake.isAi) {
          nextSnake = setMeta(snake, meta)
        }

        switch (type) {
          case PLACE_TYPE.FOOD: {
            nextSnake = handleEatFood({
              snake: nextSnake,
              nextPosition,
              // @ts-ignore
              foodId: nextVertex.value.foodId,
            })
            break
          }

          case PLACE_TYPE.GAME_OBJECT:
          case PLACE_TYPE.BRICK: {
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

    updateStates({ snakes: nextSnakes, foods })
  }

  function runRender({
    state: nextState,
  }: {
    state: State
    tick: number
  }): void {
    const {
      computedSnakes,
      foods,
      indexesVisible,
      graph,
      needFillEmptyGraphsCellls,
      bricks,
    } = nextState

    function fillEmptyCell(): void {
      graph
        .getVertexes()
        .filter((v) => v.value.type === PLACE_TYPE.EMPTY)
        .forEach((v) => {
          drawSquare({
            context,
            position: getPositionByIndex(v.index),
            color: colorScheme.emptyCells,
          })
        })
    }

    clearGame()

    renderFoods({ context, foods, indexesVisible })

    computedSnakes.forEach(({ snake, settings }) => {
      if (snake.isAi) {
        const { showAIPathToTarget, showProcessedCells } = settings

        renderSnake({ context, snake, indexesVisible })

        if (showProcessedCells) {
          renderProcessed({
            context,
            processed: snake.meta ? snake.meta.processed : [],
            color: snake.colors.processed,
          })
        }

        if (showAIPathToTarget) {
          renderPath({
            context,
            path: snake.meta ? snake.meta.path : [],
            color: snake.colors.head,
          })
        }
      } else {
        renderSnake({ context, snake, indexesVisible })
      }
    })

    renderBricks({ context, bricks, indexesVisible })

    if (needFillEmptyGraphsCellls) {
      fillEmptyCell()
    }

    gridData.applyStyles()
    context.stroke(gridData.grid)
  }

  createTick({
    // @ts-ignore
    $state,
    runLogic,
    runRender,
  }).start()
}

const canvas = document.querySelector('canvas')

if (canvas) {
  const context = canvas.getContext('2d')

  // @ts-ignore
  main(canvas, context)
}
