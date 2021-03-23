
import Info from './info' 
import Base from './base' 
import Default from './default' 
import WithText from './with-text' 
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <Default />
        <WithText />
        <CN className="typo" />
      </div>
    )
  }
}