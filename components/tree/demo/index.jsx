import Info from './info'
import Base from './base.md'
import TreeNode from './treenode.md'
import Checkable from './checkable.md'
import CustomRender from './custom-render.md'
import Disabled from './disabled.md'
import Sync from './sync.md'
import Icon from './icon.md'
import Directory from './directory.md'
import CN from '../index.md'
import React from 'react'

export default class Demo extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <TreeNode />
        <Checkable />
        <CustomRender />
        <Disabled />
        <Sync />
        <Icon />
        <Directory />
        <CN className="typo" />
      </div>
    )
  }
}