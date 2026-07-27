import { useState } from "react";
import { Button } from "../../button";
import { CheckboxGroup } from "../../checkbox";
import { Input, TextArea } from "../../input";
import message from "../../message";
import { Option, Select } from "../../select";
import { Form, FormItem, type FormSubmitEvent } from "../index";
import type { FormRule } from "../types";
const initial = {
  number: "",
  text: "",
  email: "",
  phone: "",
  password: "",
  confirm_password: "",
  country: "",
  city: "",
  hobbies: [] as string[],
  other: "",
};
export default function Length() {
  const [form, setForm] = useState({ ...initial });
  const validatePass = (_: FormRule, value: any, cb: (e?: Error) => void) =>
    cb(value !== form.password ? new Error("The two passwords do not match!") : undefined);
  const rules = {
    number: [
      { required: true, message: "The number is required" },
      { type: "number", message: "Only numbers can be entered" },
    ],
    text: [
      { required: true, message: "The text is required" },
      { max: 5, message: "Maximum of 5 characters" },
    ],
    email: [
      { type: "mail", message: "Please enter the correct email" },
      { required: true, message: "The email is required" },
    ],
    phone: [
      { type: "mobile", message: "Please enter the correct phone number" },
      { required: true, message: "Please enter the phone number" },
    ],
    password: [
      { min: 8, max: 20, message: "Please keep the password length between 8-20 digits." },
      { required: true, message: "Please enter the password" },
    ],
    confirm_password: [
      { min: 8, max: 20, message: "Please keep the password length between 8-20 digits." },
      { validator: validatePass },
      { required: true, message: "Please enter the password again" },
    ],
    country: [{ required: true, message: "Please select the country" }],
    city: [{ required: true, message: "Please select the city" }],
    hobbies: [
      { required: true, message: "Please select at least one hobby" },
      { min: 2, max: 3, message: "Select 2 to 3 hobbies" },
    ],
    other: [
      { required: true, message: "Please input others" },
      { max: 5, message: "Maximum of 5 characters" },
    ],
  } as Record<string, FormRule[]>;
  const submit = (e: FormSubmitEvent) =>
    message[e.valid ? "success" : "error"](e.valid ? "success" : "failed");
  const setValue = () =>
    setForm({
      number: "123",
      text: "abcd",
      email: "master@k-ui.cn",
      password: "abc@123@123",
      confirm_password: "abc@123@123",
      phone: "13888888888",
      country: "1",
      city: "1",
      hobbies: ["0", "1"],
      other: "abcd",
    });
  return (
    <div style={{ maxWidth: 600 }}>
      <Form
        name="rules"
        rules={rules}
        model={form}
        onChange={() => setForm({ ...form })}
        onSubmit={submit}
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 6 }}
      >
        {[
          ["Number", "number", "Verify numbers"],
          ["Text", "text", "Validate character length"],
          ["E-mail", "email", "Verify e-mail"],
          ["Phone Number", "phone", "Verify phone number"],
          ["Password", "password", "Verify password"],
          ["Confirm Password", "confirm_password", "Verify confirm password"],
        ].map(([label, prop, placeholder]) => (
          <FormItem key={prop} label={label} prop={prop}>
            <Input
              clearable
              type={prop.includes("password") ? "password" : undefined}
              placeholder={placeholder}
            />
          </FormItem>
        ))}
        <FormItem label="Country">
          <FormItem prop="country" wrapperCol={{ span: 24 }}>
            <Select clearable style={{ width: "100%" }}>
              <Option value="0" label="China" />
              <Option value="1" label="Russia" />
            </Select>
          </FormItem>
          <FormItem prop="city" wrapperCol={{ span: 24 }}>
            <Select clearable style={{ width: "100%" }}>
              <Option value="0" label="Shanghai" />
              <Option value="1" label="Wuhan" />
              <Option value="2" label="Hangzhou" />
            </Select>
          </FormItem>
        </FormItem>
        <FormItem label="Hobby" prop="hobbies">
          <CheckboxGroup
            options={["Football", "Music", "Photograph", "Tennis"].map((label, i) => ({
              value: String(i),
              label,
            }))}
          />
        </FormItem>
        <FormItem label="Other" prop="other">
          <TextArea placeholder="Verify the information you entered" />
        </FormItem>
        <FormItem wrapperCol={{ offset: 6 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button style={{ margin: "0 10px" }} htmlType="reset">
            Reset
          </Button>
          <Button theme="dashed" onClick={setValue}>
            Set Value
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}
