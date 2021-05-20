<cn>
#### 基础用法
最简单的用法。
</cn>

```tsx
import { Popconfirm , Message } from 'react-kui';

class Demo extends React.Component {
  ok = ()=>{
    Message.success('Clicked on ok')
  }
  cancel = ()=>{
    Message.info('Clicked on cancel')
  }

  render(){
    return(
      <Popconfirm 
        title="Are you sure delete this task?"
        onOk={this.ok}
        onCancel={this.cancel}
      >
        <a type="primary">Delete</a>
      </Popconfirm>
    )
  }
}
ReactDOM.render(<Demo /> , mountNode)
```