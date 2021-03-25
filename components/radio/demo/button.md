<cn>
#### 组合Button使用
结合 `RadioGroup`,`RadioButton` 可以组合使用
</cn>

```ts
import { Radio , Button } from 'react-kui';

class Demo extends React.Component{
  state = {
    large:'wuhan',
    base:'shanghai',
    sm:'beijing',
    options:[
      {label:'Beijing',value:'beijing',icon:'logo-apple'},
      {label:'Shanghai',value:'shanghai'},
      {label:'Shenzhen',value:'shenzhen'},
      {label:'Guangzhou',value:'guangzhou',disabled:true},
      {label:'Wuhan',value:'wuhan'},
    ]
  }
  render(){
    const {large ,base ,sm ,options} =this.state
    return(
      <div>
        <Radio.Group 
          onChange={large=> this.setState({large})}
          value={large} 
          size="large">
          <Radio.Button value="beijing" icon="logo-apple">Beijing</Radio.Button>
          <Radio.Button value="shanghai">Shanghai</Radio.Button>
          <Radio.Button value="guangzhou">Guangzhou</Radio.Button>
          <Radio.Button value="shenzhen">Shenzhen</Radio.Button>
          <Radio.Button value="wuhan">Wuhan</Radio.Button>
        </Radio.Group>
        <br/>
        <br/>
        <Radio.Group 
          onChange={base=> this.setState({base})}
          value={base} 
          circle>
          <Radio.Button value="beijing" icon="logo-apple">Beijing</Radio.Button>
          <Radio.Button value="shanghai">Shanghai</Radio.Button>
          <Radio.Button value="guangzhou">Guangzhou</Radio.Button>
          <Radio.Button value="shenzhen">Shenzhen</Radio.Button>
          <Radio.Button value="wuhan">Wuhan</Radio.Button>
        </Radio.Group>
        <br/>
        <br/>
        <Radio.Group
          onChange={sm=> this.setState({sm})}
          value={sm} 
          size="small" 
          hollow 
          optionType="button" 
          options={options} />
        <br/>
        <br/>
        <Radio.Group value="beijing" size="small" disabled>
          <Radio.Button value="beijing" icon="logo-apple">Beijing</Radio.Button>
          <Radio.Button value="shanghai">Shanghai</Radio.Button>
          <Radio.Button value="guangzhou">Guangzhou</Radio.Button>
          <Radio.Button value="shenzhen">Shenzhen</Radio.Button>
          <Radio.Button value="wuhan">Wuhan</Radio.Button>
        </Radio.Group>
      </div>
    )
  }
}
ReactDOM.render(<Demo /> ,  mountNode)
```