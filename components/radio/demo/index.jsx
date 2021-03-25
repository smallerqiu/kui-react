import Base from './base'
import Info from './info'
import Disabled from './disabled'
import Group from './group'
import Button from './button'
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div className="switch-demo">
        <Info className="typo" />
        <Base />
        <Disabled />
        <Group />
        <Button />
        <CN className="typo"/>
      </div>
    )
  }
}
