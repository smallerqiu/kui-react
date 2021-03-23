import Base from './base'
import Info from './info'
import Dot from './dot'
import Max from './max'
import Dynamic from './dynamic'
import Mark from './mark'
import Status from './status'
import Color from './color'
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <Dot />
        <Max />
        <Mark />
        <Dynamic />
        <Status />
        <Color />
        <CN className="typo" />
      </div>
    )
  }
}