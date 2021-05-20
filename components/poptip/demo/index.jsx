import Info from './info'
import Base from './base.md'
import Trigger from './trigger.md'
import Closeinside from './closeinside.md'
import Placement from './placement.md'
import CN from '../index.md'
import React from 'react'

export default class Demo extends React.Component {
  render() {
    return (
      <div className="demo-poptip">
        <Info className="typo" />
        <Base />
        <Trigger />
        <Closeinside />
        <Placement />
        <CN className="typo" />
      </div>
    )
  }
}