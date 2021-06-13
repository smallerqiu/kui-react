import Info from './info'
import Base from './base'
import Icon from './icon'
import Mode from './mode'
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <Icon />
        <Mode />
        <CN className="typo" />
      </div>
    )
  }
}