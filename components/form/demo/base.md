<cn>
#### 典型表单
包括各种表单项，比如输入框、选择器、开关、单选框、多选框等。
</cn>

```tsx
import { Form ,TextArea , Input , Select,  DatePicker, Radio, Checkbox ,Switch ,Button} from 'react-kui';

const { Option } = Select
const layout = {
  labelCol:{span:5},
  wrapperCol:{span:16},
}

ReactDOM.render(
  <div style={{width:512}}>
   <Form {...layout}> 
    <Form.Item label="Input">
      <Input />
    </Form.Item>
    <Form.Item label="Select">
      <Select >
        <Option value="0" label="Apple" />
        <Option value="1" label="Banana" />
        <Option value="2" label="Orange" />
      </Select>
    </Form.Item>
    <Form.Item label="DatePicker">
      <DatePicker />
    </Form.Item>
    <Form.Item label="Radio">
      <Radio.Group >
        <Radio value="0" label="Apple" />
        <Radio value="1" label="Banana" />
        <Radio value="2" label="Orange" />
      </Radio.Group>
    </Form.Item>
    <Form.Item label="Checkbox">
      <Checkbox.Group >
        <Checkbox value="0" label="Apple" />
        <Checkbox value="1" label="Banana" />
        <Checkbox value="2" label="Orange" />
      </Checkbox.Group>
    </Form.Item>
    <Form.Item label="Switch">
     <Switch trueText="Yes" falseText="No" />
    </Form.Item>
    <Form.Item label="Text">
      <TextArea placeholder="Please input..."/>
    </Form.Item>
    <Form.Item wrapperCol={{offset:5}}>
      <Button type="primary" circle >Submit</Button>
      <Button style={{marginLeft: 10}} circle >Cancel</Button>
    </Form.Item>
    </Form>
  </div>,
  mountNode
)
```