import Base from "./base.md";
import Info from "./info.md";
import Icon from "./icon.md";
import Suffix from "./suffix.md";
import Clearable from "./clearable.md";
import Event from "./event";
import Size from "./size.md";
import TextArea from "./textarea.md";
import CN from "../index.md";
import React from 'react'

export default class Demo extends React.Component {
  render() {
    return (
      <div className="demo-input">
        <Info className="typo" />
        <Base />
        <Icon />
        <Suffix />
        <Clearable />
        <Size />
        <Event />
        <TextArea />
        <CN className="typo" />
      </div>
    );
  }
};
