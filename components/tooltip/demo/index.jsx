import Info from './info'
import Base from './base.md'
import Placement from './placement.md'
import Color from './color.md'
import CN from '../index.md'
import React from 'react'

export default class Demo extends React.Component {

  render() {
    return (
      <div className="demo-tooltip">
        <Info className="typo" />
        <Base />
        <Placement />
        <Color />
        <CN className="typo" />
      </div>
    )
  }
}