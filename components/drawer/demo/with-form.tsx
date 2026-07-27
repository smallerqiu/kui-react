import { House } from "kui-icons";
import { useRef, useState } from "react";
import { Button } from "../../button";
import { Checkbox, CheckboxGroup } from "../../checkbox";
import { Form, FormItem, type FormExpose } from "../../form";
import Input, { TextArea } from "../../input";
import InputNumber from "../../input-number";
import message from "../../message";
import { Radio, RadioGroup } from "../../radio";
import Space from "../../space";
import Drawer from "../index";
const rules = {
  input: [{ required: true }],
  number: [{ required: true }],
  radios: [{ required: true }],
  checkbox_group: [{ required: true }],
  textarea: [
    { required: true, message: "必填", trigger: "blur" },
    { min: 2, max: 5, message: "长度为2-5个字符" },
  ],
};
export default function WithForm() {
  const [show1, setShow1] = useState(false),
    [show2, setShow2] = useState(false),
    ref = useRef<FormExpose>(null),
    model = { input: "", number: "", radios: "", checkbox_group: [], textarea: "" };
  const submit = () =>
    ref.current?.validate(({ valid }) => {
      message[valid ? "success" : "error"](valid ? "Successfully" : "Failed");
      if (valid) setShow1(false);
    });
  return (
    <div>
      <Space>
        <Button onClick={() => setShow1(true)}>Drawer with forms</Button>
        <Button onClick={() => setShow2(true)}>Custom</Button>
      </Space>
      <Drawer
        open={show1}
        title="Forms valid"
        onClose={() => setShow1(false)}
        onOk={submit}
        onCancel={() => ref.current?.reset()}
      >
        <Form
          ref={ref}
          model={model}
          rules={rules}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
        >
          <FormItem label="Input" prop="input">
            <Input clearable icon={House} />
          </FormItem>
          <FormItem label="Number" prop="number">
            <InputNumber />
          </FormItem>
          <FormItem label="RadioGroup" prop="radios">
            <RadioGroup>
              <Radio value="0" label="Wuhan" />
              <Radio value="1" label="Shenzhen" />
            </RadioGroup>
          </FormItem>
          <FormItem label="CheckboxGroup" prop="checkbox_group">
            <CheckboxGroup>
              <Checkbox value="0" label="Wuhan" />
              <Checkbox value="1" label="Hangzhou" />
            </CheckboxGroup>
          </FormItem>
          <FormItem label="Text" prop="textarea">
            <TextArea placeholder="Please enter something..." />
          </FormItem>
        </Form>
      </Drawer>
      <Drawer
        open={show2}
        title="I am custom title"
        onClose={() => setShow2(false)}
        footerSlot={
          <Space>
            <Button onClick={() => setShow2(false)}>Cancel</Button>
            <Button type="danger">Reject</Button>
            <Button>Inject</Button>
          </Space>
        }
      >
        <p>Content...</p>
      </Drawer>
    </div>
  );
}
