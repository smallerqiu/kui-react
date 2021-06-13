import Info from './info'
import Base from './base'
import Custom from './custom'
import Form from './form'
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div className="drawer-demo">
        <Info className="typo" />
        <Base />
        <Custom />
        <Form />
        <CN className="typo" />
      </div>
    )
  }
}