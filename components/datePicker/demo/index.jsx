import Info from './info'
import Base from './base.md'
import Disabled from './disabled.md'
import NoBorder from './noborder.md'
import DisabledDate from './disabled-date.md'
import Size from './size.md'
import Mode from './mode.md'
import Format from './format.md'
import CN from '../index.md'
import React from 'react'

export default class Demo extends React.Component {
  render() {
    return (
      <div className="demo-datepicker">
        <Info className="typo" />
        <Base />
        <Disabled />
        <NoBorder />
        <Format />
        <Size />
        <Mode />
        <DisabledDate />
        <CN className="typo" />
      </div>
    )
  }
}