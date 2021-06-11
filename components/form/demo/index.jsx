import Info from "./info.md";
import Base from "./base.md";
import Align from "./align.md";
import Valid from "./valid.md";
import CustomValid from "./customvalid.md";
import DynamicValid from "./dynamicvalid.md";
import CN from '../index.md'
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        {/* <Base />
        <Align />
        <Valid />
        <CustomValid /> */}
        <DynamicValid />
        <CN className="typo" />
      </div>
    );
  }
}