import {combineArray, merge, sampleWith} from 'most'
import {div} from '@motorcycle/dom'

import {TextAreaControl, OkAndCancel} from 'components/sdm'
import {ListItem} from './ListItem'

const view = (...children) => div({}, children)

export function ListItemTextArea(sources) {
  const ta = TextAreaControl(sources)
  const oac = OkAndCancel(sources)

  const title$ = combineArray(view, [ta.dom, oac.DOM])

  const li = ListItem({...sources, title$})

  const value$ = merge(
    sampleWith(oac.ok$, ta.value$),
    sampleWith(ta.enter$, ta.value$)
  )

  return {DOM: li.DOM, value$}
}
