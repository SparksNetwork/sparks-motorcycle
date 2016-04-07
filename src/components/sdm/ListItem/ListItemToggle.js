import {map} from 'most'

import {ToggleControl} from 'components/sdm'
import {ListItemClickable} from './ListItemClickable'

const getTitle = sources => v =>
  v ? sources.titleTrue$ : sources.titleFalse$

export function ListItemToggle(sources) {
  const toggle = ToggleControl(sources)
  const title$ = map(getTitle(sources), sources.values$).switch()
  const item = ListItemClickable({...sources, title$, leftView$: toggle.DOM})

  const value$ = sources.value$
    .sample(item.click$)
    .map(x => !x)

  return {DOM: item.DOM, value$}
}
