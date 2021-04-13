import Info from './info'
import Base from './base'
import More from './more'
import Sizer from './sizer'
import Elevator from './elevator'
import Size from './size'
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <More />
        <Sizer />
        <Elevator />
        <Size />
        <CN className="typo"/>
      </div>
    )
  }
}