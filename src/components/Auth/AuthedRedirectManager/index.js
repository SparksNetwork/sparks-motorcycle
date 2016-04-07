import {filter, map} from 'most'
import {withLatestFrom} from 'util/most'

const filterBoolean = stream => filter(x => !!x, stream)
const filterOpposite = stream => filter(x => !x, stream)

function createRedirectLogin$({userProfile$}) {
  return map(
    profile => profile.isAdmin ? '/admin' : '/dash',
    filterBoolean(userProfile$)
  )
}

function createRedirectUnconfirmed$({userProfile$, auth$}) {
  return withLatestFrom(Array, userProfile$, auth$)
    .filter(([profile, auth]) => !profile && !!auth)
    .map(() => '/confirm')
}

export function AuthedRedirectManager(sources) {
  const redirectLogin$ = createRedirectLogin$(sources)
  const redirectLogout$ = map(() => '/' , filterOpposite(sources.auth$))
  const redirectUnconfirmed$ = createRedirectUnconfirmed$(sources)

  return {
    redirectLogin$,
    redirectLogout$,
    redirectUnconfirmed$,
  }
}
