<cn>
#### 群控
展示目录、连接线、拖动、复选框、图标、扩展。
</cn>

```tsx
import { Tree , Icon , Checkbox } from 'react-kui';

class Demo extends React.Component {

  /* const Demo = () => {
  
    const [directory, setDirectory] = React.useState(true)
    const [showLine, setShowLine] = React.useState(true)
    const [showIcon, setShowIcon] = React.useState(true)
    const [draggable, setDraggable] = React.useState(true)
    const [checkable, setCheckable] = React.useState(true)
    const [showExtra, setShowExtra] = React.useState(true)
  
    const selectedKeys = ['0-0'] 
    const[treeData, setTreeData] = React.useState(data)
    const[expandedKeys, setExpandedKeys] = React.useState(['0-0', '1-0', '1-1', '1-2'])
    */

  state = {
    directory: true,
    showLine: true,
    showIcon: true,
    draggable: true,
    checkable: true,
    showExtra: true,
    selectedKeys: ['0-0'],
    expandedKeys: ['0-0', '1-0', '1-1', '1-2'],
    treeData: [
      {
        title: 'src',
        key: '0-0',
        icon: 'folder-open-outline',
        children: [
          {
            title: 'assets',
            key: '1-0',
            icon: 'folder-open-outline',
            children: [
              { title: 'main.js', icon: 'logo-javascript', disabled: true },
              { title: 'test.py', icon: 'logo-python' }
            ]
          },
          {
            title: 'pages',
            key: '1-1',
            icon: 'folder-open-outline',
            children: [
              { title: 'index.html', icon: 'logo-html5' },
              { title: 'index.md', icon: 'logo-markdown' }
            ]
          },
          {
            title: 'app',
            key: '1-2',
            icon: 'folder-open-outline',
            children: [
              { title: 'zen.apk', icon: 'logo-windows' },
              { title: 'zen.ipa', icon: 'logo-apple' }
            ]
          }
        ]
      }
    ]
  }

  edit = (e, node) => {
    e.stopPropagation()
    let pop = prompt('修改节点名称', node.title)
    if (pop) {
      node.title = pop
      let { treeData } = this.state
      this.setState({ treeData })
    }
  }
  append = (e, node) => {
    e.stopPropagation()
    if (!node.children) {
      node.children = []
    }

    //添加子节点
    const newChild = {
      title: 'Append Node', children: [],
      key: node.key + '_' + (node.children.length)
    };
    node.children.push(newChild);
    let { expandedKeys } = this.state
    //展开节点
    if (expandedKeys.indexOf(node.key) < 0) {
      expandedKeys.push(node.key)
    }

    this.setState({ expandedKeys })
  }
  remove = (e, node, parent) => {
    e.stopPropagation()
    // if (parent) {
    //   const index = parent.findIndex(item => item == node);
    //   parent.splice(index, 1);
    // }

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    let { treeData } = this.state
    loop(treeData, node.key, (item, index, arr) => {
      arr.splice(index, 1);
      this.setState({ treeData })
    })
  }
  onExpand = ({ expanded, node, expandedKeys }) => {
    node.icon = expanded ? 'folder-open-outline' : 'folder-outline'
    console.log(node)
  }

  setDirectory = (directory) => this.setState({ directory })
  setShowLine = (showLine) => this.setState({ showLine })
  setDraggable = (draggable) => this.setState({ draggable })
  setCheckable = (checkable) => this.setState({ checkable })
  setShowIcon = (showIcon) => this.setState({ showIcon })
  setShowExtra = (showExtra) => this.setState({ showExtra })

  onDrop = () => {
    // this.setState({ data: data })
  }
  render() {
    let { directory, showLine, draggable, checkable, showIcon,
      showExtra, selectedKeys, expandedKeys, treeData } = this.state

    const extraNode = ({ node, parent }) => {
      return (
        <>
          <Icon type="add-outline" onClick={e => this.append(e, node)} style={{ marginRight: 5 }} />
          {node.key != '0-0' ? <Icon type="trash-outline" onClick={e => this.remove(e, node, parent)} style={{ marginRight: 5 }} /> : null}
          <Icon type="pencil-outline" onClick={e => this.edit(e, node)} />
        </>
      )
    }
    return (
      <div >
        <Checkbox checked={directory} label="Directory" onChange={e => this.setDirectory(e.target.checked)} />
        <Checkbox checked={showLine} label="showLine" onChange={e => this.setShowLine(e.target.checked)} />
        <Checkbox checked={draggable} label="Draggable" onChange={e => this.setDraggable(e.target.checked)} />
        <Checkbox checked={checkable} label="Checkable" onChange={e => this.setCheckable(e.target.checked)} />
        <Checkbox checked={showIcon} label="ShowIcon" onChange={e => this.setShowIcon(e.target.checked)} />
        <Checkbox checked={showExtra} label="ShowExtra" onChange={e => this.setShowExtra(e.target.checked)} />
        <br />
        <br />
        <Tree data={treeData}
          style={{ width: 512 }}
          onExpand={this.onExpand}
          directory={directory}
          draggable={draggable}
          checkable={checkable}
          showLine={showLine}
          showIcon={showIcon}
          showExtra={showExtra}
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          extra={extraNode}
          onDrop={this.onDrop}
        />
      </div >
    )
  }
}

ReactDOM.render(<Demo /> , mountNode)
```