import {
  combineArray,
  just,
  merge,
  empty,
  map,
  sampleWith} from 'most'
import {div} from '@motorcycle/dom'

import {
  TextAreaControl,
  OkAndCancel} from 'components/sdm'
import {ListItemCollapsible} from './ListItemCollapsible'

import {isolate} from 'util'

const mapFalse = stream => map(() => false, stream)

export function ListItemCollapsibleTextArea(sources) {
  const ta = isolate(TextAreaControl)(sources)
  const oac = isolate(OkAndCancel)(sources)

  const content$ =
    combineArray((textarea, buttons) => div({}, [
      div({}, [textarea]),
      div({}, [buttons]),
    ]), [ta.DOM, oac.DOM])
    .multicast()

  const subtitle$ =
    combineArray((value, subtitle) => value ? value : subtitle, [
      sources.value$ || just('No value$'),
      sources.subtitle$ || just(null),
    ])

  const isOpen$ = merge(
    sources.isOpen$ || empty(),
    mapFalse(ta.enter$),
    mapFalse(oac.ok$),
    mapFalse(oac.cancel$),
  ).multicast().startWith(false)

  const li =
    isolate(ListItemCollapsible)({...sources, content$, subtitle$, isOpen$})

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
