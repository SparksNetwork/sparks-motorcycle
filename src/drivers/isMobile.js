import {create} from 'most'
import hold from '@most/hold'
import {events} from 'snabbdom-material'

const isMobile$ = () => {
  let screenInfo$ =
    create(next => events.responsive.addListener(next))
      .map(si => si.size <= 2)

  return hold(screenInfo$)
}

export {isMobile$}
