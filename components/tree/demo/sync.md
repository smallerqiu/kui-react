<cn>
#### 异步加载
点击展开节点，动态加载数据。
</cn>

```tsx
import { Tree } from 'react-kui';

const Demo = () => {
  const data = [
    { title: 'Expand to load' },
    { title: 'Expand to load' },
    { title: 'Tree Node', isLeaf: true },
  ]

  const onExpand = (data)=>{
    console.log(data)
  }
  const onLoadData =(node, callback)=> {
    //模拟异步请求
    setTimeout(() => {
      let data = [
        { title: 'Child Node' },
        { title: 'Child Node' }
      ];
      callback(data);
    }, 1000)
  }
  return (
      <Tree data={data} onLoadData={onLoadData} onExpand={onExpand}/>
  )
}
ReactDOM.render(<Demo /> , mountNode)
```