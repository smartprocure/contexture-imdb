import _ from 'lodash/fp'
import * as F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import {hover} from 'contexture-react/dist/mobx-react-utils'
import {withStateLens} from '../utils/mobx-react-utils'
import Modal from './Modal'

export let Button = x => (
  <button
    style={{
      width: '100%',
      padding: '5px',
      margin: '5px 0',
      borderRadius: '5px',
    }}
    {...x}
  />
)
export let ListGroupItem = withStateLens({hovering: false})(observer(({hovering, ...x}) => (
  <div style={{
      cursor: 'pointer',
      padding: '10px 15px',
      borderRadius: '4px',
      ...(F.view(hovering) && {backgroundColor: '#f5f5f5'})
    }}
    className={'hovering' + F.view(hovering)}
    {...hover(hovering)}
    {...x}
  />
)))
export let ListGroupPicker = observer(({options, onChange}) =>  _.map(
  ({ value, label }) => (
    <ListGroupItem key={value}>
      <a onClick={() => onChange(value)}>{label}</a>
    </ListGroupItem>
  ),
  options
))

export let ModalPicker = withStateLens({isOpen: false})(observer(
  ({options, isOpen, Button='button', onChange, label, Select}) => (
    <div>
      <Modal isOpen={isOpen}>
        <Select
          options={options}
          onChange={x => {
            onChange(x)
            F.off(isOpen)()
          }}
        />
      </Modal>
      <Button onClick={F.on(isOpen)}>
        {label}
      </Button>
    </div>
  ))
)