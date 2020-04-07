import { createStore } from 'effector'
import { Graph } from '../../algorithms'
import { getLocalSize } from '../../utils'
import { pageWidth, pageHeight } from '../../config'

const localSize = getLocalSize(pageWidth, pageHeight)

export const $graph = createStore(new Graph(localSize))
