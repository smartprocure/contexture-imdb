import 'babel-polyfill'
import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observer } from 'mobx-react'

export default observer(({ node }) => (
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
