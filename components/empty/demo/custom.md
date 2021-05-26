
<cn>
#### 自定义
自定义图片、描述、附属内容。
</cn>

```tsx
import { Empty, Button } from 'react-kui';


ReactDOM.render(
  <div>
    <Empty 
      image="https://www.chuchur.com/img/thumb.png" 
      description="暂时没有图片"
      imageStyle={{height:60}}>
      <Button type="primary" circle icon="add" size="small">上传图片</Button>
    </Empty>
    <br/>
    Use ReactNode
    <br/>
    <Empty 
      description={<>暂时没有<a>图片</a></>} 
      image={<img src="https://www.chuchur.com/img/thumb.png" style={{height:60}} />}
    >
      <Button type="primary" circle icon="add" size="small">上传图片</Button>
    </Empty>
  </div>,
  mountNode
)
```