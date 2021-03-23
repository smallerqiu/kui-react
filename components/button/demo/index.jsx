import Info from './info'
import Base from './base'
import Disabled from './disabled'
import Size from './size'
import Hollow from './hollow'
import WithIcon from './with-icon.md'
import Loading from './loading.md'
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
        <Group />
        <CN className="typo" />
      </div>
    )
  }
}
 
// <style lang="less">
// .demo-button {
//   .k-btn,
//   .k-btn-group {
//     margin-right: 10px;
//     margin-bottom: 10px;
//   }
//   .k-btn-group,
//   .k-radio-group {
//     .k-btn {
//       margin-right: 0px;
//       margin-bottom: 0px;
//     }
//   }
// } 