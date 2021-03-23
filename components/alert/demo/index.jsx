import Info from './info.md'
import Base from './base.md'
import Icon from './icon.md'
import Close from './close.md'
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <Icon />
        <Close />
        <CN className="typo" />
      </div>
    )
  }
}