<cn>
#### 提示框
全局的确认提示框，可以异步关闭
</cn>

```tsx
import { Modal , Message, Button } from 'react-kui';

class Demo extends React.Component {
  confirm = ()=> {
    Modal.confirm({
      title: '您确认要这么做吗',
      content: '此操作不可逆转，谨慎！！！',
      onOk: () => {
        Message.success('你点了确认')
      },
      onCancel: () => {
        Message.info('你点了取消')
      }
    })
  }
  custom = ()=> {
    Modal.confirm({
      title: 'Are you Ok?',
      content: 'Yes , I am fine, and you?',
      okText: 'OK',
      cancelText: 'Cancel'
    })
  }
  Async = ()=> {
    Modal.confirm({
      title: '您确认要这么做吗',
      content: '此操作不可逆转，谨慎！！！',
      onOk: () => {
        return new Promise((resolve , reject)=>{
          setTimeout(resolve,2000)
        })
      },
      onCancel: () => {
        //用户点了取消 应该中断 异步执行
        clearTimeout(this.timer)
      }
    })
  }
  closeAll = ()=> {
    for(var o = 0; o < 3; o++){
      setTimeout(e=>{
        Modal.confirm({
          content:'Close All',
          cancelText:'Close All',
          onCancel: () => {
            Modal.destroyAll()
          },
          onOk:()=>{
            return new Promise((resolve , reject)=>{
              setTimeout(resolve,2000)
            })
          }
        })
      },o*500)
    }
  }
  render(){
    return(
      <div>
        <Button onClick={this.confirm}>标准调用</Button>
        <Button onClick={this.custom}>国际化</Button>
        <Button onClick={this.Async}>异步关闭</Button>
        <Button onClick={this.closeAll}>Close All</Button>
      </div>
    )
  }
}
ReactDOM.render(<Demo />  ,mountNode)
```