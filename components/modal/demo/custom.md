<cn>
#### 自定义
自定义 `Modal`
</cn>

```tsx
import { Modal , Button , Input } from 'react-kui';

class Demo extends React.Component {
  state = {
    visible1:false,
    visible2:false,
    visible3:false,
    visible4:false,
    loading:false,
  }
  okHandle(){
    this.visible3 = false
  }  
  submit = () =>{
    this.setState({loading : true})
    this.timer = setTimeout(e=>{
      this.setState({loading : false, visible4:false})
    },2000)
  }
  close = () => {
    this.setState({loading : false})
    clearTimeout(this.timer)
  }
  changeVisible = (key,show)=>{
    let prop = {}
    prop[key] = show==1
    this.setState(prop)
  }
  render(){
    let { visible1, visible2, visible3, visible4 , loading } = this.state

    const footer = <Button icon="save" onClick={()=>this.changeVisible('visible2',0)} type="primary">Save</Button>
    return(
      <div>
        <Button onClick={()=>this.changeVisible('visible1',1)} type="primary">Width 300px</Button>
        <Modal 
          title="Width 300px" 
          visible={visible1} 
          width={300} 
          onOk={()=>this.changeVisible('visible1',0)}
          onCancel={()=>this.changeVisible('visible1',0)}>
          <p>content</p>
        </Modal>

        <Button onClick={()=>this.changeVisible('visible2',1)} type="primary">Custom footer</Button>
        <Modal 
          title="Custom footer"
          footer={footer} 
          onCancel={()=>this.changeVisible('visible2',0)}
          visible={visible2}>
          <p>content</p> 
        </Modal>

        <Button onClick={()=>this.changeVisible('visible3',1)} type="primary">国际化</Button>
        <Modal 
          title="Are you ok ?" 
          visible={visible3} okText="Ok" 
          cancelText="cancel" 
          onCancel={()=>this.changeVisible('visible3',0)}
          onOk={()=>this.changeVisible('visible3',0)}>
          <p>Yes , I'm fine !</p>
        </Modal>

        <Button onClick={()=>this.changeVisible('visible4',1)} type="primary">异步关闭</Button>
        <Modal title="提交表单" 
          visible={visible4} 
          loading={loading} 
          onOk={this.submit} 
          onCancel={()=>this.changeVisible('visible4',0)}
          onClose={this.close}>
          <p>Name：<Input placeholder="Please input your name" style={{width:200}}/></p>
        </Modal>
      </div>
    )
  }
}
ReactDOM.render(<Demo />  ,mountNode)
```