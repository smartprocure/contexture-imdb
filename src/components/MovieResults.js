import 'babel-polyfill'
import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import SearchRoot from 'contexture-react/dist/components/SearchRoot'
import Types from 'contexture-react/dist/exampleTypes'
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
        pageSize: 10,
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

let tree = mobxSearchTree(searchTree, async dto => ({
  data: await searchService(dto)
}))

let Results = observer(({node}) => (
  <div>
    <h1>
      {node.context.response.results.length
        ? `Viewing records ${node.context.response.startRecord} - ${
            node.context.response.endRecord
          } out of ${node.context.response.totalRecords}`
        : 'No Results'}
    </h1>
    <table>
      <tr>
        {_.flow(
          _.get('context.response.results[0]._source'),
          _.keys,
          _.map(F.autoLabel),
          _.map(x => <th>{x}</th>)
        )(node)}
      </tr>
      {_.map(
        result => (
          <tr>
            {_.map(x => <td>{JSON.stringify(x)}</td>, _.values(result._source))}
          </tr>
        ),
        node.context.response.results
      )}
    </table>
  </div>
))


export default () => <div>
  <SearchRoot
    tree={tree}
    types={Types}
  />
  <Results node={tree.getNode(['root', 'results'])} />
</div>
