<cn>
#### 表单模式
内容将呈现表单模式，有页头和页尾, 可自定义页尾
</cn>

```tsx
import { Button , Drawer ,Form ,Input , Select ,Row ,Col, DatePicker, Radio ,Checkbox ,TextArea ,Message} from 'react-kui';

const { Option } = Select

const Demo = ()=>{
  const rules= {
    input: [{ required: true }],
    number: [{ required: true}],
    select: [{ required: true }],
    province: [{ required: true }],
    city: [{ required: true }],
    datepicker: [{ required: true }],
    radios: [{ required: true }],
    radio: [{ required: true }],
    checkbox: [{ required: true }],
    checkboxs: [{ required: true }],
    textarea: [{ required: true, message: '必填', trigger: 'blur' }, { min: 2, max: 5, message: '长度为2-5个字符'}],
  }
  const formRef = React.createRef()

  const submitForm =()=> {
    formRef.current.submit()
  }
  const submit = (valid , model)=>{
    if (valid) {
      Message.success('验证通过')
    } else {
      Message.error('验证失败')
    }
  }
  const resetForm = ()=> {
    formRef.current.reset()
    baseToggle(false)
  }
  const form = {
    input: "",
    number: "",
    province: '',
    city: '',
    radio: false,
    radios: "",
    checkbox: false,
    datepicker: "",
    checkboxs: [],
    textarea: ''
  }
  const [baseVisible, baseToggle] = React.useState(false)
  const [customVisible, customToggle] = React.useState(false)
  const footer = <>
                <Button onClick={ () =>customToggle(false)}>取消</Button>
                <Button type="danger">驳回</Button>
                <Button onClick={ () =>customToggle(false)}>通过</Button>
              </>
  return(
    <div>
      <Button onClick={()=>baseToggle(true)}>普通表单</Button>
      <Button onClick={()=>customToggle(true)} style={{margin:'0 10px'}}>自定义</Button>
      <Drawer visible={baseVisible} title="表单验证" onOk={submitForm} onCancel={resetForm}>
        <Form  
          ref={formRef} 
          model={form} 
          rules={rules} 
          labelCol={{span:7}}
          wrapperCol={{span:16}}
          onSubmit={submit}>
          <Form.Item label="Input" prop="input">
            <Input  clearable icon="home" />
          </Form.Item>
          <Form.Item label="Number" prop="number">
            <Input clearable />
          </Form.Item>
          <Form.Item label="Select">
            <Form.Item prop="province">
              <Select  clearable>
                <Option value="0" label="北京" />
                <Option value="1" label="上海" />
                <Option value="2" label="广州" />
                <Option value="3" label="深圳" />
              </Select>
            </Form.Item>
            <Form.Item prop="city">
              <Select  clearable>
                <Option value="0" label="南山区" />
                <Option value="1" label="龙华区" />
                <Option value="2" label="福田区" />
                <Option value="3" label="宝安区" />
              </Select>
            </Form.Item>
          </Form.Item>
          <Form.Item label="DatePicker" prop="datepicker">
            <DatePicker clearable format="YYYY/MM/DD hh:mm:ss" />
          </Form.Item>
          <Form.Item label="Radio" prop="radio">
            <Radio >男</Radio>
          </Form.Item>
          <Form.Item label="RadioGroup" prop="radios">
            <Radio.Group >
              <Radio value="0" label="武汉"/>
              <Radio value="1" label="深圳"/>
              <Radio value="2" label="杭州"/>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Checkbox" prop="checkbox">
            <Checkbox>男</Checkbox>
          </Form.Item>
          <Form.Item label="CheckboxGroup" prop="checkboxs">
            <Checkbox.Group >
              <Checkbox value="0" label="武汉" />
              <Checkbox value="1" label="杭州"/>
              <Checkbox value="2" label="上海" />
              <Checkbox value="3" label="北京"/>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="Text" prop="textarea">
            <TextArea placeholder="情输入..." />
          </Form.Item>
        </Form>
      </Drawer>
      
      <Drawer visible={customVisible} 
        title="我是自定义标题" 
        onCancel={()=>customToggle(false)}
        footer = { footer }
        >
        <p>我是自定义内容</p>
      </Drawer>
    </div>
  )
}
ReactDOM.render(<Demo />  ,  mountNode)
```