import React from 'react'
import { Button } from '@/index'

export default class about extends React.Component {
  constructor(props) {
    super(props)
    // this.onClick = this.onClick.bind(this)
  }
  onClick() {
    // console.log(this.props.history)
    this.props.history.push('/start')
  }
  render() {
    return <div>
      <h2>关于</h2>
      <p>欢迎批评、指正、吐槽、
           <a href="https://github.com/chuchur/kui" target="_blank">Star</a>和
           <a href="/sponsor">捐助</a>
      </p>
      <br />
      <br />
      <h2>兼容性</h2>
      <p>希望您也是一个高尚、纯粹、脱离了低级趣味的人，希望您的项目走在科技前沿，请使用现代浏览器</p>
      <div className="table-border">
        <table><tbody>
          <tr>
            <th>Internet Explorer</th>
            <th>Firefox</th>
            <th>Chrome</th>
          </tr>
          <tr>
            <td>9+</td>
            <td>30+</td>
            <td>42+</td>
          </tr>
        </tbody></table>
      </div>
      <Button onClick={this.onClick.bind(this)} type="primary">开始入手</Button>
    </div>
  }
}