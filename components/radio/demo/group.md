<cn>
#### 组合使用
组合使用可以直接使用 `RadioGroup` 的 `options` 来赋值,或者结合 `Radio` 来组合使用,通过 `disabled` 可以设置组件是否被禁用
**`RadioGroup` 可以直接使用 `options` 来组合，3.0版本增加**
</cn>

```tsx
import { Radio , Button } from 'react-kui';

class Demo extends React.Component{
  state = {
    checked: true,
    data: 'apple',
    options: [
      { label: 'Beijing', value: 'beijing' },
      { label: 'Shenzhen', value: 'shenzhen' },
      { label: 'Shanghai', value: 'shanghai' },
      { label: 'Guangzhou', value: 'guangzhou' },
      { label: 'Wuhan', value: 'wuhan' },
    ],
    cities:'wuhan'
  }
  render(){
    const {data ,checked ,options ,cities} =this.state
    return(
      <div>
        <p>Selected: {data}</p>
        <Radio.Group value={data} onChange={data=> this.setState({data})}>
          <Radio label="Apple" value="apple" />
          <Radio label="Orange" value="orange" />
          <Radio label="Banana" value="banana" />
          <Radio label="Grape" value="grape" disabled/>
          <Radio label="Pear" value="pear" disabled/>
        </Radio.Group>
        <Button 
        onClick={()=> this.setState({data:''})} 
        style={{margin:'0 16px'}}
        size="small">Clear</Button>
        <Button onClick={()=> this.setState({data:'apple'})} size="small">Select apple</Button>
        <br/>
        <br/>
        <p>Value: {cities}</p>
        <Radio.Group 
          onChange = {cities=> this.setState({cities})}
          options={options} 
          value={cities} />
      </div>
    )
  }
}

ReactDOM.render(<Demo />  ,  mountNode)
```