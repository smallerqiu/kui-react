import Info from './info.md'
import Base from './base.md'
import Custom from './custom.md'
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <Custom />
        <div style={{ height: 500, 'textAlign': 'center', color: '#ddd', lineHeight: '500px' }}>我是打酱油的,请忽略我...</div>
        <CN className="typo" />
      </div>
    )
  }
}