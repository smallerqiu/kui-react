<cn>
#### 多彩文字提示
多种预设色彩的文字提示样式，用作不同场景使用。
</cn>


```tsx
import { Tooltip ,Divider,Tag } from 'react-kui';

class Demo extends React.Component {
  custom = ['#c20','#39f','#e3f','#6c0']

  colors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
  ]
  render(){
    return(
      <div className="demo-tooltip-color">
        <Divider orientation="left">Presets:</Divider>
        <div>
          {
            this.colors.map(color=>{
              return(
                <Tooltip color={color} title={color} key={color}>
                  <Tag color={color}>{color}</Tag>
                </Tooltip>
              )
            })
          }
        </div>
        <Divider orientation="left">Custom:</Divider>
        <div>
          {
            this.custom.map(color=>{
              return(
                <Tooltip color={color} title={color} key={color}>
                  <Tag color={color}>{color}</Tag>
                </Tooltip>
              )
            })
          }
        </div>
      </div>
      )
    }
}
ReactDOM.render(<Demo />, mountNode)
```