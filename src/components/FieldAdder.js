import _ from 'lodash/fp'
import React from 'react'
import * as F from 'futil-js'
import {observer, inject} from 'mobx-react'
import {observable} from 'mobx'
import Modal from '../components/Modal'
let withStateLens = state => inject(() => F.lensOf(observable(state)))

let Style = () => (
  <style>
    {`
.FieldPicker_Field:hover {
  background-color: #f5f5f5;
}
.FieldPicker_Field {
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 4px
}
`}
  </style>
)
export let FieldPicker = ({fields, onChange}) =>
  _.map(
    field => (
      <div className="FieldPicker_Field">
        <a onClick={() => onChange(field.field)}>{field.label}</a>
      </div>
    ),
    fields
  )

export let FieldAdder = withStateLens({isOpen: false})(
  ({tree, path, fields, isOpen}) => (
    <div>
      <Style />
      <Modal isOpen={isOpen}>
        <FieldPicker
          fields={fields}
          onChange={field => {
            tree.add(['searchRoot', 'criteria'], {
              key: _.uniqueId('add'),
              field,
              type: fields[field].typeDefault,
            })
            F.off(isOpen)()
          }}
        />
      </Modal>
      <button
        style={{
          width: '100%',
          padding: '5px',
          margin: '5px 0',
          borderRadius: '5px',
        }}
        onClick={F.on(isOpen)}>
        Add
      </button>
    </div>
  )
)
