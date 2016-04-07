import {map, combineArray} from 'most'
import {div} from '@motorcycle/dom'

import {Menu} from 'components/sdm'
import {ListItemClickable} from './ListItemClickable'

const view = (...children) => div({}, children)

export function ListItemWithMenu(sources) {
  const item = ListItemClickable(sources)
  const isOpen$ = map(() => true, item.click$).startWith(false)
  const menu = Menu({...sources, isOpen$})

  const DOM = combineArray(view, [item.DOM, menu.DOM])
  return {DOM}
}
