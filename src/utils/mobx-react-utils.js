import * as F from 'futil-js'
import { inject } from 'mobx-react'
import { observable } from 'mobx'

export let withStateLens = state => inject(() => F.lensOf(observable(state)))