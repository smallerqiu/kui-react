import { useState } from "react";
import { Button } from "../../button";
import DatePicker from "../../date-picker";
import { Input } from "../../input";
import { RadioGroup } from "../../radio";
import { Option, Select } from "../../select";
import { Form, FormItem } from "../index";
export default function Align() {
  const [layout, setLayout] = useState<any>("horizontal");
  return (
    <Form layout={layout} labelCol={{ span: 5 }} wrapperCol={{ span: 6 }}>
      <FormItem label="Layout">
        <RadioGroup
          value={layout}
          onChange={setLayout}
          type="button"
          theme="card"
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
