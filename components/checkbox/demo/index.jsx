import Base from './base'
import Info from './info'
import Disabled from './disabled'
import Group from './group'
import CheckAll from './check-all'
// import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <Disabled />
        <Group />
        <CheckAll />
        {/* <CN className="typo" /> */}
      </div>
    )
  }
}