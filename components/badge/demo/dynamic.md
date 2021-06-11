<cn>
#### 可控
动态控制
</cn>

```tsx
import { Switch , Badge , Button , Icon } from 'react-kui';

const Demo = ()=> {
  const [show,setShow] = React.useState(true)
  const [count,setCount] = React.useState(15)
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
      <Switch onChange={setShow} checked={show}/>
      <br/>
      <br/>
      <Badge count={count} maxCount={20}>
        <div className="box"></div>
      </Badge>
      <Button.Group circle>
        <Button onClick={()=>setCount(count-1)}>-</Button>
        <Button onClick={()=>setCount(count+1)}>+</Button>
      </Button.Group>
    </div>
  )
}
ReactDOM.render(<Demo />,  mountNode)
```