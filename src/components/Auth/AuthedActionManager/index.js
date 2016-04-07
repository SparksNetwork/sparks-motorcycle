import {withLatestFrom} from 'util/most'

export function AuthedActionManager(sources) {
  const queue$ = withLatestFrom(
    (action, auth) => ({uid: auth && auth.uid, ...action}),
    sources.queue$, sources.auth$
  )
  return {queue$}
}
