import _ from 'lodash/fp'
import * as F from 'futil-js'

export let flagFields = _.flow(F.invertByArray, _.mapValues(F.flags))
export let applyDefaults = F.mapValuesIndexed((node, field) => _.defaults({
  field,
  label: F.autoLabel(field),
  order: 0
}, node))

export let fromFlatEsMapping = _.mapValues(
_.flow(
  x  => _.values(x.mappings)[0].properties, // Always 1 type per index
  _.mapValues(({type}) => ({
    typeDefault: F.alias(type, {
      string: 'query',
      text: 'facet',
      long: 'number',
      double: 'number',
    }),
    // typeOptions: [],
  })),
  applyDefaults,
  fields => ({fields})
))

let override = args => _.flow(..._.map(x => (_.isFunction(x) ? x : _.merge(_, x)), args))
let applyOverrides = overrides => F.mapValuesIndexed(({fields}, schema) => ({
  fields: overrides[schema]
    ? override(overrides[schema])(fields)
    : fields
}))

export let getSchemas = async client =>
  _.flow(
    fromFlatEsMapping,
    applyOverrides({
      movies: [
        {
          released: {
            label: 'Release Date',
          }
        },
        flagFields({
          isCommon: ['plot', 'title'],
        }),
        _.omit(['imdbId', 'yearEnded'])
      ]
    })
  )(await client.indices.getMapping())
