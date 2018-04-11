import _ from 'lodash/fp'
import { ContextTree, exampleTypes } from 'contexture-client'
import { observable, toJS, extendObservable } from 'mobx'
import Contexture from 'contexture'
import elasticsearch from 'elasticsearch-browser'
import contextureES from 'contexture-elasticsearch'
import contextureESTypes from 'contexture-elasticsearch/src/types'

exampleTypes.results.reactors = _.extend(exampleTypes.results.reactors, {
  sortField: 'self',
  sortDir: 'self',
  include: 'self',
})

let esClient = elasticsearch.Client({
  apiVersion: '6.0',
  host:
    // 'https://y85ukgvi1w:4s1cvayng9@first-cluster-5089088915.us-east-1.bonsaisearch.net',
    // 'localhost:9200'
    'https://public-es-demo.smartprocure.us/',
})

export default _.flow(
  observable,
  ContextTree({
    // debug: true,
    types: exampleTypes,
    snapshot: toJS,
    extend: extendObservable,
    service: Contexture({
      schemas: {
        movies: {
          elasticsearch: {
            index: 'movies',
            type: 'movie',
          },
          modeMap: {
            word: '',
            autocomplete: '.keyword',
          },
        },
      },
      providers: {
        elasticsearch: contextureES({
          getClient: _.memoize(() => esClient),
          types: contextureESTypes(),
        }),
      },
    }),
  })
)
