import React from 'react'
import { Row, Col, TreeSelect ,Message} from '@/index'
import Demo from '../components/demo'
import code from '../code/treeselect'
export default class treeselect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [
        {
          title: '商品分类',
          expand: true,
          value: '001',
          children: [
            {
              title: '手机',
              expand: true,
              value: '002',
              children: [
                { title: 'Iphone 8' },
                { title: 'Iphone X' }
              ]
            },
            {
              title: '电脑',
              expand: true,
              value: '003',
              children: [
                { title: 'MacPro' },
                { title: '小米Pro' }
              ]
            }
          ]
        }
      ],
      data1: [{
        title: '商品分类',
        expand: false,
        loading: false,
        children: []
      }]
    }
  }
  queryChange(value) {
    let phones = ['iphone4', 'iphone4s', 'iphone5', 'iphone5s', 'iphone6', 'iphone6s', 'iphone7', 'iphone8', 'iphone X', '华为P20',]
    let computers = ['mac pro', '戴尔E50', '联想600', '宏基S40', '联想小新', '小米air', 'mac air', 'suffice',]
    //模拟异步请求
    setTimeout(() => {
      let data1 = [
        {
          title: '商品分类',
          expand: true,
          children: [
            {
              title: '手机',
              expand: true,
              children: [
                { title: phones[parseInt(Math.random() * 10)], loading: false, },
                { title: phones[parseInt(Math.random() * 10)], loading: false, }
              ]
            },
            {
              title: '电脑',
              expand: true,
              children: [
                { title: computers[parseInt(Math.random() * 10)], loading: false, },
                { title: computers[parseInt(Math.random() * 10)], loading: false, }
              ]
            }
          ]
        }
      ]
      this.setState({data1})
    }, 1000)
  }
  loadData(item, callback) {
    //模拟异步请求
    setTimeout(() => {
      let data = [
        {
          title: 'children',
          loading: false,
          children: []
        },
        {
          title: 'children',
          loading: false,
          children: []
        }
      ];
      callback(data);
    }, 1000)
  }
  onChange(item, callback) {
    if (item.value == '001') {
      Message.error('不能选择根目录');
      return callback(true)
    }
    if (item.title == 'Iphone 8') {
      Message.error('不能选择Iphone 8');
      return callback(true)
    }
    callback(false)
  }
  render() {
    let { data, data1 } = this.state
    return (<div>
      <h2>TreeSelect 树选择</h2>
      <p>类似 Select 的选择控件，可选择的数据结构是一个树形结构时，可以使用 TreeSelect，例如公司层级、学科系统、分类目录等等。</p>
      <h3>代码示例</h3>
      <Row gutter="8">
        <Col span="12">
          <Demo title="基本用法">
            <div>
              <TreeSelect data={data} />
            </div>
            <div>
            <code>data</code>指定Tree的值</div>
            <div>{code.base}</div>
          </Demo>
          <Demo title="选择和回调">
            <div>
              <TreeSelect data={data} onChange={this.onChange.bind(this)} />
            </div>
            <div>通过
            <code>change</code>来确认选中值</div>
            <div>{code.callback}</div>
          </Demo>
        </Col>
        <Col span="12">
          <Demo title="异步和搜索">
            <div>
              <TreeSelect data={data1} clearable queryable onQueryChange={this.queryChange.bind(this)} onLoadData={this.loadData.bind(this)} />
            </div>
            <div>Tree的一步加载和组件
            <code>Tree</code>用法一样</div>
            <div>{code.async}</div>
          </Demo>
        </Col>
      </Row>
      <h3>TreeSelect API</h3>
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
              <td>data</td>
              <td>可嵌套的节点属性的数组，生成 tree 的数据</td>
              <td>Array</td>
              <td>[]</td>
            </tr>
            <tr>
              <td>vlaue</td>
              <td>Tree选中的value值</td>
              <td>String, Number</td>
              <td>-</td>
            </tr>
            <tr>
              <td>label</td>
              <td>默认显示文字，Tree选中的标题</td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>placeholder</td>
              <td>默认提示文字</td>
              <td>String</td>
              <td>请选择</td>
            </tr>
            <tr>
              <td>clearable</td>
              <td>是否显示清空按钮</td>
              <td>Bolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>queryable</td>
              <td>是否显示查询输入框</td>
              <td>Bolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>queryPlaceholder</td>
              <td>搜索框提示文字</td>
              <td>String</td>
              <td>请输入关键字查询</td>
            </tr>
            <tr>
              <td>onLoadData</td>
              <td>异步加载数据的方法</td>
              <td>Function</td>
              <td>-</td>
            </tr>
            <tr>
              <td>onQueryChange</td>
              <td>搜索查询回调</td>
              <td>Function</td>
              <td>-</td>
            </tr>
            <tr>
              <td>onChange</td>
              <td>节点选中回调</td>
              <td>Function</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>)
  }
}