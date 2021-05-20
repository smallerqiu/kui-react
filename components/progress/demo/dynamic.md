<cn>
#### 动态展示
会动的进度条才是好进度条。
</cn>

```tsx
import { Progress, Button } from 'react-kui';

class Demo extends React.Component {

  state = {
    percent: 10
  } 

  increase = ()=> {
    let percent = this.state.percent + 5;
    if (percent > 100) {
      percent = 100;
    }
    this.setState({percent})
  }

  decline = ()=> {
    let percent = this.state.percent - 5;
    if (percent < 0) {
      percent = 0;
    }
    this.setState({percent})
  }
  
  render(){
    const {percent} = this.state
    return(
      <>
        <Progress percent={percent} style={{width:350,marginBottom:30}}/>
        <Progress percent={percent} type="circle"/>
        <Progress percent={percent} type="dashboard" />
        <br/>
        <Button.Group circle>
          <Button onClick={this.decline} icon="remove" />
          <Button onClick={this.increase} icon="add"/>
        </Button.Group>
      </>
    )
  }
}
ReactDOM.render(<Demo /> , mountNode)
```