<cn>
#### 动态校验规则
根据不同情况执行不同的校验规则。
</cn>

```tsx
import { Form , Input , Select, Button,Icon ,Message } from 'react-kui';

const {Option} = Select
const Demo = () => {
  const layout = {
    labelCol:{ span:5 },
    wrapperCol: { span:16 },
  }
  let formModel = {
    cname:'',
    info:{
      gender:'',
      age:''
    },
    webs:[
      { value:'', key: '0' },
      { value:'', key: '1' },
    ] ,
  }
  const [count,setCount] = React.useState(1)
  let [form,setForm] = React.useState(formModel)
  
  const add = ()=>{
    let item = { value:'',key:count+1 }
    form.webs.push(item)
    setForm(form)
    setCount(count+1)
  }
  const remove = (index)=> {
    form.webs.splice(index, 1)
    setForm(form)
  }
  const submit = (e, valid , model)=> {
    e.preventDefault()
    Message[valid ? 'success' : 'error'](valid ? 'success' : 'faild')
    console.log(model)
  }
  const test= ()=>{
    form.webs.splice(1, 1)
    setForm(form)
  }
  return(
    <div style={{width:600}}>
    <Form 
      model={form}
      onSubmit={submit}
      {...layout}>
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
        form.webs.map((item,i)=>{
          return <Form.Item 
            label={'网址' + item.key } 
            prop={'webs.' + i + '.value'} 
            key={item.key}
            rules={{required: true, message: '网址不能为空'}}
          >
            <Input  style={{width:230}} />
            {i>0 ? <Icon type="remove-circle-outline" onClick={()=>remove(i)} style={{fontSize:25,margin:'0 10px'}} color="red"/> : null}
          </Form.Item>
        })
      }
      <Form.Item wrapperCol={{offset:5}}>
        <Button type="primary" buttontype="submit">Submit</Button>
        <Button onClick={add} style={{margin:'0 10px'}}>Add</Button>
        <Button buttontype="reset">Reset</Button>
        <Button onClick={test}>test</Button>
      </Form.Item>
      </Form>
    </div>
  )
}
ReactDOM.render(<Demo />, mountNode )
```