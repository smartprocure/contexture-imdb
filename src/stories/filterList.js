import _ from 'lodash/fp'
import * as F from 'futil-js'
import React from 'react'
import {fromPromise} from 'mobx-utils'
import { Provider, inject } from 'mobx-react'
import Contexture, {esClient} from '../utils/contexture'
import {getESSchemas, flagFields} from '../utils/schema'
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
import {FieldAdder} from '../components/FieldAdder'
import Awaiter from '../components/Awaiter'
import {ModalPicker, ListGroupPicker, Button} from '../components/DemoControls'

let formatYear = x => new Date(x).getFullYear() + 1

let TypeMap = {
  facet: Facet,
  number: Range,
  query: Query,
  date: Range// FIX
}

let tree = Contexture({
  key: 'searchRoot',
  type: 'group',
  schema: 'movies',
  children: [
    {
      key: 'searchQuery',
      type: 'query',
      field: 'title',
    },
    {
      key: 'criteria',
      type: 'group',
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
          field: 'genres',
        },
        {
          key: 'searchActors',
          type: 'facet',
          field: 'actors',
        },
      ],
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

// TODO: example story book for field picker only
// let schema = applyDefaults({
//   directors: {
//     typeDefault: 'facet',
//   },
//   runtimeMinutes: {
//     typeDefault: 'number',
//   },
// })
let schemas = fromPromise(
  getESSchemas(esClient).then(
    _.update(
      'movies.fields',
      _.flow(
        _.merge(_, {
          released: {
            label: 'Release Date',
          },
          ...flagFields({
            isCommon: ['plot', 'title'],
          }),
        }),
        _.omit(['imdbId', 'yearEnded'])
      )
    )
  )
)


// Pre apply some props
let FieldPicker = inject(() => ({
  Select: ListGroupPicker,
  Button,
  label: '+ Include Additional Filter'
}))(ModalPicker)

export default () => (
  <Awaiter promise={schemas}>
    {schemas => (
      <Provider tree={tree}>
        <SpacedList>
          <Query path={['searchRoot', 'searchQuery']} />
          <Flex>
            <div style={{flex: 1}}>
              <FilterList
                path={['searchRoot', 'criteria']}
                typeComponents={TypeMap}
              />
              <FieldAdder
                tree={tree}
                path={['searchRoot', 'criteria']}
                fields={schemas.movies.fields}
                FieldPicker={FieldPicker}
              />
            </div>
            <div style={{flex: 4}}>
              <ResultCount path={['searchRoot', 'results']} />
              <DateHistogram
                path={['searchRoot', 'releases']}
                format={formatYear}
              />
              <style>
                {`
                  .example-table tr:nth-child(even) {
                    background-color: rgba(0, 0, 0, 0.5)
                  }
                  .example-table {
                    background: white;
                    color: #444;
                    border-collapse: collapse;
                  }
                  .example-table td, .example-table th {
                    padding: 5px
                  }
                  .example-table thead {
                    border-bottom: solid 2px #ccc
                  }
                `}
              </style>
              <ResultTable
                path={['searchRoot', 'results']}
                fields={{
                  poster: {
                    label: 'Poster',
                    field: 'poster',
                    display: x => <img src={x} width="180" height="270" />,
                    order: 1,
                  },
                  title: {
                    order: 2,
                    Cell: x => <td style={{color: 'red'}} {...x} />,
                  },
                  year: {
                    order: -2,
                  },
                }}
                infer
                Table={x => <table className="example-table" {...x} />}
              />
            </div>
          </Flex>
        </SpacedList>
      </Provider>
    )}
  </Awaiter>
)
