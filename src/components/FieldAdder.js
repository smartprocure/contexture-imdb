import _ from 'lodash/fp'
import React from 'react'
import { observer } from 'mobx-react'

export let fieldsToOptions = _.map(x => ({ value: x.field, ...x }))

export let FieldAdder = observer(({ tree, path, fields, FieldPicker }) => (
  <FieldPicker
    options={fieldsToOptions(fields)}
    onChange={field => {
      tree.add(path, {
        key: _.uniqueId('add'),
        field,
        type: fields[field].typeDefault,
      })
    }}
  />
))
