import { useState } from "react";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Form,
  FormItem,
  Input,
  InputNumber,
  Option,
  Radio,
  RadioButton,
  RadioGroup,
  Select,
  Slider,
  Space,
  Switch,
  TextArea,
  TreeSelect,
  type ShapeType,
  type SizeType,
  type ThemeType,
} from "react-kui";
const treeData = [
  {
    title: "food",
    key: "0",
    children: [
      { title: "apple", key: "0-1" },
      { title: "orange", key: "0-2" },
    ],
  },
];
export default function App() {
  const [disabled, setDisabled] = useState(false),
    [size, setSize] = useState<SizeType>("medium"),
    [shape, setShape] = useState<ShapeType>("round"),
    [theme, setTheme] = useState<ThemeType>("fill");
  return (
    <div>
      <Space>
        <Checkbox
          checked={disabled}
          onChange={(event) => setDisabled(event.checked)}
          label="Form disabled"
        />
      </Space>
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        disabled={disabled}
        size={size}
        shape={shape}
        theme={theme}
      >
        <FormItem label="Shape">
          <RadioGroup value={shape} onChange={setShape}>
            <Radio value="round" label="Round" />
            <Radio value="circle" label="Circle" />
            <Radio value="square" label="Square" />
          </RadioGroup>
        </FormItem>
        <FormItem label="Theme">
          <RadioGroup value={theme} onChange={setTheme}>
            <Radio value="fill" label="Fill" />
            <Radio value="outline" label="Outline" />
          </RadioGroup>
        </FormItem>
        <FormItem label="Size">
          <RadioGroup value={size} onChange={setSize} type="button">
            <RadioButton value="large" label="Large" />
            <RadioButton value="medium" label="Medium" />
            <RadioButton value="small" label="Small" />
          </RadioGroup>
        </FormItem>
        <FormItem label="Input">
          <Input placeholder="input..." />
        </FormItem>
        <FormItem label="InputNumber">
          <InputNumber placeholder="input number..." />
        </FormItem>
        <FormItem label="Select">
          <Select style={{ width: "100%" }}>
            <Option value="0" label="Apple" />
            <Option value="1" label="Banana" />
            <Option value="2" label="Orange" />
          </Select>
        </FormItem>
        <FormItem label="TreeSelect">
          <TreeSelect style={{ width: "100%" }} treeData={treeData} />
        </FormItem>
        <FormItem label="Slider">
          <Slider />
        </FormItem>
        <FormItem label="DatePicker">
          <DatePicker />
        </FormItem>
        <FormItem label="Radio">
          <RadioGroup>
            <Radio value="0" label="Apple" />
            <Radio value="1" label="Banana" />
            <Radio value="2" label="Orange" />
          </RadioGroup>
        </FormItem>
        <FormItem label="Checkbox">
          <CheckboxGroup>
            <Checkbox value="0" label="Apple" />
            <Checkbox value="1" label="Banana" />
            <Checkbox value="2" label="Orange" />
          </CheckboxGroup>
        </FormItem>
        <FormItem label="Switch">
          <Switch trueText="Yes" falseText="No" />
        </FormItem>
        <FormItem label="Text">
          <TextArea placeholder="Please input..." />
        </FormItem>
        <FormItem wrapperCol={{ offset: 5 }}>
          <Button type="primary">Submit</Button>
          <Button style={{ marginLeft: 10 }}>Cancel</Button>
        </FormItem>
      </Form>
    </div>
  );
}
