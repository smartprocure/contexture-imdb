import React from 'react'
import * as F from 'futil-js'
import SpacedList from 'contexture-react/dist/example-types/SpacedList'
import { observer } from 'mobx-react'
import { InjectTreeNode } from 'contexture-react/dist/example-types/components'
let Dynamic = ({ component: C, ...props }) => <C {...props} />

export let FieldLabel = InjectTreeNode(
  observer(({ node: { field } = {} }) => <b>{F.autoLabel(field)}</b>)
)

export let FilterList = InjectTreeNode(
  observer(({ node, typeComponents: types }) =>
    <SpacedList>
      {node.children.map(child =>
        <div key={child.path}>
          <FieldLabel path={[...child.path]} />
          <Dynamic component={types[child.type]} path={[...child.path]} />
        </div>
      )}
    </SpacedList>
  )
)
