import Info from './info'
import Base from './base'
import Mode from './mode.md'
import Size from './size.md'
import Colors from './colors.md'
import CN from '../index.md'
import React from 'react'
export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <Mode />
        <Size />
        <Colors />
        <CN className="typo" />
      </div>
    )
  }
}