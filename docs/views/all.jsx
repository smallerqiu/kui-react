import React from 'react'
import { Row, Col, Card, Icon } from 'react-kui'
import { Nav } from '../menu.js'

export default class All extends React.Component {
  renders(child, x) {
    let span = [], rows = [];
    child.forEach((item, i) => {
      let card = <Col span={6} key={i}><a href={"/components/" + item.name}><Card bordered title={item.sub + ' ' + item.title} ><Icon className="icon-view" type={item.icon} /></Card></a></Col>
      span.push(card)
    })
    if (span.length < 4) {
      rows.push(<Row gutter={20} key={x}>{span}</Row>)
    } else {
      for (let i = 0; i < span.length; i += 4) {
        rows.push(<Row gutter={20} key={i}>{span.slice(i, i + 4)}</Row>)
      }
    }
    return rows
  }
  render() {
    return (
      <div className="all-components typo">
        <h1>组件</h1>
        <p><code>kui</code> 提供了65款组件，之后会根据需求补充，欢迎提供建议！</p>
        {
          Nav.map((item, x) => {
            return (
              [<h2 key={x}>{item.title}</h2>,
              this.renders(item.child, x)])
          })
        }
      </div>
    )
  }
}
