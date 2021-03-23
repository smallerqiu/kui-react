import Info from './info'
import Base from './base.md'
import Vertical from './vertical.md'
import AutoPlay from './autoplay.md'
import CN from '../index.md'
import React from 'react'
export default class Index extends React.Component {
  render() {
    return (
      <div class="demo-carousel">
        <Info className="typo" />
        <Base />
        <Vertical />
        <AutoPlay />
        <CN className="typo" />
      </div>
    )
  }
}
