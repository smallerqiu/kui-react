import { useState } from "react";
import { Button, DatePicker, Input, Segmented, Option, Select, Form, FormItem } from "react-kui";
import type { DirectionType } from "react-kui";
export default function App() {
  const [layout, setLayout] = useState<DirectionType>("horizontal");
  return (
    <Form layout={layout} labelCol={{ span: 5 }} wrapperCol={{ span: 6 }}>
      <FormItem label="Layout">
        <Segmented
          value={layout}
          onChange={(value) => setLayout(value as DirectionType)}
          options={["horizontal", "vertical", "inline"].map((value) => ({ value, label: value }))}
        />
      </FormItem>
      <FormItem label="Input">
        <Input />
      </FormItem>
      <FormItem label="Select">
        <Select style={{ width: "100%" }}>
          <Option value="0" label="Apple" />
          <Option value="1" label="Banana" />
          <Option value="2" label="Orange" />
        </Select>
      </FormItem>
      <FormItem label="DatePicker">
        <DatePicker />
      </FormItem>
      <FormItem wrapperCol={{ offset: 5 }}>
        <Button type="primary">Submit</Button>
      </FormItem>
    </Form>
  );
}
