<cn>
#### 全选
全选组合
</cn>

```tsx
import { Checkbox } from 'react-kui';

class Demo extends React.Component {
  state = {
    checkAll: false,
    indeterminate: false,
    options: [
      { label: 'Beijing', value: 'beijing' },
      { label: 'Shenzhen', value: 'shenzhen' },
      { label: 'Shanghai', value: 'shanghai' },
      { label: 'Guangzhou', value: 'guangzhou' },
      { label: 'Wuhan', value: 'wuhan' },
    ],
    cities:[]
  }
  handelCheckAll = (e)=> {
    let checked = e.target.checked
    
    this.setState({
      cities:checked ? ["beijing", "shenzhen", "shanghai", "guangzhou",'wuhan'] :[],
      indeterminate: false,
      checkAll: checked
    })
  }
  change = (data) =>{
    let { options} = this.state
    let select = data.length , count = options.length
    this.setState({
      checkAll:select == count,
      indeterminate:select > 0 && select < count
    })
  }
  render(){
    const {checked ,checkAll ,indeterminate ,options ,cities} = this.state
    return (
      <div>
        <Checkbox checked={checkAll} indeterminate={indeterminate} onChange={this.handelCheckAll}>Check all</Checkbox>
        <br/>
        <Checkbox.Group options={options} value={cities} onChange={this.change}/>
      </div>
    )
  }
}

ReactDOM.render(<Demo /> , mountNode)
```