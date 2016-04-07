import {multicast, sample} from 'most'
export function withLatestFrom(fn, sampler, ...streams) {
  const msample = multicast(sampler)
  return sample(fn, msample, msample, ...streams)
}
