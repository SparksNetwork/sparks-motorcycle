import {ProjectItem} from 'components/ui/Project'

const _label = ({isApplied, isAccepted, isConfirmed}) =>
  isConfirmed && 'Confirmed' ||
    isAccepted && 'Accepted' ||
      isApplied && 'Applied' ||
        'Unknown'

const EngagementItem = sources => ProjectItem({...sources,
  subtitle$: sources.item$.map(e => e.opp.name + ' | ' + _label(e)),
  item$: sources.item$.map(e => ({$key: e.opp.projectKey, ...e.opp.project})),
  path$: sources.item$.map(({$key}) => '/engaged/' + $key),
})

export {EngagementItem}
