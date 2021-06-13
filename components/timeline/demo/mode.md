<cn>
#### 呈现方向
指定 `mode` 可以改变呈现方向
</cn>

```tsx
import { TimeLine ,Radio} from 'react-kui';

const Demo = ()=> {
  const [mode,setMode] = React.useState('right')
  
  return(
    <div>
      <Radio.Group value={mode} onChange={setMode}>
        <Radio label="left" value="left" />
        <Radio label="center" value="center" />
        <Radio label="right" value="right" />
      </Radio.Group>
      <br />
      <br />
      <TimeLine mode={mode}>
        <TimeLine.Item color="green">优化成吨的改善和体验</TimeLine.Item>
        <TimeLine.Item color="orange">新增一些很友好的功能</TimeLine.Item>
        <TimeLine.Item icon="ribbon">发布2.0版本</TimeLine.Item>
        <TimeLine.Item icon="bug" color="red">修复bug</TimeLine.Item>
        <TimeLine.Item>发布1.0版本</TimeLine.Item>
      </TimeLine>
    </div>
  )
}

ReactDOM.render(<Demo /> , mountNode)
```