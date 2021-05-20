import Info from './info'
import Base from './base.md'
import Circle from './circle.md'
import Dynamic from './dynamic.md'
import Dashboard from './dashboard.md'
import Color from './color.md'
import Size from './size.md'
import CN from '../index.md'
import React from 'react'

export default class Demo extends React.Component {
  render() {
    return (
      <div className="demo-progress">
        <Info className="typo" />
        <Base />
        <Circle />
        <Dashboard />
        <Dynamic />
        <Color />
        <Size />
        <CN className="typo" />
      </div>
    )
  }
}