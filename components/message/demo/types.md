<cn>
#### 提示类型
通过 `type` 来设置提示类型
</cn>

```ts
import { Message , Button } from 'react-kui';
let count = 0
class Demo extends React.Component {
  render(){
    return(
      <div>
        <Button onClick={this.warning}>Warning </Button>
        <Button onClick={this.success}>Success </Button>
        <Button onClick={this.error} type="danger">Error</Button>
      </div>
    )
  }
  warning() {
    Message.warning("警告提示");
  }
  success() {
    Message.success("成功提示");
  }
  error() {
    Message.error("错误提示");
  }
}
ReactDOM.render(<Demo />  ,mountNode)
```