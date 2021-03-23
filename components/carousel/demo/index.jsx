import Info from './info'
import Base from './base'
import Vertical from './vertical'
import AutoPlay from './autoplay'
import CN from '../index.md'
import React from 'react'
export default class Index extends React.Component {
  render() {
    return (
      <div className="demo-carousel">
        <Info className="typo" />
        <Base />
        <Vertical />
        <AutoPlay />
        <CN className="typo" />
      </div>
    )
  }
}
