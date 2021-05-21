<cn>
#### 其它属性
不需要页脚时，可以把 `footer` 为`null`
</cn>

```tsx
import { Modal , Button } from 'react-kui';

class Demo extends React.Component {

  state = {
    show1:false,
    show2:false,
    show3:false,
    show4:false,
    show5:false,
    show6:false,
    text : 'A long time ago, In a beautiful kingdom,   there lived a young king and queen,   the people loved them so much; '
  }

  changeVisible = (key,show)=>{
    let prop = {}
    prop[key] = show==1
    this.setState(prop)
  }

  render(){
    let { show1, show2, show3, show4, show5, show6 ,text } = this.state
    return(
      <div>
        <Button onClick={()=>this.changeVisible('show1',1)} type="primary">Draggable</Button>
        <Button onClick={()=>this.changeVisible('show2',1)} type="primary">Centered</Button>
        <Button onClick={()=>this.changeVisible('show3',1)} type="primary">Top 200px</Button>
        <Button onClick={()=>this.changeVisible('show4',1)} type="primary">Maximized</Button>
        <Button onClick={()=>this.changeVisible('show5',1)} type="primary">No mask</Button>
        <Button onClick={()=>this.changeVisible('show6',1)} type="primary">No footer</Button>

        <Modal 
          title="Draggable" 
          visible={show1} 
          draggable 
          onCancel={()=>this.changeVisible('show1',0)}
          onOk={()=>this.changeVisible('show1',0)}>
          {text}
        </Modal>

        <Modal 
          title="Centered" 
          visible={show2} 
          centered 
          onCancel={()=>this.changeVisible('show2',0)}
          onOk={()=>this.changeVisible('show2',0)}>
          {text}
        </Modal>

        <Modal 
          title="Top 200px" 
          visible={show3} 
          top={200} 
          onCancel={()=>this.changeVisible('show3',0)}
          onOk={()=>this.changeVisible('show3',0)}>
          {text}
        </Modal>

        <Modal 
          title="Maximized" 
          visible={show4} 
          maximized 
          onCancel={()=>this.changeVisible('show4',0)}
          onOk={()=>this.changeVisible('show4',0)}>
          {text}
        </Modal>

        <Modal 
          title="Click mask dont't be close"
          visible={show5} 
          mask={false} 
          maskClosable={false} 
          onCancel={()=>this.changeVisible('show5',0)}
          onOk={()=>this.changeVisible('show5',0)}>
          {text}
        </Modal>

        <Modal 
          title="No footer" 
          visible={show6} 
          footer={null} 
          onCancel={()=>this.changeVisible('show6',0)}
          onOk={()=>this.changeVisible('show6',0)}>
          {text}
        </Modal>
      </div>
    )
  }
}
ReactDOM.render(<Demo />  ,mountNode)
```