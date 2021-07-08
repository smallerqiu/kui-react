<cn>
#### 带图标
通过设置 `icon` 属性，可设置输入框图标，只对 `input` 有效。可以快速的实现 ，密码显示隐藏，搜索
</cn>

```tsx
import { Input ,Message,  } from 'react-kui';

class Demo extends React.Component {
  search =()=> {
    Message.info("This is search event");
  }

  render(){
    return(
      <div style={{width:512}}>
        <Input placeholder="User Name..." icon="person" />
        <Input type="password" placeholder="Password..." icon="lock-closed"  />
        <Input placeholder="请输入关进行搜索键字..."  onSearch={()=>this.search()}/>
      </div>
    )
  }
}
ReactDOM.render(<Demo />,  mountNode)
```