import Info from './info' 
import Base from './base' 
import Color from './color' 
import Dynamic from './dynamic' 
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <Color />
        <Dynamic />
        <CN className="typo" />
      </div>
    )
  }
}