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

let Results = observer(({ node }) => (
  <div>
    <h1>
      {node.context.response.results.length
        ? `Viewing records ${node.context.response.startRecord} - ${
            node.context.response.endRecord
          } out of ${node.context.response.totalRecords}`
        : 'No Results'}
    </h1>
    <table>
      <thead>
        <tr>
          {_.flow(
            _.get('context.response.results[0]._source'),
            _.keys,
            _.map(F.autoLabel),
            _.map(x => <th key={x}>{x}</th>)
          )(node)}
        </tr>
      </thead>
      <tbody>
        {_.map(
          result => (
            <tr key={_.uniqueId(result._id)}>
              {_.map(
                x => (
                  <td key={_.uniqueId(JSON.stringify(x))}>
                    {JSON.stringify(x)}
                  </td>
                ),
                _.values(result._source)
              )}
            </tr>
          ),
          node.context.response.results
        )}
      </tbody>
    </table>
  </div>
))

export default observer(() => (
  <div>
    <SearchRoot tree={tree} types={Types} path={['root', 'searchRoot']} />
    <Results node={tree.getNode(['root', 'results'])} />
    <pre>{JSON.stringify(tree, null, 2)}</pre>
  </div>
))
