import { updateStates, restart } from '../game'
import { $graph } from './store'

$graph.on(updateStates, (_, { graph }) => graph).reset(restart)
