import { combine } from 'effector'
import {
  getLocalSize,
  getGlobalSize,
  getPositionByIndex,
  getIndexByPosition,
  setValuesToGraph,
  randomPosition,
} from './utils'
import {
  buildGrid,
  renderPath,
  renderProcessed,
  renderSnake,
  drawSquare,
  loadAssets,
} from './renderer'
import { pageHeight, pageWidth, PLACE_TYPE, colorScheme } from './config'
import { canvasInput } from './controll'
import { configureCanvas } from './canvas'
import { Graph } from './algorithms'
import { renderGUI } from './GUI'
import { $snakes, $settingsForSnakes } from './models/snakes'
import { $graph, addBrickToGraph } from './models/graph'
import { $foods, $bricks } from './models/objects'
import { createTick } from './models/tick'
import {
  $isLoggerEnabled,
  $indexesVisible,
  updateStates,
  $isEnabledCollisionDetect,
  $needFillEmptyGraphsCells,
} from './models/game'
import { renderFoods } from './renderer/foods'
import { renderBricks } from './renderer/bricks'
import {
  $trimmedEditorCode,
  $customCodeIsEnabled,
} from './models/custom-alghorithm'
import 'reset-css'
import { World } from './world'
import {
  addPeaceOfSnake,
  headSnake,
  setCrash,
  setDirection,
  setMeta,
  setScore,
  Snake,
  tailSnake,
  updateBody,
} from './models/snake'
import { updaters } from './updaters'
import { algorithms, heuristics } from './models/algorithms'

const $state = combine({
  isLoggerEnabled: $isLoggerEnabled,
  indexesVisible: $indexesVisible,
  graph: $graph,
  foods: $foods,
  bricks: $bricks,
  isEnabledCollisionDetect: $isEnabledCollisionDetect,
  needFillEmptyGraphsCells: $needFillEmptyGraphsCells,
  trimmedEditorCode: $trimmedEditorCode,
  customCodeIsEnabled: $customCodeIsEnabled,
  settingsForSnakes: $settingsForSnakes,
  snakes: $snakes,
})

function main(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
): void {
  renderGUI()

  canvasInput.registerClickEventToCanvas(canvas)

  canvasInput.addMouseMoveEvent((index) => {
    addBrickToGraph(getPositionByIndex(index))
  })

  canvasInput.callEventRegisters()

  const gridData = buildGrid(context)
  const localSize = getLocalSize(pageWidth, pageHeight)
  const globalSize = getGlobalSize(localSize.w, localSize.h)

  configureCanvas(canvas, globalSize)

  function clearGame(): void {
    context.clearRect(0, 0, globalSize.w, globalSize.h)
  }

  function runLogic({ state: nextState }: { state: World; tick: number }) {
    const nextSnakes: Snake[] = []
    const graph = Graph.extend(nextState.graph)

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

      nextState.foods = nextState.foods.map((food) => {
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

    nextState.snakes
      .filter((snake) => !snake.isCrash)
      .forEach((snake) => {
        const currentAlg = algorithms.find(
          (alg) =>
            alg.id === nextState.settingsForSnakes[snake.id].activeAlgorithm
        )
        const heuristic = heuristics.find(
          (it) =>
            it.id === nextState.settingsForSnakes[snake.id].activeHeuristic
        )

        if (!currentAlg) {
          return
        }

        const { nextDirection, nextPosition, meta } =
          snake.type === 'AI'
            ? updaters.ai({
                withLogger: nextState.isLoggerEnabled,
                isEnabledCollisionDetect: nextState.isEnabledCollisionDetect,
                snake,
                traverseAlgorithm: currentAlg.alg,
                heuristic: heuristic?.alg,
                state: {
                  graph,
                  foods: nextState.foods,
                },
              })
            : updaters.user({
                snake,
              })

        let nextSnake = snake

        const nextIndex = getIndexByPosition(nextPosition)
        const nextVertex = graph.getVertex(nextIndex)
        console.log(meta)
        if (meta && snake.type === 'AI') {
          nextSnake = setMeta(snake, meta)
        }

        switch (nextVertex?.value?.type) {
          case PLACE_TYPE.FOOD: {
            nextSnake = handleEatFood({
              snake: nextSnake,
              nextPosition,
              foodId: nextVertex?.value?.foodId,
            })
            break
          }

          case PLACE_TYPE.GAME_OBJECT:
          case PLACE_TYPE.BRICK: {
            if (nextState.isEnabledCollisionDetect) {
              nextSnake = setCrash(nextSnake, true)
            }

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

    updateStates({ snakes: nextSnakes, foods: nextState.foods })
  }

  function runRender({
    state: nextState,
  }: {
    state: World
    tick: number
  }): void {
    const {
      snakes,
      foods,
      indexesVisible,
      graph,
      needFillEmptyGraphsCells,
      bricks,
      settingsForSnakes,
    } = nextState

    function fillEmptyCell(): void {
      Graph.extend(graph)
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

    snakes.forEach((snake) => {
      if (snake.type === 'AI') {
        const { showAIPathToTarget, showProcessedCells } =
          settingsForSnakes[snake.id]

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

    if (needFillEmptyGraphsCells) {
      fillEmptyCell()
    }

    gridData.applyStyles()
    context.stroke(gridData.grid)
  }

  createTick({
    $state,
    runLogic,
    runRender,
  }).start()
}

export function initialize() {
  const canvas = document.querySelector('canvas')

  if (canvas) {
    const context = canvas.getContext('2d')

    loadAssets().then(() => {
      // @ts-ignore
      main(canvas, context)
    })
  }
}
