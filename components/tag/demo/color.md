<cn>
#### 多彩标签 
多种预设色彩的标签样式，用作不同场景使用。如果预设值不能满足你的需求，可以设置为具体的色值。
</cn>

```tsx
import { Tag } from 'react-kui';

class Demo extends React.Component {
  state = {
    colors:[
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
  }
  render(){
    const { colors } = this.state
    return(
      <div>
        <h4 style={{marginBottom: 16}}>
          Presets:
        </h4>
        <div>
          {
            colors.map(color=>{
              return <Tag color={color} key={color}>{color}</Tag>
            })
          }
        </div>
        <h4 style={{margin:'16px 0'}}>
          Custom:
        </h4>
        <div>
          <Tag color="#c20">#c20</Tag>
          <Tag color="#39f">#39f</Tag>
          <Tag color="#e3f">#e3f</Tag>
          <Tag color="#6c0">#6c0</Tag>
        </div>
      </div>
    )
  }
}
ReactDOM.render(<Demo />,  mountNode)
```
