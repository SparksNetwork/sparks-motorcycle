import './styles.scss'

import {div, h} from '@motorcycle/dom'

import {clickEvent, material} from 'util'
import {pluck, withLatestFrom} from 'util/most'

const tabs = (props,children) =>
  children && div({class: {'tab-wrap': true}, style: {
    // 'background-color': material.primaryColor,
  }},
    children.reduce((a,b) => a.concat(b))
      .concat([div({class: {slide: true}},'')])
  )

const tab = ({id, link}, children) => [
  h('input', {attrs: {type: 'radio', name: 'tabs', id}}),
  div({class: {'tab-label-content': true}, attrs: {'data-link': link}},[
    h('label',{attrs: {for: id}, style: {
      color: material.primaryFontColor},
    }, children),
  ]),
]

const view = createHref => (_tabs, currentRoute) =>
  tabs({currentRoute}, _tabs.map(({path, label}) =>
    tab({id: label, link: createHref(path)}, label)
  ))

export function TabBar(sources) {
  const {router: {createHref}} = sources
  const route$ = sources.DOM.select('.tab-label-content').events(clickEvent)
    .map(e => e.ownerTarget.dataset.link)
    .skipRepeats()

  const currentRoute$ = pluck('pathname', sources.router.observable)

  const DOM = withLatestFrom(view(createHref), sources.tabs$, currentRoute$)

  return {DOM, route$}
}
