import React from 'react'
import * as F from 'futil-js'
import SpacedList from 'contexture-react/dist/example-types/SpacedList'
import { observer } from 'mobx-react'
import { InjectTreeNode } from 'contexture-react/dist/example-types/components'

export let FieldLabel = InjectTreeNode(
  observer(({ node: { field } = {} }) => <b>{F.autoLabel(field)}</b>)
)

export let FilterList = InjectTreeNode(
  observer(({ node, typeComponents }) => (
    <SpacedList>
      {node.children.map(child => {
        let C = typeComponents[child.type]
        return (
          <div key={child.path}>
            <FieldLabel path={[...child.path]} />
            <C path={[...child.path]} />
          </div>
        )
      })}
    </SpacedList>
  ))
)
