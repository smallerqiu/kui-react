<cn>
#### 国际化
使用 `okText` 和 `cancelText` 自定义按钮文字。
</cn>


```tsx
import { Popconfirm ,Button, Message } from 'react-kui';

class Demo extends React.Component {
  ok =()=>{
    Message.success('Clicked on ok')
  }
  cancel= ()=>{
    Message.info('Clicked on cancel')
  }

  render(){
    return(
      <>
        <Popconfirm 
          title="Are you sure delete this task?"
          onOk={this.ok}
          onCancel={this.cancel}
        >
          <Button type="primary">确认</Button>
        </Popconfirm>
        <Popconfirm title="Are you sure delete this task?"
          ok-text="Yes"
          cancel-text="No"
          onOk={this.ok}
          onCancel={this.cancel}
          >
          <Button type="primary">Confirm</Button>
        </Popconfirm>
      </>
    )
  }
}
ReactDOM.render(<Demo /> , mountNode)
```