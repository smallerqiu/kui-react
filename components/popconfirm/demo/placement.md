<cn>
#### 位置
通过 `placement`控制方向, 位置有十二个方向。
</cn>

```tsx
import { Popconfirm , Button } from 'react-kui';

const title = '删除不可恢复,你确定要执行操作吗?'

ReactDOM.render(
  <>
    <div style={{marginLeft:70,whiteSpace: 'nowrap'}}>
      <Popconfirm title={title} placement="top-left">
        <Button>TL</Button>
      </Popconfirm>
      <Popconfirm title={title} placement="top">
        <Button>Top</Button>
      </Popconfirm>
      <Popconfirm title={title} placement="top-right">
        <Button>TR</Button>
      </Popconfirm>
    </div>
    <div style={{float:'left',height:125,width:70}}>
      <Popconfirm title={title} placement="left-top">
        <Button>LT</Button>
      </Popconfirm>
      <Popconfirm title={title} placement="left">
        <Button>Left</Button>
      </Popconfirm>
      <Popconfirm title={title} placement="left-bottom">
        <Button>LB</Button>
      </Popconfirm>
    </div>
    <div style={{marginLeft:310,height:125,width:70}}>
      <Popconfirm title={title} placement="right-top">
        <Button>RT</Button>
      </Popconfirm>
      <Popconfirm title={title} placement="right">
        <Button>Right</Button>
      </Popconfirm>
      <Popconfirm title={title} placement="right-bottom">
        <Button>RB</Button>
      </Popconfirm>
    </div>
    <div style={{marginLeft:70,whiteSpace: 'nowrap'}}>
      <Popconfirm title={title} placement="bottom-left">
        <Button>BL</Button>
      </Popconfirm>
      <Popconfirm title={title} placement="bottom" >
        <Button>Bottom</Button>
      </Popconfirm>
      <Popconfirm title={title} placement="bottom-right" >
        <Button>BR</Button>
      </Popconfirm>
    </div>
  </>,
  mountNode
)
```