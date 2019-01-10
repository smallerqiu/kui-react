let code = {}

code.base = `import { Tree } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
    data: [
      {
        title: 'tree 1',
        expand: true,
        children: [
          {
            title: 'tree 1-1',
            expand: true,
            children: [
              { title: 'leaf 1-1-1' },
              { title: 'leaf 1-1-2' }
            ]
          },
          {
            title: 'tree 1-2',
            expand: true,
            children: [
              { title: 'leaf 1-2-1' },
              { title: 'leaf 1-2-2' }
            ]
          }
        ]
      }
    ]
  }
}
ReactDOM.render() {
  return <Tree data={data} />
}
`

code.checked = `import { Tree } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
    data: [
      {
        title: 'tree 1',
        expand: true,
        children: [
          {
            title: 'tree 1-1',
            expand: true,
            children: [
              { title: 'leaf 1-1-1', disabled: true },
              { title: 'leaf 1-1-2' }
            ]
          },
          {
            title: 'tree 1-2',
            expand: true,
            children: [
              {
                title: 'leaf 1-2-1', expand: true, children: [
                  { title: 'leaf 1-2-1-1', },
                  { title: 'leaf 1-2-1-2' }
                ]
              },
              { title: 'leaf 1-2-2' }
            ]
          }
        ]
      }
    ],
  }
}
onChecked(data) {
  console.log(data)
}
ReactDOM.render() {
  return <Tree data={this.state.data} checkbox onChecked={this.onChecked.bind(this)} />
}
`

code.async = `import { Tree } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
    data2: [{
      title: 'children',
      loading: false,
      children: []
    }],
  }
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
  return <Tree data={this.state.data} onLoadData={this.loadData.bind(this)} />
}
`

code.icon = `import { Tree } from 'react-kui';
constructor(props) {
  super(props)
  this.state = {
    data: [
      {
        title: 'tree 1',
        expand: true,
        icon: 'fireball',
        children: [
          {
            title: 'tree 1-1',
            expand: true,
            icon: 'flag',
            children: [
              { title: 'leaf 1-1-1', icon: 'flame' },
              { title: 'leaf 1-1-2', icon: 'folder' }
            ]
          },
          {
            title: 'tree 1-2',
            expand: true,
            icon: 'flag',
            children: [
              { title: 'leaf 1-2-1', icon: 'folder' },
              { title: 'leaf 1-2-2', icon: 'folder' }
            ]
          }
        ]
      }
    ],
  }
}
ReactDOM.render() {
  return <Tree data={this.state.data} />
}`

export default code