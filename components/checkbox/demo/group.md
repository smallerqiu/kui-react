<cn>
#### 组合使用
组合使用可以直接使用 `CheckboxGroup` 的 `options` 来赋值,或者结合 `Checkbox` 来组合使用,通过 `disabled` 可以设置组件是否被禁用
**`CheckboxGroup` 可以直接使用 `options` 来组合，3.0版本增加**
</cn>

```ts
import { Checkbox , Button } from 'react-kui';

class Demo extends React.Component {
  state = {
    checked: true,
    data: ['apple','grape'],
    options: [
      { label: 'Beijing', value: 'beijing' },
      { label: 'Shenzhen', value: 'shenzhen' },
      { label: 'Shanghai', value: 'shanghai' },
      { label: 'Guangzhou', value: 'guangzhou' },
      { label: 'Wuhan', value: 'wuhan' },
      { label: 'Other', value: 'other',disabled:true },
    ],
    cities:['wuhan']
  }
  render(){
    const {data, options ,cities } = this.state
    return(
      <div>
        <p>{data.join()}</p>
        <Checkbox.Group value={data}>
          <Checkbox label="Apple" value="apple" />
          <Checkbox label="Orange" value="orange" />
          <Checkbox label="Banana" value="banana" />
          <Checkbox label="Grape" value="grape" disabled/>
          <Checkbox label="Pear" value="pear" disabled/>
        </Checkbox.Group>
        <Button onClick={()=>this.setState({data:[]})} size="small" style={{margin:10}}>Clear</Button>
        <Button onClick={()=>this.setState({data:['apple']})} size="small">Select apple</Button>
        <br/>
        <br/>
        <p>{cities.join()}</p>
        <Checkbox.Group options={options} value={cities} onChange={cities=>this.setState({cities})}/>
      </div>
    )
  }
}
ReactDOM.render(<Demo />  ,  mountNode)
```
