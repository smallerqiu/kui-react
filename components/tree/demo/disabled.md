<cn>
#### 禁用节点
设置属性 `disabled` 可以禁用节点。
</cn>

```tsx
import { Tree} from 'react-kui';

const Demo = () => {
  const expandedKeys = ['0-0', '1-0', '1-1']
  const checkedKeys = ['1-0-0']
  const data = [
    {
      title: 'tree 1',
      key: '0-0',
      children: [
        {
          title: 'leaf 1-1',
          key: '1-0',
          disabled: true,
          children: [
            { title: 'leaf 1-1-1',key:'1-0-0', disabled: true },
            { title: 'leaf 1-1-2' }
          ]
        },
        {
          title: 'leaf 1-2',
          key: '1-1',
          children: [
            { title: 'leaf 1-2-1' },
            { title: 'leaf 1-2-2' }
          ]
        }
      ]
    }
  ]
  const onCheck = (data)=> {
    console.log(data)
  }
  return (
      <Tree data={data} 
      checkable 
      onCheck={onCheck}
      checkedKeys={checkedKeys} 
      expandedKeys={expandedKeys} />
  )
}

ReactDOM.render(<Demo /> , mountNode)
```