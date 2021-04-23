<cn>
#### 普通提示
信息提醒反馈。
</cn>

```tsx
import { Message , Button } from 'react-kui';
let count = 0
class Demo extends React.Component {
  info() {
    count++
    Message.info("this is a base message number : "+count);
  }
  render(){
    return(
      <div>
        <Button onClick={this.info} type="primary">Show base info </Button>
      </div>
    )
  }
}
ReactDOM.render(<Demo />  ,mountNode)
```