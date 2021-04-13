import Info from './info'
import Base from './base'
import Types from './types'
import Close from './close'
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div className="k-message-demo">
        <Info className="typo" />
        <Base />
        <Types />
        <Close />
        <CN className="typo"/>
      </div>
    )
  }
}

