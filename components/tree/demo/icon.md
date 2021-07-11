<cn>
#### 自定义图标
可以针对不同的节点定制图标。
</cn>

```tsx
import { Tree} from 'react-kui';

const Demo = () => {
  const expandedKeys = ['0-0', '1-0', '1-1', '1-2']
  const data = [
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
          expand: true,
          key: '1-1',
          icon: 'folder-open-outline',
          children: [
            { title: 'index.html', icon: 'logo-html5' },
            { title: 'index.md', icon: 'logo-markdown' }
          ]
        },
        {
          title: 'app',
          expand: true,
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
  const onExpand = ({ expanded, node })=> {
    node.icon = expanded ? 'folder-open-outline' : 'folder-outline'
  }
  return (
      <Tree data={data} expandedKeys={expandedKeys} onExpand={onExpand} />
  )
}

ReactDOM.render(<Demo /> , mountNode)
```