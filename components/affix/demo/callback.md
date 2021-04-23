<cn>
#### 固定状态改变的回调 
可以获得是否固定的状态。
</cn>

```tsx
import { Affix , Message , Button } from 'react-kui';
class Demo extends React.Component {
  change(value){
    Message.info(value?'fixed':'reset')
  }
  render(){
    return(
      <Affix onChange={this.change} offsetTop={200}>
        <Button type="primary">200px to affix top</Button>
      </Affix>
    )
  }
}
ReactDOM.render(<Demo />  ,mountNode)
```