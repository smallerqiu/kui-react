<cn>
#### 表单验证
在防止用户犯错的前提下，尽可能让用户更早地发现并纠正错误。
</cn>

```tsx
import { Form , Input , Select, Radio, DatePicker ,Checkbox , Button ,TextArea , Switch ,Message} from 'react-kui';

const { Option } = Select
const layout = {
  labelCol:{span:6},
  wrapperCol:{span:16},
}

const Demo = () => {

  const formModel = {
        email: '',
        pwd: '',
        repwd: '',
        phone: '',
        captcha: '',
        gender: '',
        one: false,
        system:'',
        birthday: '',
        country: '',
        city: '',
        hobby: [],
        hardcore: '',
        other: '',
        readme: false
      }
  const validatePass = (rule, value, callback) => {
    if (value !== form.pwd) {
      return callback(new Error('两次密码不一致'))
    }
    callback()
  }
  const validateReadme = (rule, value, callback) => {
    if (value !== true) {
      return callback(new Error('请阅读服务条款'))
    }
    callback()
  }
  const rules = {
    email: [
      { type: 'mail', message: '请输入有效的电子邮箱' },
      { required: true, message: '请输入电子邮箱' },
    ],
    pwd: [
      { min: 8, max: 20, message: '密码长度请控制在8-20位之间', trigger: 'blur' },
      { required: true, message: '请输入密码' },
    ],
    repwd: [
      { min: 8, max: 20, message: '密码长度请控制在8-20位之间', trigger: 'blur' },
      { validator: validatePass },
      { required: true, message: '请重复输入密码' },
    ],
    phone: [
      { type: 'mobile', message: '请输入正确的手机号码' },
      { required: true, message: '请输入手机号' },
    ],
    birthday: [
      { required: true, message: '请选择出生日期' },
    ],
    country: [
      { required: true, message: '请选择国家' },
    ],
    city: [
      { required: true, message: '请选择城市' },
    ],
    captcha: [
      { type: 'number', message: '验证码为数字' },
      { required: true, message: '请输入验证码' },
    ],
    gender: [
      { required: true, message: '请选择性别' },
    ],
    one: [
      { required: true, message: '霸王选项' },
    ],
    system: [
      { required: true, message: '请选择系统类型' },
    ],
    hardcore: [
      { required: true, message: '霸王选项' },
    ],
    readme: [
      { validator: validateReadme },
    ],
    hobby: [
      { required: true, message: '请选择爱好' },
      { max: 3, message: '最多只能选择3个爱好' },
      { min: 2, message: '最少选择2个爱好' },
    ],
    other: [
      { required: true, message: '请填写其他信息' },
      { max: 10, message: '最多只能输入10个字符' },
    ]
  }

  const setValue = ()=> {
    const form = {
      email: 'master@k-ui.cn',
      pwd: 'abc@123@123',
      repwd: 'abc@123@123',
      phone: '13888888888',
      captcha: '8888',
      gender: '1',
      system: '0',
      one: true,
      birthday: '1995-05-05',
      country: '1',
      city: '1',
      hobby: ['0', '1'],
      hardcore: true,
      other: '测试数据',
      readme: true
    }
    setForm(form)
  }

  const [form,setForm] = React.useState(formModel)
  const [size,setSize] = React.useState('default')
  let [time,setTime] = React.useState(60)

  const sendCode = () => {
    Message.success("验证码发送成功，请注意查收");
    clearInterval(this.timer)
    this.timer = setInterval(e => {
      if (time < 1) {
        clearInterval(this.timer)
        time = 60
      } else {
        time--
      }
      setTime(time)
    }, 1000)
  }

  const submit = (valid , model)=> {
    Message[valid ? 'success' : 'error'](valid ? 'success' : 'faild')
    console.log(model)
  }

  return(
    <div style={{width:600}}>
      <Form 
        model={form} 
        size={size}
        rules={rules} 
        onSubmit={submit}
        {...layout}>
        <Form.Item label="Size">
          <Radio.Group value={size} onChange={setSize}>
            <Radio.Button value="large" label="Large" />
            <Radio.Button value="default" label="Default" />
            <Radio.Button value="small" label="Small" />
          </Radio.Group>
        </Form.Item>
        <Form.Item label="E-mail" prop="email">
          <Input clearable />
        </Form.Item>
        <Form.Item label="Password" prop="pwd">
          <Input  type="password" />
        </Form.Item>
        <Form.Item label="Confirm Password" prop="repwd">
          <Input  type="password" />
        </Form.Item>
        <Form.Item label="Phone Number" prop="phone">
          <Input  />
        </Form.Item>
        <Form.Item label="Captcha" prop="captcha">
          <Input 
            suffix={
              time==60?<span onClick={sendCode}>获取验证码</span>:
            <span>{time.toString()}(s)</span>       
            }
          />
        </Form.Item>
        <Form.Item label="Country">
          <Form.Item prop="country">
            <Select  clearable >
              <Option value="0" label="China" />
              <Option value="1" label="Russia" />
            </Select>
          </Form.Item>
          <Form.Item prop="city">
            <Select clearable >
              <Option value="0" label="Shanghai" />
              <Option value="1" label="Wuhan" />
              <Option value="2" label="Hangzhou" />
            </Select>
          </Form.Item>
        </Form.Item>
        <Form.Item label="Gender" prop="gender">
          <Radio.Group >
            <Radio value="0" label="Girl" />
            <Radio value="1" label="Boy" />
          </Radio.Group>
        </Form.Item>
        <Form.Item label="One" prop="one">
          <Radio label="Only One?" />
        </Form.Item>
        <Form.Item label="System" prop="system">
          <Radio.Group >
            <Radio.Button value="0" label="Mac OS" />
            <Radio.Button value="1" label="Windows" />
            <Radio.Button value="2" label="Linux" />
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Birthday" prop="birthday">
          <DatePicker  clearable  />
        </Form.Item>
        <Form.Item label="Hobby" prop="hobby">
          <Checkbox.Group >
            <Checkbox value="0" label="Football" />
            <Checkbox value="1" label="Music" />
            <Checkbox value="2" label="Photograph" />
            <Checkbox value="3" label="Tennis" />
          </Checkbox.Group>
        </Form.Item>
        <Form.Item label="Hardcore" prop="hardcore">
          <Switch true-text="Yes" false-text="No" />
        </Form.Item>
        <Form.Item label="Other" prop="other">
          <TextArea placeholder="最多只能输入10个字符" />
        </Form.Item>
        <Form.Item prop="readme" wrapperCol={{offset:6}}>
          <Checkbox>我已阅读 <a>服务条款</a> </Checkbox>
        </Form.Item>
        <Form.Item wrapperCol={{offset:6}}>
          <Button type="primary" htmlType="submit">Submit</Button>
          <Button style={{margin:'0 10px'}} htmlType="reset">Reset</Button>
          <Button type="dashed" onClick={setValue} >Set Value</Button>
        </Form.Item>
      </Form>
    </div>
  )
}
ReactDOM.render(<Demo />, mountNode )
```