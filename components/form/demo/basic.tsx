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
    <>
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
          <RadioGroup
            value={shape}
            onChange={setShape}
            options={["round", "circle", "square"].map((value) => ({ value, label: value }))}
          />
        </FormItem>
        <FormItem label="Theme">
          <RadioGroup
            value={theme}
            onChange={setTheme}
            options={["fill", "outline"].map((value) => ({ value, label: value }))}
          />
        </FormItem>
        <FormItem label="Size">
          <RadioGroup
            value={size}
            onChange={setSize}
            type="button"
            options={["large", "medium", "small"].map((value) => ({ value, label: value }))}
          />
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
          <RadioGroup
            options={["Apple", "Banana", "Orange"].map((label, value) => ({
              value: String(value),
              label,
            }))}
          />
        </FormItem>
        <FormItem label="Checkbox">
          <CheckboxGroup
            options={["Apple", "Banana", "Orange"].map((label, value) => ({
              value: String(value),
              label,
            }))}
          />
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
    </>
  );
}
