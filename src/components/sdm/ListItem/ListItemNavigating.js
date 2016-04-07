import {just, map} from 'most'

import {ListItemClickable} from './ListItemClickable'

export function ListItemNavigating(sources) {
  const item = ListItemClickable(sources)
  const route$ = map(() => sources.path$ || just('/'), item.click$).switch()
  return {DOM: item.DOM, route$}
}
