import Info from './info'
import Base from './base'
import Disabled from './disabled'
import Size from './size'
import Hollow from './hollow'
import WithIcon from './with-icon.md'
import Loading from './loading.md'
import Block from './block.md'
import Group from './group.md'
import CN from '../index.md'

import React, { Component } from 'react'
export default class Index extends Component {
  render() {
    return (
      <div className="demo-button">
        <Info className="typo" />
        <Base />
        <WithIcon />
        <Size />
        <Disabled />
        <Hollow />
        <Loading />
        <Block />
        <Group />
        <CN className="typo" />
      </div>
    )
  }
}