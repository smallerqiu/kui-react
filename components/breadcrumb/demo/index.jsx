import Info from './info'
import Base from './base'
import Icon from './icon'
import Separator from './separator'
import CN from '../index.md'
import React from 'react'
export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <Icon />
        <Separator />
        <CN className="typo" />
      </div>
    )
  }
}