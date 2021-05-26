<cn>
#### 基础用法
基本使用。
</cn>

```tsx
import { Select , Button } from 'react-kui';
let {Option} = Select

class Demo extends React.Component {
  state = {
    select: 2,
    data: [
      { label: "Apple", value: 0 },
      { label: "Orange", value: 1 },
      { label: "Banana", value: 2 },
      { label: "Pear", value: 3 },
    ],
  }
  setValue = (value)=>{
    this.setState({select:value})
  }
  render(){
    const { select,data } = this.state
    return(
      <div>
        <Select width={200} value={select} options={data} onChange={this.setValue}/>
        <Button onClick={()=>this.setValue('')} size="small">Clear</Button>
        <Button onClick={()=>this.setValue(1)} size="small">Choose orange</Button>
        <br />
        <Select width={200}>
          <Option value={1} label="Apple" />
          <Option value={2} label="Orange" />
          <Option value={3} label="Banana" disabled/>
          <Option value={4} label="Pear" />
        </Select>
        <br />
        <Select width={200} value="1" disabled>
          <Option value="1" label="disabled" />
        </Select>
      </div>
    )
  }
}
ReactDOM.render(<Demo />,  mountNode)
```