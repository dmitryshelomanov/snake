declare type HeuristicProps = { p1: Coords; p: Coords }
declare type HeuristicResult = number

declare type HeuristicFunction = (arg0: HeuristicProps) => number

declare type TraverseAlgorithmProps<G, V> = {
  startIndex: number
  endIndex: number
  graph: G
  canTraverse: (arg0: V) => boolean
  getCostByIndex: (arg0: V) => number
  withLogger: boolean
  heuristic?: HeuristicFunction
}

declare type TraverseAlgorithmResult = {
  path: Array<number>
  processed: Array<number>
}

declare type TraverseAlgorithmFunction<G, V> = (
  arg0: TraverseAlgorithmProps<G, V>
) => TraverseAlgorithmResult
