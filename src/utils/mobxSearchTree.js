import * as contextureClient from 'contexture-client'
import { toJS, extendObservable } from 'mobx'

export default (tree, service) =>
  contextureClient.ContextTree(
    {
      // debug: true,
      snapshot: toJS,
      extend: extendObservable,
      service,
    },
    tree
  )
