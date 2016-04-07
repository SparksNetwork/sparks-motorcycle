import {just, map} from 'most'
import {ListItem} from './ListItem'

import {clickEvent} from 'util'

export function ListItemClickable(sources) {
  const classes$ = map(
    c => ({...c, clickable: true}),
    sources.classes$ || just({})
  )
  const click$ = sources.DOM.select('.list-item').events(clickEvent)
  const DOM = ListItem({...sources, classes$}).DOM
  return {DOM, click$}
}
