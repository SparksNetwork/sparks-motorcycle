import {map, never} from 'most'

function plucker(args, length, higherOrder) {
  return function mapper(obj) {
    let currentProp = obj
    for (let i = 0; i < length; ++i) {
      const p = currentProp[args[i]]
      if (typeof p !== 'undefined') {
        currentProp = p
      } else {
        return higherOrder ? never() : void 0
      }
    }
    return currentProp
  }
}

export function pluck(...args) {
  const stream = args.pop()
  const length = args.length
  if (length === 1) { // optimize for a single value
    return map(x => x[args[0]], stream)
  }
  return map(plucker(args, length, false), stream)
}

export function pluckSwitch(...args) {
  const stream = args.pop()
  const length = args.length
  if (length === 1) { // optimize for single value
    return map(x => x[args[0]] || never(), stream).switch()
  }
  return map(plucker(args, length, true)).switch()
}

export function pluckJoin(...args) {
  const stream = args.pop()
  const length = args.length
  if (length === 1) { // optimize for single value
    return map(x => x[args[0]] || never(), stream).join()
  }
  return map(plucker(args, length, true)).join()
}
