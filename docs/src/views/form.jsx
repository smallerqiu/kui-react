import React from 'react'
import code from '../code/form'
import Demo from '../components/demo'
import { Button, Form, Input, Select, DatePicker, Radio, Checkbox, Row, Col, Switch, Message } from '@/index'
const Option = Select.Option
export default class from extends React.Component {
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
      customRules: {
        userName: [{ validator: this.validateUserName, trigger: 'blur' }],
        password: [{ validator: this.validatePass, trigger: 'blur' }],
        rePassword: [{ validator: this.validateRePass, trigger: 'blur' }],
      },
      customForm: {
        userName: '',
        password: '',
        rePassword: ''
      },
      count: 1,
      dynamicForm: {
        items: [{ value: '', index: 1 }]
      }
    }
  }
  validatePass(rule, value, callback) {
    if (value === '') {
      callback(new Error('请填写密码'))
    } else {
      if (this.customForm.rePassword !== "") {
        this.refs.customForm.validateField('rePassword')
      }
      callback()
    }
  }
  validateRePass(rule, value, callback) {
    if (value === '') {
      callback(new Error('请再次输入密码'))
    } else {
      if (this.customForm.password !== value) {
        callback(new Error('两次密码输入不一致'))
      }
      callback()
    }
  }
  validateUserName(rule, value, callback) {
    if (value === '') {
      callback(new Error('请输入用户名'))
    } else {
      if (value.length < 2 || value.length > 6) {
        callback(new Error('用户名长度为2-6位'))
      } else {
        callback()
      }
    }
  }
  add() {
    this.count++
    this.dynamicForm.items.push({ value: '', index: this.count })
  }
  del(index) {
    this.dynamicForm.items.splice(index, 1)
  }
  submitForm(name) {
    this.refs[name].validate(valid => {
      if (valid) {
        Message.success('验证通过')
      } else {
        Message.error('验证失败')
      }
    })
  }
  resetForm(name) {
    this.refs[name].resetFields()
  }
  setAlign(align) {
    this.setState({ labelAlign: align })
  }
  render() {
    let { labelAlign, form, rules, customForm, customRules,s1 } = this.state
    return (<div>
      <h2>Form 表单</h2>
      <h3>代码示例</h3>
      <Row gutter="8">
        <Col span="12">
          <Demo title="基础用法">
            <div>对齐方式：
            <Button onClick={this.setAlign.bind(this, 'left')} mini>Left</Button>
              <Button onClick={this.setAlign.bind(this, 'right')} mini>right</Button>
              <Button onClick={this.setAlign.bind(this, 'top')} mini>top</Button>
              <br />
              <br />
              <Form labelWidth="80" labelAlign={labelAlign}>
                <Form.Item label="Input">
                  <Input width="200"></Input>
                </Form.Item>
                <Form.Item label="Select">
                  <Select value="" width="200">
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
            </div>
            <div>
              <code>Form</code>内部结构，每个单域由
            <code>Form.Item</code>组成，通过
            <code>label</code>可以设置
            <code>Form.Item</code>标签，
            <code>lableWidth</code>可以设置标签的宽度，
            <code>labelAlign</code>可以设置标签对其方式
          </div>
            <div>{code.base}</div>
          </Demo>
          {/* <Demo title="自定义验证">
            <div>
              <Form model={customForm} rules={customRules} labelWidth="80" ref="customForm">
                <Form.Item label="userName" prop="userName">
                  <Input value={customForm.userName} />
                </Form.Item>
                <Form.Item label="password" prop="password">
                  <Input value={customForm.password} type="password" />
                </Form.Item>
                <Form.Item label="Confrim" prop="rePassword">
                  <Input value={customForm.rePassword} type="password" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={() => this.submitForm('customForm')}>Submit</Button>
                  <Button style="margin-left: 10px" onClick={() => this.resetForm('customForm')}>Reset</Button>
                </Form.Item>
              </Form>
            </div>
            <div>在
            <code>rules</code>里面设置
            <code>validator</code>方法，可以自定义验证，详细查阅下方的
            <code>rules API</code>
            </div>
            <div>{code.customValid}</div>
          </Demo> */}
        </Col>
        <Col span="12">
          <Demo title="表单验证">
            <div>
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
            </div>
            <div>给
            <code>Form</code>设置
            <code>rules</code>属性，给每个要验证的标签添加
            <code>prop</code>属性，
            <code>validate</code>用来验证表单，
            <code>resetFields</code>用来重置表单
          </div>
            <div>{code.invalid}</div>
          </Demo>

        </Col>
      </Row>
      <h3>Form API</h3>
      <div className="table-border">
        <table>
          <tbody>
            <tr>
              <th>属性</th>
              <th>说明</th>
              <th>类型</th>
              <th>默认值</th>
            </tr>
            <tr>
              <td>model</td>
              <td>表单数据对象</td>
              <td>Object</td>
              <td>-</td>
            </tr>
            <tr>
              <td>rules</td>
              <td>表单验证规则，</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>labelWidth</td>
              <td>表单域标签的宽度，所有的 Form.Item 都会继承 Form 组件的 labelWidth 的值</td>
              <td>Number,String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>labelAlign</td>
              <td>表单域标签的位置，可选值为 left、right、top</td>
              <td>String</td>
              <td>right</td>
            </tr>
            <tr>
              <td>validate</td>
              <td>对整个表单进行校验，参数为检验完的回调，会返回一个 Boolean 表示成功与失败，暂不支持异步验证</td>
              <td>Function</td>
              <td>-</td>
            </tr>
            <tr>
              <td>validateField</td>
              <td>对表单单个字段进行校验的方法</td>
              <td>Function</td>
              <td>-</td>
            </tr>
            <tr>
              <td>resetFields</td>
              <td>对整个表单进行重置，将所有字段值重置为空并移除校验结果</td>
              <td>Function</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>Form.Item API</h3>
      <div className="table-border">
        <table>
          <tbody>
            <tr>
              <th>属性</th>
              <th>说明</th>
              <th>类型</th>
              <th>默认值</th>
            </tr>
            <tr>
              <td>prop</td>
              <td>对应表单域 model 里的字段，表单验证必须字段</td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>label</td>
              <td>标签文本</td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>rules</td>
              <td>表单验证规则</td>
              <td>Array</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>rules API</h3>
      <div className="table-border">
        <table>
          <tbody>
            <tr>
              <th>属性</th>
              <th>说明</th>
              <th>类型</th>
              <th>默认值</th>
            </tr>
            <tr>
              <td>required</td>
              <td>是否必填字段</td>
              <td>Boolean</td>
              <td>false</td>
            </tr>
            <tr>
              <td>trigger</td>
              <td>校验触发方式，提供
              <code>blur</code>失去焦点，
              <code>change</code>值被改变两种方式触发</td>
              <td>String</td>
              <td>blur</td>
            </tr>
            <tr>
              <td>message</td>
              <td>校验不通过提示语</td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>validator</td>
              <td>自定义校验方法，可参见示例</td>
              <td>Function</td>
              <td>-</td>
            </tr>
            <tr>
              <td>type</td>
              <td>数据类型校验，提供三种校验方式
              <code>mobile</code>手机，
              <code>mail</code>邮箱，
              <code>number</code>数字类型判断</td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>pattner</td>
              <td>自定义正则校验，比喻密码强度包含数字，字母，特殊符号可以这么写
              <code>/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,20}/</code>
              </td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>min</td>
              <td>字段长度最小值校验</td>
              <td>String</td>
              <td>-</td>
            </tr>
            <tr>
              <td>max</td>
              <td>字段长度最大值校验</td>
              <td>String</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>)
  }
} 