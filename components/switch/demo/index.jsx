import Info from './info'
import Base from './base'
import Disabled from './disabled'
import Text from './text'
import Size from './size'
import Loading from './loading'
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div className="switch-demo">
        <Info className="typo" />
        <Base />
        <Disabled />
        <Text />
        <Size />
        <Loading />
        <CN className="typo" />
      </div>
    )
  }
}