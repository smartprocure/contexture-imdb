import _ from 'lodash/fp'
import React from 'react'
import { observer } from 'mobx-react'

export let fieldsToOptions = _.map(x => ({ value: x.field, ...x }))

let getGroupFields = (path, tree) => _.map('field', tree.getNode(path).children)

export let FieldAdder = observer(({ tree, path, fields, FieldPicker, uniqueFields }) => {
  let options = fieldsToOptions(fields)
  if (uniqueFields) {
    options = _.reject(x => _.includes(x.field, getGroupFields(path, tree)), options)
  }
  
  return <FieldPicker
    options={options}
    onChange={field => {
      tree.add(path, {
        key: _.uniqueId('add'),
        field,
        type: fields[field].typeDefault,
      })
    }}
  />
})
