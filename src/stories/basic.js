import React from 'react'
import { Provider } from 'mobx-react'
import Contexture from '../utils/contexture-client'
import {
  Facet,
  Range,
  Query,
  ResultCount,
  DateHistogram,
} from 'contexture-react/dist/example-types/components'
import { Flex } from 'contexture-react/dist/example-types/Flex'
import SpacedList from 'contexture-react/dist/example-types/SpacedList'
import IMDBCards from '../components/IMDBCards'

let formatYear = x => new Date(x).getFullYear() + 1

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
    },
    {
      key: 'searchFacet',
      type: 'facet',
      field: 'genres',
    },
    {
      key: 'searchActors',
      type: 'facet',
      field: 'actors',
    },
    {
      key: 'searchRange',
      type: 'number',
      field: 'metaScore',
      min: 0,
      max: 100,
    },
    {
      key: 'results',
      type: 'results',
      pageSize: 6,
      page: 1,
    },
    {
      key: 'releases',
      type: 'dateHistogram',
      key_field: 'released',
      value_field: 'imdbVotes',
      interval: '3650d',
    },
  ],
})

export default () => (
  <Provider tree={tree}>
    <SpacedList>
      <Query path={['searchRoot', 'searchQuery']} />
      <Flex>
        <div style={{ flex: 1 }}>
          <SpacedList>
            <div>
              <b>MetaScore</b>
              <Range path={['searchRoot', 'searchRange']} />
            </div>
            <div>
              <b>Genre</b>
              <Facet path={['searchRoot', 'searchFacet']} />
            </div>
            <div>
              <b>Actors</b>
              <Facet path={['searchRoot', 'searchActors']} />
            </div>
          </SpacedList>
        </div>
        <div style={{ flex: 4 }}>
          <ResultCount path={['searchRoot', 'results']} />
          <DateHistogram
            path={['searchRoot', 'releases']}
            format={formatYear}
          />
          <IMDBCards path={['searchRoot', 'results']} />
        </div>
      </Flex>
    </SpacedList>
  </Provider>
)
