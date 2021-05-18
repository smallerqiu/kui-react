<cn>
#### 基本
最简单的用法。
</cn>

```tsx
import { Radio , Button } from 'react-kui';

class Demo extends React.Component {
  state = {
    checked: false
  }
  render(){
    const { checked } = this.state
    return(
      <div>
        <p>{checked.toString()}</p>
        <Radio 
          checked={checked} 
          onChange={(e)=>this.setState({checked:e.target.checked})}
        >Radio</Radio>

        <Button 
          onClick={()=>this.setState({checked:!checked})} 
          size="small"
        >{checked?'Uncheck':'Check'}</Button>
        <br/>
        <br/>
        <Radio label="Radio"/>
      </div>
    )
  }
}
ReactDOM.render(<Demo />,  mountNode)
```