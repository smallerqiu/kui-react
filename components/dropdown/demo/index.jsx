import Info from './info'
import Base from './base.md'
// import Custom from './custom.md'
import Rightmenu from './rightmenu.md'
import Divider from './divider.md'
import Placement from './placement.md'
import Cascading from './cascading.md'
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div className="demo-dropdown">
        <Info className="typo" />
        <Base />
        <Rightmenu />
        <Divider />
        <Placement />
        <Cascading />
        <CN className="typo" />
      </div>
    )
  }
}