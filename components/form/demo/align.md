<cn>
#### 对齐方式
根据具体目标和制约因素，选择最佳的标签对齐方式。
</cn>

```tsx
import { Form , Input , Select, Radio, DatePicker ,Button} from 'react-kui';

const { Option } = Select

const layoutSpan = {
  labelCol:{ span:5 },
  wrapperCol: { span:6 },
}

const Demo = () => {

  const [layout,setLayout] = React.useState('horizontal')

  return(
    <div>
      <Form layout={layout} {...layoutSpan}>
        <Form.Item label="Layout">
          <Radio.Group value={layout} onChange={setLayout}>
            <Radio.Button value="horizontal" label="Horizontal" />
            <Radio.Button value="vertical" label="Vertical" />
            <Radio.Button value="inline" label="Inline" />
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
        <Form.Item wrapperCol={{offset:5}}>
          <Button type="primary">Submit</Button>
        </Form.Item>
      </Form>
    </div>
  )
}
ReactDOM.render(<Demo />, mountNode )
```