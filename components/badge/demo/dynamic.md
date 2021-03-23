<cn>
#### 可控
动态控制
</cn>

```ts
import { Switch , Badge , Button , Icon } from 'react-kui';

class Demo extends React.Component {
  state = {
    show:true,
    count:15
  }
  render(){
    let { show ,count } = this.state
    return(
      <div className="demo-badge">
        <Badge dot={show}>
          <div className="box"></div>
        </Badge>
        <Badge dot={show}>
          <Icon type="notifications-outline" />
        </Badge>
        <Badge dot={show}>
          <a href="#">我是一个连接</a>
        </Badge>
        <Switch onChange={()=>this.setState({show:!show})} />
        <br/>
        <br/>
        <Badge count={count} maxCount={20}>
          <div className="box"></div>
        </Badge>
        <Button.Group circle>
          <Button onClick={()=>this.setState({count:count-1})}>-</Button>
          <Button onClick={()=>this.setState({count:count+1})}>+</Button>
        </Button.Group>
      </div>
    )
  }
}
ReactDOM.render(<Demo />,  mountNode)
```