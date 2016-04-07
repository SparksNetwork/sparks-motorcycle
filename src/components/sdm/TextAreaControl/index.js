import './styles.scss'

import {map, merge, just} from 'most'
import {div, textarea, h6} from '@motorcycle/dom'

import {pluck, combineObj} from 'util/most'

const view = ({value, maxLength, length, height}) =>
  div('.text-area-container', {}, [
    textarea('#textarea', {
      props: {maxLength},
      class: {input: true},
      style: {height},
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

  const value$ =
    pluck('ownerTarget', 'value', input.events('input')).multicast()

  const enter$ = input.events('keydown')
    .filter(e => e.keyCode === 13)
    .tap(e => e.preventDefault())
    .multicast()

  const toLength = (x) => x && x.length || 0
  const length$ =
    map(toLength, merge(value$, sources.value$ || just(''))).startWith(0)

  const view$ = combineObj({
    value$: sources.value$ || just(''),
    maxLength$: sources.maxLength || just(160),
    length$,
    height$,
  })

  const DOM = map(view, view$)

  return {DOM, value$, enter$}
}
