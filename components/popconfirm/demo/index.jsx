import Info from './info'
import Base from './base.md'
import Local from './local.md'
import Placement from './placement.md'
import CN from '../index.md'
import React from 'react'

export default class Demo extends React.Component {
  render() {
    return (
      <div className="demo-popconfirm">
        <Info className="typo" />
        <Base />
        <Local />
        <Placement />
        <CN className="typo" />
      </div>
    )
  }
}