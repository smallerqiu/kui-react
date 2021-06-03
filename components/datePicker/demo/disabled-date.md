<cn>
#### 不可选择日期和时间 
可用 `disabledDate` 和 `disabledTime` 分别禁止选择部分日期和时间，其中 `disabledTime` 需要和 `showTime` 一起使用。
</cn>

```tsx
import { DatePicker } from 'react-kui';
import moment from 'moment';

class Demo extends React.Component {
  disabledDate(current){
    return current && current < moment().endOf('day');
  }
  range(len){
    return new Array(len).fill('').map((x,y)=>y)
  }
  disabledTime =()=>{
    return {
      disabledHours: () => this.range(24).splice(4, 20),
      disabledMinutes: () => this.range(60).splice(40, 50),
      disabledSeconds: () => [55, 56],
    };
  }
  render(){
    return(
      <div>
        <DatePicker disabledDate={this.disabledDate}/>
        <br/>
        <DatePicker disabledDate={this.disabledDate} disabledTime={this.disabledTime} showTime />
        <br/>
        <DatePicker mode="range" disabledDate={this.disabledDate} disabledTime={this.disabledTime} showTime/>
      </div>
    )
  }
}
ReactDOM.render(<Demo/>, mountNode)
```