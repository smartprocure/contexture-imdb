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
      float: 'number',
      double: 'number',
    }),
    // typeOptions: [],
  })),
  applyDefaults,
  fields => ({fields})
))

export let getSchemas = async client =>
  _.flow(
    fromFlatEsMapping,
    _.update(
      'movies.fields',
      _.flow(
        _.merge(_, {
          released: {
            label: 'Release Date',
          },
          ...flagFields({
            isCommon: ['plot', 'title'],
          })
        }),
        _.omit(['imdbId', 'yearEnded'])
      )
    )
  )(await client.indices.getMapping())