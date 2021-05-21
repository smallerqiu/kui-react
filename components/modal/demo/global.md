<cn>
#### 全局模式
使用 全局模式
</cn>

```tsx
import { Modal , Button } from 'react-kui';

class Demo extends React.Component {
  show(i){
    let t =['操作成功','操作失败','警告警告','操作提示','来首李太白的诗']
    let c = [
      '恭喜你操作成功！',
      '很遗憾，您可能没有权限！',
      '此操作不可逆转，请谨慎！',
      '你打开了一个窗口！',
      '床前明月光，疑是地上霜，举头望明月，低头思故乡！'
    ]
    let m = ['success','error','warning','info']

    i==4 ?
    Modal.show({ 
      title:t[i], 
      content:c[i],
      icon:'moon',
      color:'#eccb23' 
    }) :
    Modal[m[i]]({ title:t[i], content:c[i] })
  }
  render(){
    return(
      <>
        <Button onClick={()=>this.show(0)}>Success</Button>
        <Button onClick={()=>this.show(1)} type="danger">Error</Button>
        <Button onClick={()=>this.show(2)}>Warning</Button>
        <Button onClick={()=>this.show(3)} type="primary">Info</Button>
        <Button onClick={()=>this.show(4)} icon="moon">Custom icon</Button>
      </>
    )
  }
}
ReactDOM.render(<Demo />  ,mountNode)
```