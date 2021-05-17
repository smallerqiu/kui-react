<cn>
#### 事件
本示例测试组件事件是否正常触发
</cn>

```tsx
import { Input , TextArea ,Message} from 'react-kui';

 
class Demo extends React.Component {
  
  componentDidMount(){
    ['focus','blur','change','keypress','keyup','keydown'].map(type=>{
    this[type] = (e)=>{
      Message.info(type)
    }
  })
  }
  render(){
    return(
      <div>
        <Input placeholder="请输入内容..." 
        clearable
        onChange={()=> this.change()} 
        onKeyPress={()=> this.keypress()} 
        onKeyUp={()=> this.keyup()} 
        onKeyDown={()=> this.keydown()} 
        onBlur={()=> this.blur()} 
        onFocus={()=> this.focus()} >
        </Input>
        <TextArea placeholder="请输入内容..."
          onChange={()=> this.change()} 
          onKeyPress={()=> this.keypress()} 
          onKeyUp={()=> this.keyup()} 
          onKeyDown={()=> this.keydown()} 
          onBlur={()=> this.blur()} 
          onFocus={()=> this.focus()} 
        />
      </div>
    )
  }
}
ReactDOM.render(<Demo />,  mountNode)
```