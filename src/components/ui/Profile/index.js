import './styles.scss'

import {img} from '@motorcycle/dom'

const ProfileAvatar = sources => ({
  DOM: sources.src$.map(src =>
    img({class: {avatar: true}, attrs: {src}})
  ),
})

const MediumProfileAvatar = sources => ({
  DOM: sources.src$.map(src =>
    img({class: {avatar: true, medium: true}, attrs: {src}})
  ),
})

const LargeProfileAvatar = sources => ({
  DOM: sources.src$.map(src =>
    img({class: {avatar: true, large: true}, attrs: {src}})
  ),
})

export {LargeProfileAvatar, MediumProfileAvatar, ProfileAvatar}
