import Info from "./info";
import Base from "./base";
import Container from "./container";
import Mode from "./mode";
import CN from "../index.md";

import React, { Component } from 'react'
export default class Index extends Component {
  render() {
    return (
      <div className="switch-demo">
        <Info className="typo" />
        <Base />
        <Container />
        <Mode />
        <CN className="typo" />
      </div>
    );
  }
};
