import {map, multicast, empty} from 'most'
import {pluck} from 'util/most'

export function AuthedResponseManager({auth$, queue$}) {
  const response$ = multicast(
    map(auth => auth ? queue$(auth.uid).map(pluck('val')) : empty(), auth$)
      .switch()
  )
  return {response$}
}
