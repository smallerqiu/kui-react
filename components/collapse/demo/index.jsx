import Info from './info'
import Base from './base'
import Accrodion from './accrodion'
import Nesting from './nesting'
import Extra from './extra'
import Sample from './sample'
import CN from '../index.md'
import React from 'react'
export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <Accrodion />
        <Nesting />
        <Extra />
        <Sample />
        <CN className="typo" />
      </div>
    )
  }
}