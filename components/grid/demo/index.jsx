import Info from './info.md'
import Base from './base.md'
import Gutter from './gutter.md'
import Offset from './offset.md'
import Align from './align.md'
import Flex from './flex.md'
import Fill from './fill.md'
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <Gutter />
        <Offset />
        <Align />
        <Flex />
        <Fill />
        <CN className="typo"/>
      </div>
    )
  }
} 