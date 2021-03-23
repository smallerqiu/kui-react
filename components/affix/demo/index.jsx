import Info from './info.md'
import Base from './base.md'
import Callback from './callback.md'
import Container from './container.md'
import Bottom from './bottom.md'
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <Callback />
        <Container />
        <div style={{ height: 500, display: 'flex', color: '#ddd', alignItems: 'center',justifyContent:'center' }}>我是打酱油的,请忽略我...</div>
        <Bottom />
        <CN className="typo" />
      </div>
    )
  }
}