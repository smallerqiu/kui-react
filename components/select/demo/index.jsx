import Info from './info'
import Base from './base'
import Size from './size'
import Clearable from './clearable'
import NoBordered from './nobordered'
import Multiple from './multiple'
import Filterable from './filterable'
import Search from './search'
import CN from '../index.md'

import React from 'react'

export default class Demo extends React.Component {
  render() {
    return (
      <div className="demo-select">
        <Info className="typo" />
        <Base />
        <Size />
        <Clearable />
        <NoBordered />
        <Multiple />
        <Filterable />
        <Search />
        <CN className="typo" />
      </div>
    )
  }
}