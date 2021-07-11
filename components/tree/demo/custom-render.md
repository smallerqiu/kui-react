<cn>
#### 自定义节点内容
节点的内容支持自定义，可以在节点区添加按钮或图标等内容，渲染方式为 `render`。
</cn>

```tsx
import { Tree , Row , Col , Divider ,Button , TreeNode } from 'react-kui';

class Demo extends React.Component {
  state = {
    expandedKeys: ['0-0'],
    data: [
      {
        title: 'tree 1',
        key: '0-0',
        children: [
          {
            title: 'tree 1-1',
            children: [
              { title: 'leaf 1-1-1' },
              {
                title: 'leaf 1-1-2',
                children: [
                  { title: 'leaf 1-1-2-1' },
                  { title: 'leaf 1-1-2-2' }
                ]
              }
            ]
          },
          {
            title: 'tree 1-2',
            children: [
              { title: 'leaf 1-2-1' },
              { title: 'leaf 1-2-2' }
            ]
          },
          {
            title: 'tree 1-3',
            children: [
              { title: 'leaf 1-3-1' },
              { title: 'leaf 1-3-2' }
            ]
          }
        ]
      },
      {
        title: 'tree 2-1',
        children: [
          { title: 'leaf 2-1-1' },
          { title: 'leaf 2-1-2' }
        ]
      }
    ]
  }
  append = (node) => {
    let { expandedKeys } = this.state
    if (!node.children) {
      node.children = []
    }
    //展开节点
    if (expandedKeys.indexOf(node.key) < 0) {
      expandedKeys.push(node.key)
      this.setState({ expandedKeys })
    }
    //添加子节点
    const newChild = {
      title: 'Append Node', children: [],
      key: node.key + '_' + (node.children.length)
    };
    node.children.push(newChild);
    this.setState({ data: this.state.data })
  }
  remove = (node, parent) => {
    if (parent) {
      let { data } = this.state
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
      loop(data, node.key, (item, index, arr) => {
        arr.splice(index, 1);
        this.setState({ data: data })
      })

      
      // let items = parent.children || parent //一级直接返回根节点数据
      // let index = items.findIndex(item => item == node)
      // index > -1 && items.splice(index, 1)
      // this.setState({ data: data })
    }
  }
  expand = ({ expandedKeys, expanded, node }) => {
    this.setState({ expandedKeys })
  }

  render() {
    const { data, expandedKeys } = this.state
    const extra = ({ node, parent }) => {
      return (
        <>
          <Button icon="add" size="small" onClick={() => this.append(node)} style={{ marginRight: 5 }} />
          {node.key != '0-0' ? <Button icon="remove" size="small" onClick={() => this.remove(node, parent)} /> : null}
        </>
      )
    }
    return (
      <Row gutter={30}>
        <Col span={8}>
          <Divider>默认</Divider>
          <Tree data={data} onExpand={this.expand} expandedKeys={expandedKeys} extra={extra} />
        </Col>
        <Col span={8} style={{ borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>
          <Divider>自定义</Divider>
          <Tree
            data={data}
            onExpand={this.expand}
            expandedKeys={expandedKeys}
            extra={extra}
            title={
              ({ node, parent }) => {
                return node.title + ' 😄'
              }
            }
          />
        </Col>
        <Col span={8}>
          <Divider>使用 tree-node</Divider>
          <Tree onExpand={this.expand} expandedKeys={expandedKeys} extra={extra} >
            {
              data.map((item, i) => {
                return (<TreeNode data={item} key={item.key || i} />)
              })
            }
          </Tree>
        </Col>
      </Row>
    )
  }
}

ReactDOM.render(<Demo /> , mountNode)
```