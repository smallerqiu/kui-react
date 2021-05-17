import Info from "./info.md";
import Base from "./base.md";
import InLine from "./inline.md";
import Accrodion from "./accrodion.md";
import Vertical from "./vertical.md";
import VerticalAffix from "./vertical-affix.md";
import Theme from "./theme.md";
import Collapsed from "./collapsed.md";
import Mode from "./mode.md";
import CN from "../index.md";
import React from 'react'

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Info className="typo" />
        <Base />
        <InLine />
        <Accrodion />
        <Vertical />
        <VerticalAffix />
        <Theme />
        <Mode />
        <Collapsed />
        <CN className="typo" />
      </div>
    );
  }
};