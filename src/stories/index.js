import 'babel-polyfill'
import React from 'react'
import _ from 'lodash/fp'
import {storiesOf} from '@storybook/react'
import MovieResults from '../components/MovieResults'
import SearchRoot from 'contexture-react/dist/components/SearchRoot'
import Types from 'contexture-react/dist/exampleTypes'
import {observable} from 'mobx'
import {observer, Provider} from 'mobx-react'
import searchService from '../utils/searchService'
import mobxSearchTree from '../utils/mobxSearchTree'

let searchTree = observable({
  key: 'root',
  type: 'group',
  join: 'and',
  schema: 'imdb',
  children: [
    {
      key: 'searchRoot',
      type: 'group',
      join: 'and',
      children: [
        {
          key: 'searchQuery',
          type: 'query',
          field: 'title',
          data: {
            query: 'rabbit',
          },
        },
        {
          key: 'searchFacet',
          type: 'facet',
          field: 'genres.keyword',
          data: {
            fieldMode: 'word',
          },
          context: {
            options: [],
          },
        },
      ],
    },
    {
      key: 'results',
      type: 'results',
      config: {
        pageSize: 10,
        page: 1,
      },
      context: {
        response: {
          results: [],
          totalRecords: null,
        },
      },
    },
  ],
})

let tree = mobxSearchTree(searchTree, async dto => ({
  data: await searchService(dto),
}))

import Contexture from '../utils/contexture-client'
import {
  Facet,
  Range,
  Query,
  ResultCount,
  DateHistogram,
  InjectTreeNode,
  Styles,
} from 'contexture-react/dist/example-types/components'
import {Flex} from 'contexture-react/dist/example-types/Flex'

let tree2 = Contexture({
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

let IMDBCards = InjectTreeNode(
  observer(({node}) => (
    <Flex style={{flexWrap: 'wrap', justifyContent: 'center'}}>
      {_.map(
        ({_id, _source: {title, poster}}) => (
          <div key={_id} style={{margin: '5px', textAlign: 'center'}}>
            <img src={poster} width="180" height="270" />
            <div style={{width: '180px'}}>{title}</div>
          </div>
        ),
        node.context.response.results
      )}
    </Flex>
  ))
)
let formatYear = x => new Date(x).getFullYear() + 1

storiesOf('IMDB', module)
  .add('Advanced Search', () => (
    <div>
      <SearchRoot tree={tree} types={Types} path={['root', 'searchRoot']} />
      <MovieResults node={tree.getNode(['root', 'results'])} />
      <pre>{JSON.stringify(tree, null, 2)}</pre>
    </div>
  ))
  .add('Basic Search', () => (
    <div
      style={{
        backgroundColor: '#333',
        color: '#AAA',
        padding: '20px',
        borderRadius: '10px',
      }}>
      <Styles />
      <Provider tree={tree2}>
        <div style={{fontSize: '18px'}}>
          <Query
            style={{
              width: '700px',
              fontSize: '18px',
            }}
            path={['searchRoot', 'searchQuery']}
          />
          <Flex>
            <div style={{flex: 1}}>
              <div style={{margin: '5px'}}>
                <b>MetaScore</b>
                <Range
                  style={{padding: '10px'}}
                  path={['searchRoot', 'searchRange']}
                />
              </div>
              <div style={{margin: '5px'}}>
                <b>Genre</b>
                <Facet
                  style={{padding: '10px'}}
                  path={['searchRoot', 'searchFacet']}
                />
              </div>
              <div style={{margin: '5px'}}>
                <b>Actors</b>
                <Facet
                  style={{padding: '10px'}}
                  path={['searchRoot', 'searchActors']}
                />
              </div>
            </div>
            <div style={{flex: 4}}>
              <ResultCount path={['searchRoot', 'results']} />
              <DateHistogram
                path={['searchRoot', 'releases']}
                format={formatYear}
              />
              <IMDBCards path={['searchRoot', 'results']} />
            </div>
          </Flex>
        </div>
      </Provider>
    </div>
  ))
