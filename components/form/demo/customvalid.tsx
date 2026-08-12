import { useRef, useState } from "react";
import { Button, Input, message, Form, FormItem, type FormExpose, type FormRule } from "react-kui";
const labelCol = { span: 5 },
  wrapperCol = { span: 16 };
export default function App() {
  const ref = useRef<FormExpose>(null);
  const [form, setForm] = useState({
    fullname: "",
    IDnumber: "",
    password: "",
    confirm_password: "",
  });
  const validateID = (_: FormRule, value: unknown, cb: (e?: Error) => void) =>
    cb(
      typeof value === "string" &&
        value !== "" &&
        !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
        ? new Error("Please enter the correct ID number")
        : undefined
    );
  const validatePassword = (_: FormRule, value: unknown, cb: (e?: Error) => void) => {
    cb(!value ? new Error("Please input your password") : undefined);
    if (value) ref.current?.test("confirm_password");
  };
  const validateAgain = (_: FormRule, value: unknown, cb: (e?: Error) => void) =>
    cb(
      !value
        ? new Error("Please input your password again")
        : value !== form.password
          ? new Error("The two passwords do not match.")
          : undefined
    );
  const rules = {
    fullname: [
      { required: true, message: "Please input your name" },
      { message: "Name must be in Chinese", pattern: /^[\u4e00-\u9fa5]+$/ },
    ],
    IDnumber: [{ validator: validateID }],
    password: [{ validator: validatePassword }],
    confirm_password: [{ validator: validateAgain }],
  };
  return (
    <div style={{ maxWidth: 600 }}>
      <Form
        ref={ref}
        model={form}
        onChange={() => setForm({ ...form })}
        rules={rules}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        <FormItem label="Name" prop="fullname">
          <Input clearable />
        </FormItem>
        <FormItem label="ID Card Number" prop="IDnumber">
          <Input placeholder="Optional" />
        </FormItem>
        <FormItem label="Password" prop="password">
          <Input type="password" placeholder="Please input your password" />
        </FormItem>
        <FormItem label="Confirm Password" prop="confirm_password">
          <Input type="password" placeholder="Please confirm your password" />
        </FormItem>
        <FormItem wrapperCol={{ offset: 5 }}>
          <Button
            type="primary"
            onClick={() =>
              ref.current?.validate(({ valid }) =>
                message[valid ? "success" : "error"](valid ? "success" : "failed")
              )
            }
          >
            Submit
          </Button>
          <Button style={{ marginLeft: 10 }} onClick={() => ref.current?.reset()}>
            Reset
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}
