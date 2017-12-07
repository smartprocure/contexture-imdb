import * as contextureClient from 'contexture-client'
import { toJS, extendObservable } from 'mobx'

export default (tree, service) =>
  contextureClient.ContextTree(
    tree,
    service,
    undefined,
    {
      // debug: true,
      snapshot: toJS,
      extend: extendObservable
    })
