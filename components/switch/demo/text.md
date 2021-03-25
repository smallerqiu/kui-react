<cn>
#### 文字 / 图标
通过 `trueText` 和 `falseText` 设置选中和非选中呈现文字, 通过设置 `slot` 为 `(checked|unchecked)` 控制内容
</cn>

```ts
import { Switch , Icon } from 'react-kui';

class Demo extends React.Component {
  render(){
    return(
      <div>
        <Switch trueText="Yes" falseText="No" />
        <br />
        <Switch trueText="1" falseText="0" />
        <br />
        <Switch trueText="On" falseText="Off" />
        <br />
        <br />
        <Switch 
          checkedChildren={<Icon type="checkmark" />}
          uncheckedChildren={<Icon type="close" />}
        />
    
        <Switch
          checkedChildren={<Icon type="logo-apple" />}
          uncheckedChildren={<Icon type="logo-windows" />}
        />
        <Switch
          checkedChildren={<Icon type="airplane" />}
          uncheckedChildren={<Icon type="wifi" />}
        />
      </div>
    )
  }
}
ReactDOM.render(<Demo />,  mountNode)
```