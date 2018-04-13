import _ from 'lodash/fp'
import * as F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import { hover } from 'contexture-react/dist/mobx-react-utils'
import { value } from 'contexture-react/dist/actout'
import { withStateLens } from '../utils/mobx-react-utils'
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
export let ListGroupItem = withStateLens({ hovering: false })(
  observer(({ hovering, ...x }) => (
    <div
      style={{
        cursor: 'pointer',
        padding: '10px 15px',
        borderRadius: '4px',
        ...(F.view(hovering) && { backgroundColor: '#f5f5f5' }),
      }}
      className={`hovering${F.view(hovering)}`}
      {...hover(hovering)}
      {...x}
    />
  ))
)

const TextHighlight = ({pattern, text, Wrap = 'i'}) =>
  pattern
    ? F.highlight('<>', '<>', pattern, text)
        .split('<>')
        .map((x, i) => (i % 2 ? <Wrap key={i}>{x}</Wrap> : x))
    : text

let Highlight = x => <b style={{backgroundColor: 'yellow'}} {...x} />

export let ListGroupPicker = withStateLens({
  filter: '',
})(
  observer(({options, onChange, filter}) => (
    <div>
      <input
        {...value(filter)}
        style={{
          width: '100%',
          padding: '5px 15px',
          border: 'solid 1px #efefef',
          borderRadius: '50px',
          boxSizing: 'border-box',
          outline: 'none'
        }}
        placeholder='Find Filter...'
      />
      {_.map(
        ({value, label}) => (
          <ListGroupItem key={value}>
            <a onClick={() => onChange(value)}>
              <TextHighlight
                text={label}
                pattern={F.view(filter)}
                Wrap={Highlight}
              />
            </a>
          </ListGroupItem>
        ),
        _.filter(x => F.matchAllWords(F.view(filter))(x.label), options)
      )}
    </div>
  ))
)

export let ModalPicker = withStateLens({ isOpen: false })(
  observer(
    ({ options, isOpen, Button = 'button', onChange, label, Select }) => (
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
        <Button onClick={F.on(isOpen)}>{label}</Button>
      </div>
    )
  )
)
