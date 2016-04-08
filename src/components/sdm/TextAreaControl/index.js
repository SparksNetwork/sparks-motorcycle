import './styles.scss'

import {map, merge, just, combineArray} from 'most'
import {div, textarea, h6} from '@motorcycle/dom'

import {pluck} from 'util/most'

const view = (value, maxLength, length, height) =>
  div('.text-area-container', {}, [
    textarea('#textarea', {
      props: {maxLength},
      class: {input: true},
      style: {height},
      key: 1,
    }, [
      value,
    ]),
    h6('.text-area-label', {
      style: {marginTop: `calc(${height} - 1.8em)`},
    }, [
      `${length}/${maxLength}`,
    ]),
  ])

export function TextAreaControl(sources) {
  const input = sources.DOM.select('#textarea')

  const height$ = input.observable
    .map(elements => elements[0])
    .map(elm => elm ? elm.scrollHeight + 'px' : 'auto')
    .skipRepeats()
    .startWith('auto')

  const value$ = merge(input.events('input'), input.events('change'))
    .map(pluck('ownerTarget', 'value'))
    .map(x => typeof x === 'string' ? x : '')
    .multicast()

  const enter$ = sources.DOM.select(':root').events('keypress')
    .filter(e => e.keyCode === 13)
    .tap(e => e.preventDefault())
    .multicast()

  const toLength = (x) => x && x.length || 0
  const length$ =
    map(toLength, value$).startWith(0)

  const DOM = combineArray(
    view, [
      sources.value$ || just(''),
      sources.maxLength || just(160),
      length$,
      height$,
    ]
  )

  return {DOM, value$, enter$}
}
