import _ from 'lodash/fp'
import Contexture from 'contexture'
import elasticsearch from 'elasticsearch-browser'
import contextureES from 'contexture-elasticsearch'
import contextureESTypes from 'contexture-elasticsearch/src/types'

export default Contexture({
  schemas: {
    imdb: {
      elasticsearch: {
        index: 'movies',
        type: 'movie',
      },
      modeMap: {
        word: '',
        autocomplete: '.keyword'
      }
    },
  },
  providers: {
    elasticsearch: contextureES({
      getClient: _.memoize(() =>
        elasticsearch.Client({
          apiVersion: '6.0',
          host:
            'https://y85ukgvi1w:4s1cvayng9@first-cluster-5089088915.us-east-1.bonsaisearch.net',
          // Won't work until we enable SSL
          // 'http://35.163.200.173:9200/',
        })
      ),
      types: contextureESTypes(),
    }),
  },
})
