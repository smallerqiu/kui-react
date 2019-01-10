import React, { Component } from 'react'
import Demo from '../components/demo'
import code from '../code/carousel'
import { Carousel, Row, Col } from '@/index'
export default class carousel extends Component {
  render() {
    return (
      <div>
        <h2>Carousel 走马灯</h2>
        <p>就是传说中的大图轮播</p>
        <h3>代码示例</h3>
        <Row gutter="8">
          <Col span="12">
            <Demo layout="vertical" title="基本">
              <div>
                <Carousel>
                  <Carousel.Item className="k-carousel-item-demo ">1</Carousel.Item>
                  <Carousel.Item className="k-carousel-item-demo ">2</Carousel.Item>
                  <Carousel.Item className="k-carousel-item-demo ">3</Carousel.Item>
                  <Carousel.Item className="k-carousel-item-demo ">4</Carousel.Item>
                </Carousel>
              </div>
              <div>最基本的用法。</div>
              <div>{code.base}</div>
            </Demo>
            <Demo layout="vertical" title="垂直">
              <div>
                <Carousel vertical>
                  <Carousel.Item className="k-carousel-item-demo ">1</Carousel.Item>
                  <Carousel.Item className="k-carousel-item-demo ">2</Carousel.Item>
                  <Carousel.Item className="k-carousel-item-demo ">3</Carousel.Item>
                  <Carousel.Item className="k-carousel-item-demo ">4</Carousel.Item>
                </Carousel>
              </div>
              <div>垂直显示,此时不显示左右箭头</div>
              <div>{code.vertical}</div>
            </Demo>
          </Col>
          <Col span="12">
            <Demo layout="vertical" title="自动播放">
              <div>
                <Carousel autoplay>
                  <Carousel.Item className="k-carousel-item-demo ">1</Carousel.Item>
                  <Carousel.Item className="k-carousel-item-demo ">2</Carousel.Item>
                  <Carousel.Item className="k-carousel-item-demo ">3</Carousel.Item>
                  <Carousel.Item className="k-carousel-item-demo ">4</Carousel.Item>
                </Carousel>
              </div>
              <div>定时切换下一张。</div>
              <div>{code.autoplay}</div>
            </Demo>
            <Demo layout="vertical" title="圆形指示器">
              <div>
                <Carousel dotsType="radius">
                  <Carousel.Item className="k-carousel-item-demo ">1</Carousel.Item>
                  <Carousel.Item className="k-carousel-item-demo ">2</Carousel.Item>
                  <Carousel.Item className="k-carousel-item-demo ">3</Carousel.Item>
                  <Carousel.Item className="k-carousel-item-demo ">4</Carousel.Item>
                </Carousel>
              </div>
              <div>圆形指示器</div>
              <div>{code.radius}</div>
            </Demo>
          </Col>
        </Row>
        <h3>API</h3>
        <div className="table-border">
          <table>
            <tbody>
              <tr>
                <th>属性</th>
                <th>说明</th>
                <th>类型</th>
                <th>默认值</th>
              </tr>
              <tr>
                <td>value</td>
                <td>幻灯片的索引，从 0 开始</td>
                <td>String,Number</td>
                <td>0</td>
              </tr>
              <tr>
                <td>loop</td>
                <td>是否开启循环</td>
                <td>Boolean</td>
                <td>true</td>
              </tr>
              <tr>
                <td>autoplay</td>
                <td>是否自动切换</td>
                <td>Boolean</td>
                <td>false</td>
              </tr>
              <tr>
                <td>speed</td>
                <td>自动切换的时间间隔，单位为毫秒</td>
                <td>Number</td>
                <td>2000</td>
              </tr>
              <tr>
                <td>dotsType</td>
                <td>指示器的类型，<code>rect</code> 为方块，<code>radius</code>为圆点</td>
                <td>Number</td>
                <td>2000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
