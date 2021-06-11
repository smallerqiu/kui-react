<cn>
#### 对齐方式
根据具体目标和制约因素，选择最佳的标签对齐方式。
</cn>

```tsx
import { Form , Input , Select, Radio, DatePicker } from 'react-kui';

const { Option } = Select

const layout = {
  labelCol:{ span:5 },
  wrapperCol: { span:16 },
}

const Demo = () => {

  const [align,setAlign] = React.useState('left')

  return(
    <div style={{width:512}}>
      <Form labelAlign={align} {...layout}>
        <Form.Item label="Align">
          <Radio.Group value={align} onChange={setAlign}>
            <Radio.Button value="left" label="Left" />
            <Radio.Button value="top" label="Top" />
            <Radio.Button value="right" label="Right" />
          </Radio.Group>
        </Form.Item>
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
      </Form>
    </div>
  )
}
ReactDOM.render(<Demo />, mountNode )
```