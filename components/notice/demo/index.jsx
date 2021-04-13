import Info from './info'
import Base from './base'
import Icon from './icon'
import Close from './close'
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div className="k-notice-demo">
        <Info className="typo"/>
        <Base />
        <Icon />
        <Close />
        <CN className="typo"/>
      </div>
    )
  }
}