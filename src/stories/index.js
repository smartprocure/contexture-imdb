import 'babel-polyfill'
import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import {storiesOf} from '@storybook/react'
import MovieResults from '../components/MovieResults'
import SearchRoot from 'contexture-react/dist/components/SearchRoot'
import Types from 'contexture-react/dist/exampleTypes'
import {observable} from 'mobx'
import {observer} from 'mobx-react'
import searchService from '../utils/searchService'
import mobxSearchTree from '../utils/mobxSearchTree'

let searchTree = observable({
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
          data: {
            query: 'rabbit',
          },
        },
        {
          key: 'searchFacet',
          type: 'facet',
          field: 'genres.keyword',
          data: {
            fieldMode: 'word',
          },
          context: {
            options: [],
          },
        },
      ],
    },
    {
      key: 'results',
      type: 'results',
      config: {
        pageSize: 10,
        page: 1,
      },
      context: {
        response: {
          results: [],
          totalRecords: null,
        },
      },
    },
  ],
})

let tree = mobxSearchTree(searchTree, async dto => ({
  data: await searchService(dto),
}))

storiesOf('IMDB', module).add('Advanced Search', () => (
  <div>
    <SearchRoot tree={tree} types={Types} path={['root', 'searchRoot']} />
    <MovieResults node={tree.getNode(['root', 'results'])} />
    <pre>{JSON.stringify(tree, null, 2)}</pre>
  </div>
))
