<cn>
#### 尺寸
`large` 为大尺寸， `small` 为小尺寸
</cn>

```tsx
import { Input ,Message } from 'react-kui';

ReactDOM.render(
  <div style={{width:512}}>
    <Input placeholder="Large Input" size="large" icon="logo-apple" clearable/>
    <Input placeholder="Base Input" icon="logo-apple" clearable />
    <Input 
      size="small" 
      placeholder="Small Input" 
      icon="logo-apple" 
      onIconClick={()=>Message.info('点击图标事件')} clearable />
  </div>,
  mountNode
)
```