import 'babel-polyfill'
import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import {observer} from 'mobx-react'
import {InjectTreeNode} from 'contexture-react/dist/example-types/components'

export default InjectTreeNode(
  observer(({node}) => (
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
  ))
)
