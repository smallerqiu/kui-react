import Info from './info'
import Base from './base'
import Custom from './custom'
// import Use from './use'
import Nodesc from './nodesc'
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <Custom />
        {/* <Use /> */}
        <Nodesc />
        <CN className="typo" />
      </div>
    )
  }
}