import Base from './base'
import Info from './info'
import Border from './border'
import CN from '../index.md'
import React from 'react'
export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <Border />
        <CN className="typo" />
      </div>
    )
  }
}