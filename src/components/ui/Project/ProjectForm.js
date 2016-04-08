// TODO: use Form() and Modal() and all that good stuff
import {merge, empty} from 'most'
import {div} from '@motorcycle/dom'
import {Form, Input, Button} from 'snabbdom-material'

import combineObj from 'util/most'

const view = ({name}) =>
  Form({className: 'project'}, [
    Input({
      className: 'name',
      label: 'New Project Name',
      value: name,
    }),
    // need onClick: true or snabbdom-material renders as disabled :/
    name ? div({}, [
      Button({className: 'submit', onClick: true, primary: true},['Create']),
      Button(
        {className: 'cancel', onClick: true, secondary: true, flat: true},
        ['Cancel']
      ),
    ]) : null,
  ])

export const ProjectForm = sources => {
  const submitClick$ = sources.DOM.select('.submit').events('click')

  const submitForm$ = sources.DOM.select('.project').events('submit')
    .tap(ev => ev.preventDefault())

  const cancelClick$ = sources.DOM.select('.cancel').events('click')

  const submit$ = merge(submitClick$, submitForm$)

  const name$ = sources.DOM.select('.name').events('input')
    .map(e => e.ownerTarget.value)
    .startWith('')

  const clearFormData$ = cancelClick$
    .map(() => ({}))

  const formData$ = combineObj({name$})

  const editProject$ = (sources.project$ || empty())
    .merge(formData$)
    .merge(clearFormData$)
    .skipRepeats()

  const project$ = editProject$
    .sampleWith(submit$)
    .filter(p => p !== {})

  const DOM = editProject$.startWith({}).map(view)

  return {DOM, project$}
}
