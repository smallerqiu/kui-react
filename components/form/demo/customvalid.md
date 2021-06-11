<cn>
#### 自定义校验规则
自定义验证规则来完成表单验证。
</cn>

```tsx
import { Form ,Button ,Input ,Message} from 'react-kui';

const Demo = () => {

  const formRef = React.createRef()

  const validateIDNumber = (rule,value,callback)=>{
    if(value && !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)){
      return  callback(new Error('请输入正确的身份证号码'))
    }
    callback()
  }
  const validatePassword = (rule,value,callback)=>{
    if(!value){
      callback(new Error('请输入密码'))
    }else{
      formRef.current.test('repassword')
      callback()
    }
  }
  const validateRePassword = (rule,value,callback)=>{
    if(!value){
      callback(new Error('请再次输入密码'))
    }else if(value!=form.password){
      callback(new Error('两次密码输入不一致'))
    }else{
      callback()
    }
  }
  const submit = (e,valid , model)=> {
    e.preventDefault()
    Message[valid ? 'success' : 'error'](valid ? 'success' : 'faild')
    console.log(model)
  }
  const layout = {
    labelCol:{span:6},
    wrapperCol:{span:16},
  }
  const form = {
    fullname:'',
    IDnumber:'',
    password:'',
    repassword:''
  }
  const rules = {
    fullname:[ 
        { required: true, message: '请输入姓名' },
        { message: '姓名只能是中文', pattern: /^[\u4e00-\u9fa5]+$/ },
      ],
    IDnumber:[{ validator:validateIDNumber }],
    password:[{ validator:validatePassword }],
    repassword:[{ validator:validateRePassword }]
  }
  return(
    <div style={{width:600}}>
      <Form 
        model={form}
        rules={rules}
        onSubmit={submit}
        ref={formRef}
        {...layout}>
        <Form.Item label="姓名" prop="fullname">
          <Input  clearable />
        </Form.Item>
        <Form.Item label="身份证号码" prop="IDnumber">
          <Input placeholder="非必填"/>
        </Form.Item>
        <Form.Item label="密码" prop="password">
          <Input type="password" placeholder="请输入密码"/>
        </Form.Item>
        <Form.Item label="重复密码" prop="repassword">
          <Input type="password" placeholder="请重复输入密码"/>
        </Form.Item>
        <Form.Item wrapperCol={{offset:6}}>
          <Button type="primary" htmlType="submit">Submit</Button>
          <Button style={{marginLeft: 10}} htmlType="reset">Reset</Button>
        </Form.Item>
      </Form>
    </div> 
  )
}
ReactDOM.render(<Demo />, mountNode )
```