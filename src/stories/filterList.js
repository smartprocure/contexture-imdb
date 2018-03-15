import React from 'react'
import _ from 'lodash/fp'
import * as F from 'futil-js'
import {Provider} from 'mobx-react'
import {storiesOf} from '@storybook/react'
import Contexture from '../utils/contexture-client'
import {
  Facet,
  Range,
  Query,
  ResultCount,
  DateHistogram,
} from 'contexture-react/dist/example-types/components'
import {Flex} from 'contexture-react/dist/example-types/Flex'
import SpacedList from 'contexture-react/dist/example-types/SpacedList'
import ResultTable from '../components/ResultTable'
import {FilterList} from '../components/FilterList'
import IMDBCards from '../components/IMDBCards'

let formatYear = x => new Date(x).getFullYear() + 1

let TypeMap = {
  facet: Facet,
  number: Range,
  query: Query,
}

let tree = Contexture({
  key: 'searchRoot',
  type: 'group',
  join: 'and',
  schema: 'imdb',
  children: [
    {
      key: 'searchQuery',
      type: 'query',
      field: 'title',
      query: '',
    },
    {
      key: 'criteria',
      type: 'group',
      join: 'and',
      children: [
        {
          key: 'searchRange',
          type: 'number',
          field: 'metaScore',
          min: 0,
          max: 100,
        },
        {
          key: 'searchFacet',
          type: 'facet',
          field: 'genres.keyword',
          fieldMode: 'word',
          optionsFilter: '',
          context: {
            options: [],
          },
        },
        {
          key: 'searchActors',
          type: 'facet',
          field: 'actors.keyword',
          fieldMode: 'word',
          context: {
            options: [],
          },
        },
      ],
    },
    {
      key: 'results',
      type: 'results',
      pageSize: 6,
      page: 1,
      context: {
        response: {
          results: [],
          totalRecords: null,
        },
      },
    },
    {
      key: 'releases',
      type: 'dateHistogram',
      key_field: 'released',
      value_field: 'imdbVotes',
      interval: '3650d',
      context: {
        entries: [],
        maxDate: null,
        minDate: null,
      },
    },
  ],
})

export default () => (
  <Provider tree={tree}>
    <SpacedList>
      <Query path={['searchRoot', 'searchQuery']} />
      <Flex>
        <div style={{flex: 1}}>
          <FilterList
            path={['searchRoot', 'criteria']}
            typeComponents={TypeMap}
          />
        </div>
        <div style={{flex: 4}}>
          <ResultCount path={['searchRoot', 'results']} />
          <DateHistogram
            path={['searchRoot', 'releases']}
            format={formatYear}
          />
          <IMDBCards path={['searchRoot', 'results']} />
          <h1>
            <ResultCount path={['searchRoot', 'results']} />
          </h1>
          <ResultTable path={['searchRoot', 'results']} />
        </div>
      </Flex>
    </SpacedList>
  </Provider>
)
