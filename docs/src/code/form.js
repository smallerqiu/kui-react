let code = {}

code.base =`import { Form,Input,Select,DatePicker,Radio,Checkbox,Switch,Button } from 'react-kui';
ReactDOM.render() {
  return (
    <Form labelWidth="80" labelAlign={labelAlign}>
      <Form.Item label="Input">
        <Input width="200"></Input>
      </Form.Item>
      <Form.Item label="Select">
        <Select value="s1" width="200">
          <Option value="0">男</Option>
          <Option value="1">女</Option>
          <Option value="2">妖</Option>
        </Select>
      </Form.Item>
      <Form.Item label="DatePicker">
        <DatePicker></DatePicker>
      </Form.Item>
      <Form.Item label="Radio">
        <Radio.Group value="0">
          <Radio value="0">男</Radio>
          <Radio value="1">女</Radio>
          <Radio value="2">妖</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Checkbox">
        <Checkbox.Group value={['0']}>
          <Checkbox label="0">男</Checkbox>
          <Checkbox label="1">女</Checkbox>
          <Checkbox label="2">妖</Checkbox>
        </Checkbox.Group>
      </Form.Item>
      <Form.Item label="Switch">
        <Switch trueText="是" falseText="否"></Switch>
      </Form.Item>
      <Form.Item label="Text">
        <Input type="textarea" placeholder="情输入..."></Input>
      </Form.Item>
      <Form.Item>
        <Button type="primary">Submit</Button>
        <Button style={{ marginLeft: 10 }}>Cancel</Button>
      </Form.Item>
    </Form>
  )
}`

code.invalid =`import { Form,Input,Select,DatePicker,Radio,Checkbox,Switch,Button } from 'react-kui'
constructor(props) {
  super(props)
  this.state = {
    s1: '',
    labelAlign: 'right',
    code: code,
    select: [
      { label: "男", value: "0" },
      { label: "女", value: "1" },
      { label: "妖", value: "2" },
    ],
    form: {
      switch: true,
      input: "",
      select: '',
      province: '',
      city: '',
      datepicker: "",
      radio: "",
      checkbox: [],
      textarea: ''
    },
    rules: {
      input: [{ required: true, trigger: 'blur' }],
      select: [{ required: true, trigger: 'change' }],
      province: [{ required: true, trigger: 'change' }],
      city: [{ required: true, trigger: 'change' }],
      datepicker: [{ required: true, trigger: 'change' }],
      radio: [{ required: true, trigger: 'change' }],
      checkbox: [{ required: true, trigger: 'change', min: 2, max: 3 }],
      textarea: [{ required: true, message: '必填', trigger: 'blur' }, { min: 2, max: 5, message: '长度为2-5个字符', trigger: 'blur' }],
    },
  }
}
ReactDOM.render() {
  let { labelAlign, form, rules, s1 } = this.state
  return (
    <Form labelWidth="90" ref="form" model={form}
      onChange={(form) => this.setState({ form })}
      rules={rules} labelAlign={labelAlign}>
      <Form.Item label="Input" prop="input">
        <Input value={form.input}></Input>
      </Form.Item>
      <Form.Item label="Select" required>
        <Row>
          <Col span="12">
            <Form.Item prop="province">
              <Select value={form.province} clearable>
                <Option value="0">北京</Option>
                <Option value="1">上海</Option>
                <Option value="2">广州</Option>
                <Option value="3">深圳</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span="11" offset="1">
            <Form.Item prop="city">
              <Select value={form.city} clearable>
                <Option value="0">南山区</Option>
                <Option value="1">龙华区</Option>
                <Option value="2">福田区</Option>
                <Option value="3">宝安区</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
      <Form.Item label="DatePicker" prop="datepicker">
        <DatePicker value={form.datepicker} clearable></DatePicker>
      </Form.Item>
      <Form.Item label="Radio" prop="radio">
        <Radio.Group value={form.radio}>
          <Radio value="0">男</Radio>
          <Radio value="1">女</Radio>
          <Radio value="2">妖</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Checkbox" prop="checkbox">
        <Checkbox.Group value={form.checkbox}>
          <Checkbox label="0">男</Checkbox>
          <Checkbox label="1">女</Checkbox>
          <Checkbox label="2">妖</Checkbox>
          <Checkbox label="3">鲛人</Checkbox>
        </Checkbox.Group>
      </Form.Item>
      <Form.Item label="Text" prop="textarea">
        <Input type="textarea" placeholder="情输入..." value={form.textarea}></Input>
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={() => this.submitForm('form')}>Submit</Button>
        <Button style={{ marginLeft: 10 }} onClick={() => this.resetForm('form')}>Reset</Button>
      </Form.Item>
    </Form>
  )
}
`
code.customValid = `
`

export default code