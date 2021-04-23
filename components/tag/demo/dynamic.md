<cn>
#### 动态添加和删除
通过 `closeable` 显示关闭按钮
</cn>

```tsx
import { Tag, Input , Button} from 'react-kui';

class Demo extends React.Component {
  state = {
    showInput: false,
    tag: '',
    tags: ['Apple', 'Banana', 'Cat', 'Dog']
  }

  inputRef = React.createRef()

  show = () => {
    this.setState({
      showInput: true
    }, () => {
      this.inputRef.current.focus()
    })
  }

  blur = (e) => {
    let value = e.target.value.trim()
    let { tags } = this.state
    if (value && tags.indexOf(value) === -1) {
      tags.push(value)
    }
    this.setState({
      tags,
      tag: '',
      showInput: false
    })
  }

  render() {
    const { tags, showInput ,tag } = this.state

    return (
      <div>
        {
          tags.map(tag => {
            return <Tag color="blue" closeable key={tag}>{tag}</Tag>
          })
        }
        {
          showInput ?
            <Input
              onBlur={(e) => this.blur(e)}
              onChange = {(e)=> this.setState({tag:e.target.value})}
              size="small"
              style={{width:81}}
              ref={this.inputRef} value={tag} />
            :
            <Button
              onClick={() => this.show()}
              size="small"
              icon="bookmark">New Tag</Button>
        }
      </div>
    )
  }
}
ReactDOM.render(<Demo />, mountNode)
```