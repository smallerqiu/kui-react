let code = {}

code.base = `import { TreeSelect } from 'react-kui';
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
  }
}
ReactDOM.render() {
  return <TreeSelect data={this.state.data} />
}`

code.async = `import { TreeSelect } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
    data: [{
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
    let data = [
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
    this.setState({data})
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
ReactDOM.render() {
  return <TreeSelect data={this.state.data} clearable queryable 
            onQueryChange={this.queryChange.bind(this)} 
            onLoadData={this.loadData.bind(this)} />
}`

code.callback = `import { TreeSelect } from 'react-kui';
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
  }
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
ReactDOM.render() {
  return <TreeSelect data={data} onChange={this.onChange.bind(this)} />
}`

export default code