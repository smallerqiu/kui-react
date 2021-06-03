<cn>
#### 日期格式
使用 `format` 属性，可以自定义日期显示格式，详见  [moment.js](http://momentjs.com/)。
</cn>

```tsx
import { DatePicker } from 'react-kui';

const Demo = () =>{
  const [date,setDate] = React.useState(['2019-10-12','2020-10-19'])
  return (
    <div>
      <DatePicker value="2019-10-12 22:12:12" format="YYYY年MM月DD日 HH:mm:ss" showTime/>
      <br/>
      <DatePicker value="2019-10-12" format="YYYY/MM/DD"/>
      <br/>
      <DatePicker value="2019-10-12" format="YYYY.MM.DD"/>
      <br/>
      <DatePicker value={date} format="YYYY.MM.DD" mode="range" onChange={setDate}/>{date.join(' ~ ')}
    </div>
  )
}
ReactDOM.render(<Demo/>, mountNode)
```