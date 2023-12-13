import { createOperationLogger } from '../utils'
import { restorePathFromMap } from './restore-path'
import { Vertex, Graph } from './graph'

/*
  Note:

  Поиск происходит равномерно во всех направлениях, алгоритм  не знает как ускорится
    он просто перебирает по уровням (если искомая точка существует, он 100% найдет крратчайший путь к нее)
    разумеется кратчайший по веершинам (!)

  Пример гррафа (для простоты понимания это будет привычный граф - не одномерный массив)
    найти кратчайший путь из A в G
    если посмоттреть на граф, то видно что кратчайший путь это A-E-F-G -через 2 вершины

  A~~~~B~~~~C
  ~ ~       ~
  ~   ~     ~
  D~~~~E~~~~F~~~~G

  Как работает алгоритм
    Дано
      queue: очередь
      procesed: мапа с верршинами которые прошли
      isTraverse: флаг говорящий что мы нашли то что искали (простая оптимизация)
      parent: мапа хранит то, из какой точки пришли (понадобится для восстановления пути)

    задаем точку старта и искомую (A,G)
      алгоритм исполтзует простую очередь и добавляет в нее соседей
      помещаем точку А в очередь
      queue: [A]

    Старт происходит если очередь не пуста
      забираем вершину и начинаем работать над ней (для всех верщин процедура одинакова) 
      ищем соседей и добавляем в очередь, так же помечаем вершину как пройденную
      queue: []
      processed: [A]

      проход по соседям
        3 соседа на данномм этапе,  соответственно 3 этапа
          1) queue: [B]
             parent: {B: A}
             processed: [A, B]
          2) queue: [B, E]
             parent: {B: A, E: A}
             processed: [A, B, E]
          3) queue: [B, E, D]
             parent: {B: A, E: A, D: A}
             processed: [A, B, E, D]

          Из соседей у вершины А нету искомой точки - работа происходит дальше
          На очереди точка B - ее соседи это А и C
          проходить по ним в том же алгоритме
            1) A - помечена как пройдена. Пропускаем
            3) queue: [E, D, C]
               parent: {B: A, E: A, D: A, C: B}
               processed: [A, B, E, D, C]

          Из соседей у вершины B нету искомой точки - работа происходит дальше
          На очереди точка E - ее соседи это D,A,F
          проходить по ним в том же алгоритме
            1) D - помечена как пройдена. Пропускаем
            2) A - помечена как пройдена. Пропускаем
            3) queue: [D, C, F]
               parent: {B: A, E: A, D: A, C: B, F: E}
               processed: [A, B, E, D, C, F]

          Из соседей у вершины E нету искомой точки - работа происходит дальше
          На очереди точка D - ее соседи это A,E
          проходить по ним в том же алгоритме
            1) A - помечена как пройдена. Пропускаем
            2) E - помечена как пройдена. Пропускаем
                queue: [C, F]

          Из соседей у вершины D нету искомой точки - работа происходит дальше
          Все соседи у данной вершины помечены как пройденные
          На очереди точка C - ее соседи это B,F
          проходить по ним в том же алгоритме
            1) B - помечена как пройдена. Пропускаем
            2) F - помечена как пройдена. Пропускаем
                queue: [F]

          Из соседей у вершины C нету искомой точки - работа происходит дальше
          Все соседи у данной вершины помечены как пройденные
          На очереди точка F - ее соседи это E,C,G
          проходить по ним в том же алгоритме
            1) E - помечена как пройдена. Пропускаем
            2) C - помечена как пройдена. Пропускаем
            3) F - найденная вершина
                queue: [G]
                parent: {B: A, E: A, D: A, C: B, F: E, G: F}
                processed: [A, B, E, D, C, F, G]
                isTraverse: true

    Теперь все вершины пройдены и мы можем восстановить путь по parent (как я писал выше, для чего эта переменная)
      найденный путь - (G-F-E-A).reverse()
      цепочка восстанавливается от искомой точки, путь как пройти от искомой к начальной

    Вывод:
        Данный алгоритм полезен если нужно найти кратчайшее расстояние по вершинам
      но если появится вес у ребра (к примеру учивать дистанцию),  данный алгоритм не поможет
      для этого существует алгоритм Дейкстры (./dijkstra.js) - который тоже тут рассмотрет и можно 
      увидеть визуализацию
        Так же есть варианты этого алгоритма, но которые учитывают эвристику,
      за счет которой могут отсеять не нужные направления (./greedy.js, ./a-star.js)
*/

export function breadthFirstSearch({
  startIndex,
  endIndex,
  graph,
  canTraverse,
  withLogger = false,
}: TraverseAlgorithmProps<Graph, Vertex>): TraverseAlgorithmResult {
  const queue = [startIndex]
  const processed = new Map([[startIndex, true]])
  const parent = new Map()

  let path: Array<number> = []
  let isTraverse = false

  const logger = createOperationLogger('breadthFirstSearch')

  while (!isTraverse && queue.length > 0) {
    const currentIndex = queue.shift()
    const vertex = graph.getVertex(currentIndex)

    for (let i = 0; vertex && i < vertex.neigbors.length; i++) {
      const nextIndex = vertex.neigbors[i]
      const nextVertex = graph.getVertex(nextIndex)

      if (nextVertex && canTraverse(nextVertex) && !processed.has(nextIndex)) {
        queue.push(nextIndex)
        processed.set(nextIndex, true)
        parent.set(nextIndex, currentIndex)

        if (endIndex === nextIndex) {
          isTraverse = true
          break
        }

        logger.increment()
      }
    }
  }

  if (isTraverse) {
    path = restorePathFromMap({ end: endIndex, start: startIndex, parent })
  }

  if (withLogger) {
    logger.log()
  }

  return {
    path,
    processed: [...processed.keys()],
  }
}
