import {merge, map, scan} from 'most'
import {div} from '@motorcycle/dom'
import isolate from '@cycle/isolate'

import {ListItemClickable} from './ListItemClickable'
import {combineObj} from 'util/most'

const toTrue = () => true
const toOpposite = (a, b) => !a ? b : !a

const view = ({isOpen, listItem, content}) =>
  div({}, [
    listItem,
    isOpen ? div('.collapsible', {}, [content]) : null,
  ])

export function ListItemCollapsible(sources) {
  const li = isolate(ListItemClickable)(sources)

  const isOpen$ = merge(
    sources.isOpen$,
    scan(toOpposite, map(toTrue, li.click$))
  )

  const view$ = combineObj({
    isOpen$,
    listItem: li.DOM,
    content: sources.content$,
  })

  const DOM = map(view, view$)

  return {DOM}
}
