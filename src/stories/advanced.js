import React from 'react'
import { Provider } from 'mobx-react'
import SearchRoot from 'contexture-react/dist/components/SearchRoot'
import Types from 'contexture-react/dist/exampleTypes'
import { ResultCount } from 'contexture-react/dist/example-types/components'
import Contexture from '../utils/contexture-client'
import ResultTable from '../components/ResultTable'

let tree = Contexture({
  key: 'root',
  type: 'group',
  join: 'and',
  schema: 'imdb',
  children: [
    {
      key: 'searchRoot',
      type: 'group',
      join: 'and',
      children: [
        {
          key: 'searchQuery',
          type: 'query',
          field: 'title',
          query: 'rabbit',
        },
        {
          key: 'searchFacet',
          type: 'facet',
          field: 'genres',
          context: {
            options: [],
          },
        },
      ],
    },
    {
      key: 'results',
      type: 'results',
      pageSize: 10,
      page: 1,
      context: {
        response: {
          results: [],
          totalRecords: null,
        },
      },
    },
  ],
})
export default () => (
  <div>
    <SearchRoot tree={tree} types={Types} path={['root', 'searchRoot']} />
    <Provider tree={tree}>
      <div>
        <h1>
          <ResultCount path={['root', 'results']} />
        </h1>
        <ResultTable path={['root', 'results']} />
      </div>
    </Provider>
    <pre>{JSON.stringify(tree, null, 2)}</pre>
  </div>
)
