
<cn>
#### 基础用法
`Notice` 的基本用法
</cn>

```ts
import { Notice , Button } from 'react-kui';

class Demo extends React.Component {
  render(){
    return(
      <div>
        <Button onClick={this.info} type="primary">普通提示</Button>
      </div>
    )
  } 
  info() {
    Notice.open({
      title: "通知的标题",
      content: "通知的描述",
      duration: 5
    })
  }
}
ReactDOM.render(<Demo />  ,mountNode)
```