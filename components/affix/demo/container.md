<cn>
#### 滚动容器
用 `target` 设置 `Affix` 需要监听其滚动事件的元素，默认为 `window`。
</cn>

```tsx
import { Affix , Message , Button } from 'react-kui';

class Demo extends React.Component {

  containerRef =  React.createRef()
  render(){
    const { containerRef } = this
    return(
      <div className="demo-affix-scroll" ref={containerRef}>
        <div className="demo-affix-inner" >
            <Affix target={() => containerRef}>
              <Button type="primary">Affix at the top of container</Button>
            </Affix>
        </div>
      </div>
    )
  }
}
ReactDOM.render(<Demo />  ,mountNode)
```
