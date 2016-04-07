import {
  combineArray,
  just,
  merge,
  never,
  map,
  multicast,
  sampleWith} from 'most'
import {div} from '@motorcycle/dom'

import {
  TextAreaControl,
  OkAndCancel} from 'components/sdm'
import {ListItemCollapsible} from './ListItemCollapsible'

const mapFalse = stream => map(() => false, stream)

export function ListItemCollapsibleTextArea(sources) {
  const ta = TextAreaControl(sources)
  const oac = OkAndCancel(sources)

  const content$ =
    combineArray((...children) => div({}, children), [ta.DOM, oac.DOM])

  const subtitle$ =
    combineArray((value, subtitle) => value ? value : subtitle, [
      sources.value$,
      sources.subtitle$ || just(null),
    ])

  const isOpen$ = multicast(merge(
    sources.isOpen$ || never(),
    mapFalse(ta.enter$),
    mapFalse(oac.ok$),
    mapFalse(oac.cancel$)
  ))

  const li = ListItemCollapsible({...sources, content$, subtitle$, isOpen$})

  const value$ = merge(
    sampleWith(oac.ok$, ta.value$),
    sampleWith(ta.enter$, ta.value$)
  )

  return {
    DOM: li.DOM,
    ok$: oac.ok$,
    value$,
  }
}
