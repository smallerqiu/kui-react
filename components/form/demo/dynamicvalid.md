<cn>
#### 动态校验规则
根据不同情况执行不同的校验规则。
</cn>

```tsx
import { Form, Input, Select, Button, Icon, Message, Row, Col } from 'react-kui';

const { Option } = Select
class Demo extends React.Component {
  layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
  }
  state = {
    form: {
      cname: '',
      info: {
        gender: '',
        age: ''
      },
      webs: [
        { value: '', key: 0 },
        { value: '', key: 1 },
      ],
    },
    count: 1
  }
  add = () => {
    let { form, count } = this.state
    let item = { value: '', key: count + 1 }
    form.webs.push(item)
    this.setState({ form, count: count + 1 })
  }
  remove = (index) => {
    let { form } = this.state
    form.webs.splice(index, 1)
    this.setState({ form })
  }
  submit = (valid, model) => {
    Message[valid ? 'success' : 'error'](valid ? 'success' : 'faild')
    console.log(model)
  }
  formChange = (form) =>{
    this.setState({ form })
  }
  render() {
    let { form } = this.state
    return (
      <Row >
        <Col span={16}>
          <Form
            model={form}
            onSubmit={this.submit}
            onChange={this.formChange}
            {...this.layout}>
            <Form.Item
              label="姓名"
              prop="cname"
              rules={[
                { required: true, message: '请输入姓名' }
              ]}
            >
              <Input clearable />
            </Form.Item>
            <Form.Item
              label="性别"
              prop="info.gender"
              rules={[
                { required: true, message: '请输入性别' }
              ]}
            >
              <Select clearable>
                <Option value="1" label="男" />
                <Option value="0" label="女" />
              </Select>
            </Form.Item>
            <Form.Item
              label="年龄"
              prop="info.age"
              rules={[
                { required: true, message: '请输入年龄' }
              ]}
            >
              <Input clearable />
            </Form.Item>
            {
              form.webs.map((item, i) => {
                return <Form.Item
                  label={'网址' + item.key}
                  prop={'webs.' + i + '.value'}
                  key={item.key}
                  rules={{ required: true, message: '网址不能为空' }}
                >
                  <Input style={{ width: 230 }} />
                  {i > 0 ? <Icon type="remove-circle-outline" onClick={() => this.remove(i)} style={{ fontSize: 25, margin: '0 10px' }} color="red" /> : null}
                </Form.Item>
              })
            }
            <Form.Item wrapperCol={{ offset: 5 }}>
              <Button type="primary" htmlType="submit">Submit</Button>
              <Button onClick={this.add} style={{ margin: '0 10px' }}>Add</Button>
              <Button htmlType="reset">Reset</Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={8}>
          <pre style={{maxHeight:320,overflow:'scroll'}}>{JSON.stringify(form, null, 2)}</pre>
        </Col>
      </Row>
    )
  }
}
ReactDOM.render(<Demo />, mountNode )
```