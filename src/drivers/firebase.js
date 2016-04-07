import {create} from 'most'
import hold from '@most/hold'

export const POPUP = 'popup'
export const REDIRECT = 'redirect'
export const LOGOUT = 'logout'

// streams used in drivers
//

function FirebaseStream(ref, eventName) {
  return create((add) => ref.on(eventName, add))
    .map(snap => ({key: snap.key(), val: snap.val()}))
    .skipRepeats()
}

const ValueStream = ref => hold(FirebaseStream(ref,'value').map(({val}) => val))

const ChildAddedStream = ref => FirebaseStream(ref,'child_added')
  .multicast()

// factory takes a FB reference, returns a driver
// source: produces a stream of auth state updates from Firebase.onAuth
// sink: consumes a stream of {type,provider} actions where
//  type: POPUP, REDIRECT, or LOGOUT actions
//  provider: optional 'google' or 'facebook' for some actions
export const makeAuthDriver = ref => {
  const auth$ = create((add) => ref.onAuth(auth => add(auth)))
  const scope = 'email'

  const actionMap = {
    [POPUP]: prov => ref.authWithOAuthPopup(prov, () => {}, {scope}),
    [REDIRECT]: prov => ref.authWithOAuthRedirect(prov, () => {}, {scope}),
    [LOGOUT]: prov => ref.unauth(prov),
  }

  return input$ => {
    input$.drain()
    input$.observe(({type,provider}) => {
      console.log('auth$ received',type,provider)
      actionMap[type](provider)
    })
    return hold(auth$.skipRepeats())
  }
}

// factory takes a FB reference, returns a driver
// source: a function that takes ...args that resolve to a firebase path
//  each object is used to build a fb query (eg orderByChild, equalTo, etc)
//  anything else is treated as a FB key with a chained call to .child
// sinks: none.  to write, see makeQueueDriver
export const makeFirebaseDriver = ref => {
  const cache = {}

  // there are other chainable firebase query buiders, this is wot we need now
  const query = (parentRef,{orderByChild,equalTo}) => {
    let childRef = parentRef
    if (orderByChild) { childRef = childRef.orderByChild(orderByChild) }
    if (equalTo) { childRef = childRef.equalTo(equalTo) }
    return childRef
  }

  // used to build fb ref, each value passed is either child or k:v query def
  const chain = (a,v) => typeof v === 'object' && query(a,v) || a.child(v)

  // building query from fb api is simply mapping the args to chained fn calls
  const build = (args) => hold(ValueStream(args.reduce(chain,ref)))

  // SIDE EFFECT: build and add to cache if not in cache
  const cacheOrBuild = (key,args) => cache[key] || (cache[key] = build(args))

  return () =>
    (...args) => cacheOrBuild(JSON.stringify(args),args)
}

const deleteResponse = (ref, listenerKey, responseKey) => {
  console.log('removing',ref.key(),listenerKey,responseKey)
  ref.child(listenerKey).child(responseKey).remove()
}

// talks to FirebaseQueue on the backend
// factory takes FB ref, plus path names for src and dest locs, returns driver
// source: a function, called with key, returns stream of new items on that key
// sink: consumes objects that it pushes to the destination reference
export const makeQueueDriver = (ref, src = 'responses', dest = 'tasks') =>
  $input => {
    const srcRef = ref.child(src)
    const destRef = ref.child(dest)

    $input
      .tap(x => console.log('queue input',x))
      .observe(item => destRef.push(item))

    return listenerKey =>
      ChildAddedStream(srcRef.child(listenerKey))
        .tap(({key}) => deleteResponse(srcRef,listenerKey,key))
  }
