import {just, map} from 'most'
import {ListItem} from './ListItem'

import {isolate} from 'util'

export function ListItemClickable(sources) {
  const classes$ = map(
    c => ({...c, clickable: true}),
    sources.classes$ || just({})
  )
  const click$ = sources.DOM.select('.list-item').events('click')
  const DOM = isolate(ListItem, 'clickable')({...sources, classes$}).DOM
  return {DOM, click$}
}
