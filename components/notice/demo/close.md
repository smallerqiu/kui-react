<cn>
#### 自定义时长
可以自定义配置，其中 `duration` 来控制自动关闭时长,默认 `3s`
</cn>

```ts
import { Notice , Button ,Message } from 'react-kui';

class Demo extends React.Component {
  render(){
    return(
      <div>
        <Button onClick={this.config}>10秒后关闭</Button>
        <Button onClick={this.config2} type="primary">5秒后关闭</Button>
        <Button onClick={this.config3} type="primary">手动关闭</Button>
      </div>
      )
    }
    config() {
      Notice.open({
        type: "success",
        duration: 10,
        title:'温馨提示',
        content: "10秒后关闭"
      });
    }
    config2() {
      Notice.open({
        type: "info",
        duration: 5,
        title:'温馨提示',
        content: "5秒后关闭"
      });
    }
    config3() {
      Notice.open({
        type: "info",
        duration: 0,
        title:'温馨提示',
        content: "手动关闭",
        close: () => { Message.success("我是回调"); }
      });
    }
}
ReactDOM.render(<Demo />  ,mountNode)
```