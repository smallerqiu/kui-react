import Info from './info' 
import Base from './base' 
import Custom from './custom' 
import More from './more' 
import Global from './global' 
import Confrim from './confrim' 
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div className="demo-modal">
        <Info className="typo" />
        <Base />
        <Custom />
        <More />
        <Global />
        <Confrim />
        <CN className="typo" />
      </div>
    )
  }
}