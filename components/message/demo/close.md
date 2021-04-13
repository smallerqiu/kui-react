<cn>
#### 自定义时长
可以自定义配置，其中 `duration` 来控制自动关闭时长,默认 `3s` , `closable` 显示关闭按钮
</cn>

```ts
import { Message , Button } from 'react-kui';
let count = 0
class Demo extends React.Component {
  config() {
    Message.success("10秒后关闭", 10);
  }
  config2() {
    Message.config({
      type: "info",
      duration: 5,
      content: "5秒后关闭"
    });
  }
  config3() {
    Message.config({
      type: "info",
      duration: 0,
      closable: true,
      content: "手动关闭",
      // close: () => { Message.success("我是回调"); }
    });
  }
  render(){
    return(
      <div>
        <Button onClick={this.config}>10秒后关闭</Button>
        <Button onClick={this.config2} type="primary">5秒后关闭</Button>
        <Button onClick={this.config3} type="primary">手动关闭</Button>
      </div>
    )
  }
}
ReactDOM.render(<Demo />  ,mountNode)
```