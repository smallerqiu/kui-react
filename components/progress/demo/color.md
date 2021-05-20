<cn>
#### 颜色和格式
自定义颜色和自定义格式。
</cn>

```tsx
import { Progress , Button } from 'react-kui';

class Demo extends React.Component {

  state = {
    percent:0,
    color:''
  } 

  format2 = (percent)=>{
    return percent + '℃'
  }
  format3 = (percent)=>{
    return percent + '升'
  }
  format1 = ()=>{
    let percent = this.state.percent
    if(percent < 30){
      return '空';
    } else if( percent >= 30 && percent < 50 ){
      // this.setState({color:'#bdc78d'})
      return '弱'
    } else if( percent >= 50 && percent < 80 ){
      // this.setState({color:'#c7b98d'})
      return '中'
    } else if( percent >= 80 ){
      // this.setState({color:'#f79e08'})
      return '强'
    }
  }
  increase = ()=> {
    let percent = this.state.percent + 5;
    if (percent > 100) {
      percent = 100;
    }
    this.setState({percent})
    this.changeColor(percent)
  }
 
  decline = ()=> {
    let percent = this.state.percent - 5;
    if (percent < 0) {
      percent = 0;
    }
    this.setState({percent})
    this.changeColor(percent)
  }
  changeColor(percent){
    let {color} = this.state
    if( percent >= 30 && percent < 50 ){
      color = '#bdc78d'
    } else if( percent >= 50 && percent < 80 ){
      color = '#c7b98d'
    } else if( percent >= 80 ){
      color = '#f79e08'
    }
    this.setState({color})
  }
  render(){
    const {percent ,color} = this.state
    return(
      <>
        <Progress percent={percent} format={this.format1} color={color} style={{width:350,marginBottom:30}}/>
        <Progress percent={percent} type="circle" format={this.format2} color={color} />
        <Progress percent={percent} type="dashboard" format={this.format3} color={color} />
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