import Info from "./info.md";
import Base from "./base.md";
import Layout1 from "./layout1.md";
import Layout2 from "./layout2.md";
import Layout3 from "./layout3.md";
import Layout4 from "./layout4.md";
import Layout5 from "./layout5.md";
import Layout6 from "./layout6.md";
import React from 'react'
import './demo.less'

export default class Index extends React.Component {
  render() {
    return (
      <div className="k-demo-layout">
        <Info className="typo" />
        <Base />
        <Layout1 />
        <Layout2 />
        <Layout3 />
        <Layout4 />
        <Layout5 />
        <Layout6 />
      </div>
    );
  }
};
