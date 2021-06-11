<cn>
#### 多表单联动
在Form之外，通过`submit`从外部提交表单，反之 则推荐使用 `<Button htmlType="submit" />`调用原生提交逻辑
</cn>

```tsx
import { Form, Input, Modal, Button } from 'react-kui';

class Demo extends React.Component {

  layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  }

  formRef = React.createRef()

  state = {
    visible: false,
    group: {
      name: '',
      list: []
    }
  }

  rules = {
    name: [
      { required: true, message: '请输入组织名称' }
    ]
  }

  form = {
    username: '',
    age: ''
  }
  userRules = {
    username: [
      { required: true, message: '请输入组织名称' }
    ],
    age: [
      { required: true, message: '请输入年龄' },
      { type: 'number', message: '请输入正确的年龄' }
    ],
  }

  onSubmit = (valid, model) => {
    if (valid) {
      let { group } = this.state
      group.list.push(model)
      this.setState({ group })
      this.toggle(false)
      this.formRef.current.reset()
    }
  }
  onOk = () => {
    this.formRef.current.submit()
  }
  onCancel = () => {
    this.formRef.current.reset()
    this.toggle(false)
  }
  toggle = (visible) => {
    this.setState({ visible })
  }

  render() {
    const { visible, group } = this.state
    return (
      <div style={{ width: 512 }}>
        <Form {...this.layout} name="withmodal" model={group} rules={this.rules}>
          <Form.Item label="Gruop" prop="name">
            <Input />
          </Form.Item>
          <Form.Item label="UserList">
            <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.5 }}>{group.list.length ?
              group.list.map((child, i) => {
                return <p key={i}>{child.username} - {child.age}</p>
              })
              : <span >No user</span>}</div>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 5 }}>
            <Button type="primary" htmlType="submit">Submit</Button>
            <Button onClick={() => this.toggle(true)} style={{ marginLeft: 10 }}>Add User</Button>
          </Form.Item>
        </Form>

        <Modal visible={visible}
          title="新增用户" width={450}
          onOk={this.onOk}
          onCancel={this.onCancel}
        >
          <Form {...this.layout} name="modal"
            model={this.form}
            rules={this.userRules}
            onSubmit={this.onSubmit}
            ref={this.formRef}
          >
            <Form.Item label="Usename" prop="username">
              <Input placeholder="请输入姓名"/>
            </Form.Item>
            <Form.Item label="Age" prop="age">
              <Input placeholder="请输入年龄"/>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
ReactDOM.render(<Demo />, mountNode )
```