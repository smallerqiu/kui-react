<cn>
#### 条目数和自定义条目数
改变每页显示条目数。
</cn>

```tsx
import { Page } from 'react-kui';

// const []
class Demo extends React.Component {
  state = {
    sizeData : [30,50,80,100]
  }
  render(){
    const {sizeData} = this.state
    return (
      <div className="demo-page">
        <Page current={3} total={200} showSizer/>
        <Page current={4} total={200} showSizer page-size={20}/>
        <Page current={4} total={1000} showSizer page-size={30} size-data={sizeData}/>
      </div>
    )
  }
}
ReactDOM.render(<Demo /> , mountNode)  
```