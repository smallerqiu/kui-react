<cn>
#### 尺寸
`small` 为小尺寸， `large` 为大尺寸
</cn>

```tsx
import { Button, Radio } from 'react-kui';

class ButtonSize extends React.Component {
  state = {
    size:'large'
  }

  change = e =>{
    this.setState({size:e})
  }

  render(){
    const { size } = this.state
    return (
      <div>
        <Radio.Group value={size} onChange={this.change}>
          <Radio.Button value="large" label="Large"/>
          <Radio.Button value="default" label="Default"/>
          <Radio.Button value="small" label="Small"/>
        </Radio.Group>
        <br/>
        <br/>
        <Button type="primary" size={size}>Primary</Button>
        <Button size={size}>Default</Button>
        <Button type="dashed" size={size}>Dashed</Button>
        <Button type="link" size={size}>Link</Button>
        <br/>
        <Button type="primary" size={size} icon="cloud-download"></Button>
        <Button type="primary" circle size={size} icon="cloud-download"></Button>
        <Button type="primary" circle size={size} icon="cloud-download">Download</Button>
        <Button type="primary" size={size} icon="cloud-download">Download</Button>
      </div>
    )
  }
}
ReactDOM.render(<ButtonSize/>, mountNode)
```