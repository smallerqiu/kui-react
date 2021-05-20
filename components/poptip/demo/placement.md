<cn>
#### 位置
通过 `placement`控制方向, 位置有十二个方向。
</cn>

```tsx
import { Poptip , Button } from 'react-kui';

const title = '标题'
const tip = '明月几时有,把酒问青天!'

const content = <div>
        <p>{tip}</p>
        <p>{tip}</p>
      </div>

ReactDOM.render(
  <>
  <div style={{marginLeft:70,whiteSpace: 'nowrap'}}>
    <Poptip title={title} content={content} placement="top-left">
      <Button>TL</Button>
    </Poptip>
    <Poptip title={title} content={content} placement="top">
      <Button>Top</Button>
    </Poptip>
    <Poptip title={title} content={content} placement="top-right">
      <Button>TR</Button>
    </Poptip>
  </div>
  <div style={{float:'left',height:125,width:70}}>
    <Poptip title={title} content={content} placement="left-top">
      <Button>LT</Button>
    </Poptip>
    <Poptip title={title} content={content} placement="left">
      <Button>Left</Button>
    </Poptip>
    <Poptip title={title} content={content} placement="left-bottom">
      <Button>LB</Button>
    </Poptip>
  </div>
  <div style={{marginLeft:310,height:125,width:70}}>
    <Poptip title={title} content={content} placement="right-top">
      <Button>RT</Button>
    </Poptip>
    <Poptip title={title} content={content} placement="right">
      <Button>Right</Button>
    </Poptip>
    <Poptip title={title} content={content} placement="right-bottom">
      <Button>RB</Button>
    </Poptip>
  </div>
  <div style={{marginLeft:70,whiteSpace: 'nowrap'}}>
    <Poptip title={title} content={content} placement="bottom-left">
      <Button>BL</Button>
    </Poptip>
    <Poptip title={title} content={content} placement="bottom" >
      <Button>Bottom</Button>
    </Poptip>
    <Poptip title={title} content={content} placement="bottom-right" >
      <Button>BR</Button>
    </Poptip>
  </div>
  </>,
  mountNode
)
```