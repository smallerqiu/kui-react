<cn>
#### 位置
通过 `placement`控制方向, 位置有十二个方向。
</cn>

```tsx
import { Tooltip , Button } from 'react-kui';

const text = '明月几时有,把酒问青天 !'

const title = <div>
        <p>{text}</p>
        <p>{text}</p>
      </div>

ReactDOM.render(
  <>
    <div style={{marginLeft:70,whiteSpace: 'nowrap'}}>
      <Tooltip title={title} placement="top-left">
        <Button>TL</Button>
      </Tooltip>
      <Tooltip title={title} placement="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip title={title} placement="top-right">
        <Button>TR</Button>
      </Tooltip>
    </div>
    <div style={{float:'left',height:125,width:70}}>
      <Tooltip title={title} placement="left-top">
        <Button>LT</Button>
      </Tooltip>
      <Tooltip title={title} placement="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip title={title} placement="left-bottom">
        <Button>LB</Button>
      </Tooltip>
    </div>
    <div style={{marginLeft:310,height:125,width:70}}>
      <Tooltip title={title} placement="right-top">
        <Button>RT</Button>
      </Tooltip>
      <Tooltip title={title} placement="right">
        <Button>Right</Button>
      </Tooltip>
      <Tooltip title={title} placement="right-bottom">
        <Button>RB</Button>
      </Tooltip>
    </div>
    <div style={{marginLeft:70,whiteSpace: 'nowrap'}}>
      <Tooltip title={title} placement="bottom-left">
        <Button>BL</Button>
      </Tooltip>
      <Tooltip title={title} placement="bottom" >
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip title={title} placement="bottom-right" >
        <Button>BR</Button>
      </Tooltip>
    </div>
  </>,
  mountNode
)
```