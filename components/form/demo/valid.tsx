import { useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Form,
  FormItem,
  Input,
  InputNumber,
  message,
  Option,
  Radio,
  RadioGroup,
  Rate,
  Select,
  Slider,
  KSwitch as Switch,
  TextArea,
  TreeSelect,
  type FormExpose,
  type FormRule,
  type SizeType,
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
const initial = {
  email: "",
  number: undefined as number | undefined,
  password: "",
  confirm_password: "",
  phone: "",
  captcha: "",
  slider: 3,
  rate: 0,
  tree: "",
  gender: "",
  one: false,
  system: "",
  birthday: "",
  country: "",
  city: "",
  hobbies: [] as string[],
  hardcore: false,
  other: "",
  readme: false,
};
export default function App() {
  const ref = useRef<FormExpose>(null);
  const [form, setForm] = useState({ ...initial }),
    [size, setSize] = useState<SizeType>("medium"),
    [time, setTime] = useState(60);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    []
  );
  const custom =
    (test: (v: any) => boolean, msg: string) => (_: FormRule, v: any, cb: (e?: Error) => void) =>
      cb(test(v) ? undefined : new Error(msg));
  const rules = {
    email: [
      { type: "mail", message: "Please input a valid email" },
      { required: true, message: "The email is required" },
    ],
    number: [
      { type: "number", message: "Please input a valid number" },
      { required: true, message: "The number is required" },
    ],
    password: [
      { min: 8, max: 20, message: "Password length must be 8-20." },
      { required: true, message: "The password is required" },
    ],
    confirm_password: [
      { validator: custom((v) => v === form.password, "Please confirm the password") },
      { required: true, message: "Please confirm the password" },
    ],
    phone: [
      { type: "mobile", message: "Please input the correct phone number" },
      { required: true, message: "Please input your phone number" },
    ],
    captcha: [
      { type: "number", message: "The captcha must be a number" },
      { required: true, message: "Please input the captcha" },
    ],
    birthday: [{ required: true, message: "Please select your birthday" }],
    country: [{ required: true, message: "Please select your country" }],
    city: [{ required: true, message: "Please select your city" }],
    tree: [{ required: true, message: "Please select your food" }],
    slider: [{ min: 5, max: 50, message: "Value must be 5-50" }],
    rate: [
      { required: true, message: "Please select your rate" },
      { min: 1, message: "The minimum value is 1" },
    ],
    gender: [{ required: true, message: "Please select your gender" }],
    one: [{ required: true, message: "Please select this option" }],
    system: [{ required: true, message: "Please select your system" }],
    hardcore: [{ required: true, message: "Please enable this option" }],
    readme: [{ validator: custom((v) => v === true, "Please read the terms") }],
    hobbies: [
      { required: true, message: "Please select your hobbies" },
      { min: 2, max: 3, message: "Select 2 to 3 hobbies" },
    ],
    other: [
      { required: true, message: "Please fill in other information" },
      { max: 10, message: "Maximum characters is 10" },
    ],
  } as Record<string, FormRule[]>;
  const sendCode = () => {
    setTime(59);
    message.success("The verification code has been sent.");
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(
      () =>
        setTime((v) => {
          if (v <= 1) {
            if (timer.current) clearInterval(timer.current);
            return 60;
          }
          return v - 1;
        }),
      1000
    );
  };
  const setValue = () =>
    setForm({
      email: "master@k-ui.cn",
      password: "abc@123@123",
      confirm_password: "abc@123@123",
      phone: "13888888888",
      captcha: "8888",
      gender: "1",
      slider: 5,
      rate: 5,
      number: 5,
      tree: "0",
      system: "0",
      one: true,
      birthday: "1995-05-05",
      country: "1",
      city: "1",
      hobbies: ["0", "1"],
      hardcore: true,
      other: "Test data",
      readme: true,
    });
  return (
    <div style={{ maxWidth: 600 }}>
      <Form
        ref={ref}
        model={form}
        onChange={() => setForm({ ...form })}
        size={size}
        rules={rules}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <FormItem label="Size">
          <RadioGroup
            value={size}
            onChange={setSize}
            type="button"
            options={["large", "medium", "small"].map((value) => ({ value, label: value }))}
          />
        </FormItem>
        <FormItem label="E-mail" prop="email">
          <Input clearable placeholder="Please enter your email" />
        </FormItem>
        <FormItem label="Number" prop="number">
          <InputNumber placeholder="Please enter your number" />
        </FormItem>
        <FormItem label="Password" prop="password">
          <Input type="password" />
        </FormItem>
        <FormItem label="Confirm Password" prop="confirm_password">
          <Input type="password" />
        </FormItem>
        <FormItem label="Phone Number" prop="phone">
          <Input />
        </FormItem>
        <FormItem label="Captcha" prop="captcha">
          <Input
            suffix={
              <Button size={size} disabled={time !== 60} onClick={sendCode}>
                {time === 60 ? "Get verification code" : `${time}(s)`}
              </Button>
            }
          />
        </FormItem>
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
        <FormItem label="TreeSelect" prop="tree">
          <TreeSelect treeData={treeData} style={{ width: "100%" }} />
        </FormItem>
        <FormItem label="Slider" prop="slider">
          <Slider />
        </FormItem>
        <FormItem label="Rate" prop="rate">
          <Rate />
        </FormItem>
        <FormItem label="Gender" prop="gender">
          <RadioGroup
            options={[
              { value: 0, label: "Girl" },
              { value: 1, label: "Boy" },
            ]}
          />
        </FormItem>
        <FormItem label="One" prop="one">
          <Radio label="Only One?" />
        </FormItem>
        <FormItem label="System" prop="system">
          <RadioGroup
            type="button"
            options={["Mac OS", "Windows", "Linux"].map((label, value) => ({ value, label }))}
          />
        </FormItem>
        <FormItem label="Birthday" prop="birthday">
          <DatePicker clearable />
        </FormItem>
        <FormItem label="Hobby" prop="hobbies">
          <CheckboxGroup
            options={["Football", "Music", "Photograph", "Tennis"].map((label, i) => ({
              value: String(i),
              label,
            }))}
          />
        </FormItem>
        <FormItem label="Hardcore" prop="hardcore">
          <Switch trueText="Yes" falseText="No" />
        </FormItem>
        <FormItem label="Other" prop="other">
          <TextArea placeholder="Maximum 10 characters" />
        </FormItem>
        <FormItem prop="readme" wrapperCol={{ offset: 6 }}>
          <Checkbox>I have read the terms of service</Checkbox>
        </FormItem>
        <FormItem wrapperCol={{ offset: 6 }}>
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
          <Button style={{ margin: "0 10px" }} onClick={() => ref.current?.reset()}>
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
