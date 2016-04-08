import {merge, combine} from 'most'
import {div} from '@motorcycle/dom'

import {ListItemClickable} from './ListItemClickable'
import {isolate} from 'util'

const toOpposite = (a, b) => b === -1 ? !a : b

const view = (isOpen, content, listItem) => {
  return div({}, [
    listItem,
    isOpen ? div('.collapsible', [content]) : null,
  ])
}

export function ListItemCollapsible(sources) {
  const li = isolate(ListItemClickable)(sources)
  const isOpen$ = merge(
    li.click$.map(() => -1),
    sources.isOpen$,
  ).scan(toOpposite, true)

  isOpen$.observe(console.log.bind(console))

  const DOM = combine(view,
    isOpen$,
    sources.content$,
    li.DOM
  )

  return {DOM}
}
