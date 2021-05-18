import Info from './info'
import Base from './base'
import Disabled from './disabled'
import Icon from './icon'
import Extra from './extra'
import Card from './card'
import Closable from './closable'
import Sample from './sample'
import React from 'react'

import CN from '../index.md'
export default class Index extends React.Component {
  render() {
    return (
      <div className="switch-demo">
        <Info className="typo" />
        <Base />
        <Disabled />
        <Icon />
        <Extra />
        <Card />
        <Closable />
        <Sample />
        <CN className="typo" />
      </div>
    )
  }
}