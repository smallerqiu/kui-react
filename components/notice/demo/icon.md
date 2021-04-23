<cn>
#### 带图标的提醒
通过调用不同的方法，可展示不同的类型
</cn>

```tsx
import { Notice , Button } from 'react-kui';

class Demo extends React.Component {
  render(){
    return(
      <div>
        <Button onClick={()=>this.notice('info')} type="primary">消息提示</Button>
        <Button onClick={()=>this.notice('warning')}>警告提示</Button>
        <Button onClick={()=>this.notice('success')}>成功提示</Button>
        <Button onClick={()=>this.notice('error')} type="danger">错误提示</Button>
      </div>
    )
  }
  notice(type) {
    Notice[type]({
      title: "通知的标题",
      content: "通知的描述",
      duration: 5
    });
  }
}
ReactDOM.render(<Demo />  ,mountNode)
```