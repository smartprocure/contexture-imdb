import React from 'react'
import SearchRoot from 'contexture-react/src/components/SearchRoot'
import Types from 'contexture-react/src/exampleTypes'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import searchService from '../utils/searchService'
import mobxSearchTree from '../utils/mobxSearchTree'

let searchTree = observable({
  key: 'root',
  type: 'group',
  join: 'and',
  schema: 'imdb',
  children: [
    {
      key: 'classFacet',
      type: 'facet',
      filterOnly: true,
      field: 'title',
      data: {
        values: [],
        fieldMode: 'field',
      },
    },
    {
      key: 'results',
      type: 'results',
      config: {
        pageSize: 1000,
        page: 1
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

let tree = mobxSearchTree(searchTree, searchService)
let Results = observer(({ tree }) => <b>{JSON.stringify(tree.getNode(['root', 'results']).context)}</b>)

export default () => <div>
  <SearchRoot
    tree={tree}
    types={Types}
  />
  <Results tree={tree} />
</div>
