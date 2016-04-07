import {map, multicast, empty} from 'most'
import {pluck} from 'util/most'

export function AuthedResponseManager({auth$, queue$}) {
  const response$ = multicast(
    map(auth => auth ? pluck('val', queue$(auth.uid)) : empty(), auth$).switch()
  )
  return {response$}
}
