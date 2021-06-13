
<cn>
#### 基本用法
基础抽屉，点击触发按钮抽屉从右滑出，点击遮罩区关闭
</cn>

```tsx
import { Button , Drawer } from 'react-kui';

const Demo = ()=>{

  const [show,toggle] = React.useState(false)

  return(
    <div>
      <Button onClick={()=>toggle(true)}>普通抽屉</Button>
      <Drawer visible={show} onCancel={()=>toggle(false)} closable={false} footer={null}>
        <p>something ...</p>
        <p>something ...</p>
        <p>something ...</p>
      </Drawer>
    </div>
  )
}
ReactDOM.render(<Demo />  ,  mountNode)
```