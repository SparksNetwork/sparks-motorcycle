import hold from '@most/hold'
import {div} from '@motorcycle/dom'

import {mergeOrLatest} from 'util/most'
import {controlsFromRows} from 'util'

const List = sources => {
  const controls$ = hold(sources.rows$
    .map(rows =>
        sources.Control$.map(Control => controlsFromRows(sources, rows, Control)
    )
  ).switch())

  const children$ = controls$
    .map(controls => controls.map(c => c.DOM))

  const DOM = children$.map(children => div({}, children))

  const route$ = controls$
    .map(children => mergeOrLatest('route$', children))
    .switch()

  const queue$ = controls$
    .map(children => mergeOrLatest('queue$', children))
    .switch()

  const edit$ = controls$
    .map(children => mergeOrLatest('edit$', children))
    .switch()

  return {DOM, queue$, route$, edit$}
}

const ListWithHeader = sources => {
  const list = List(sources)

  const DOM = sources.rows$.combine(
    (rows, ...doms) => div({}, rows.length > 0 ? doms : []),
    sources.headerDOM,
    list.DOM,
  )

  return {
    DOM,
    route$: list.route$,
    queue$: list.queue$,
  }
}

export {
  List,
  ListWithHeader,
}
