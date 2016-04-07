import {just, map, filter, skipRepeats} from 'most'

const NULL = just(null)

const createUserProfileKey$ = ({auth$, firebase}) =>
  map(auth => firebase('Users', auth.uid) || NULL, filter(Boolean, auth$))
    .switch()

const createUserProfile$ = (userProfileKey$, firebase) =>
  map(key => key ? firebase('Profiles', key) : NULL,
    skipRepeats(userProfileKey$))

export function UserManager(sources) {
  const userProfileKey$ = createUserProfileKey$(sources)
  const userProfile$ = createUserProfile$(userProfileKey$, sources.firebase)
  return {userProfileKey$, userProfile$}
}
