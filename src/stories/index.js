import 'babel-polyfill'
import React from 'react'
import { storiesOf } from '@storybook/react'
import { Styles } from 'contexture-react/dist/example-types/components'

let demoBox = {
  backgroundColor: '#333',
  color: '#AAA',
  padding: '20px',
  borderRadius: '10px',
}
storiesOf('IMDB', module)
  .addDecorator(storyFn => (
    <div>
      <Styles />
      {storyFn()}
    </div>
  ))
  .add('Advanced Search', require('./advanced').default)
  .addDecorator(story => <div style={demoBox}>{story()}</div>)
  .add('Manual Basic', require('./basic').default)
  .add('Filter List', require('./filterList').default)
