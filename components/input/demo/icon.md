<cn>
#### 带图标
通过设置 `icon` 属性，可设置输入框图标，只对 `input` 有效。可以快速的实现 ，密码显示隐藏，搜索
</cn>

```tsx
import { Input ,Message, Tooltip,Icon } from 'react-kui';

class Demo extends React.Component {
  state = {
    time:60,
  }
  search =()=> {
    Message.info("This is search event");
  }

  timer = null

  sendCode =()=> {
    Message.success("验证码发送成功，请注意查收");
    this.timer = setInterval(e=>{
        let {time} = this.state
        if(time < 0){
          clearInterval(this.timer)
          this.setState({time:60})
        }else{
          this.setState({time:time-1})
        }
    },1000)
  }
  render(){
    const {time} = this.state
    return(
      <div style={{width:512}}>
        <Input placeholder="User Name..." icon="person" />
        <Input type="password" placeholder="Password..." icon="lock-closed"  />
        <Input 
          suffix= {
           time==60 ? <span onClick={()=> this.sendCode()}>获取验证码</span>:
            <span>{time}(s)</span>
          }
          placeholder="请输入验证码" 
          icon="disc"  
          maxlength="8" />
        <Input 
          suffix= {
            <Tooltip title="此处如果不知道怎么填，请咨询管理员">
              <Icon type="information-circle-outline" color="orange"/>
            </Tooltip>  
          }
          placeholder="请填写你要喝的Coffee" 
          icon="cafe" />
        <Input placeholder="请输入关进行搜索键字..."  onSearch={()=>this.search()}/>
      </div>
    )
  }
}
ReactDOM.render(<Demo />,  mountNode)
```