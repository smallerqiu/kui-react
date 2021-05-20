import Base from './base'
import Info from './info'
import Search from './search'
import CN from '../index.md'

import React, { Component } from 'react'
export default class Index extends Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <CN className="typo" />
        <Search />
      </div>
    )
  }
}