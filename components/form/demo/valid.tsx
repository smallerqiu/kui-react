import { useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Col,
  DatePicker,
  Form,
  FormItem,
  Input,
  InputNumber,
  message,
  Option,
  Radio,
  RadioButton,
  RadioGroup,
  Rate,
  Row,
  Select,
  Slider,
  Switch,
  TextArea,
  TreeSelect,
  type FormRule,
  type FormSubmitEvent,
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
  tree: undefined as string | undefined,
  gender: undefined as number | undefined,
  one: false,
  system: undefined as number | undefined,
  birthday: undefined as Date | undefined,
  country: undefined as string | undefined,
  city: undefined as string | undefined,
  hobbies: [] as string[],
  hardcore: false,
  other: "",
  readme: false,
};
export default function App() {
  const [form, setForm] = useState({ ...initial });
  const [time, setTime] = useState(60);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );
  const custom =
    (test: (v: unknown) => boolean, msg: string) =>
    (_: FormRule, v: unknown, cb: (e?: Error) => void) =>
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
      { min: 8, max: 20, message: "Please keep the password length between 8-20 digits." },
      { required: true, message: "The password is required" },
    ],
    confirm_password: [
      { min: 8, max: 20, message: "Please keep the password length between 8-20 digits." },
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
    slider: [
      { required: true, message: "Please select a value" },
      { min: 5, message: "Minimum value is 5" },
      { max: 50, message: "Maximum value is 50" },
    ],
    rate: [
      { required: true, message: "Please select your rate" },
      { min: 1, message: "The minimum value is 1" },
    ],
    gender: [{ required: true, message: "Please select your gender" }],
    one: [{ required: true, message: "Please select this option" }],
    system: [{ required: true, message: "Please select your system" }],
    hardcore: [{ required: true, message: "Please enable this option" }],
    readme: [
      { validator: custom((v) => v === true, "Please accept the Terms of Service"), required: true },
    ],
    hobbies: [
      { required: true, message: "Please select your hobbies" },
      { max: 3, message: "Maximum value is 3" },
      { min: 2, message: "Minimum value is 2" },
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
      1000,
    );
  };
  const setValue = () =>
    setForm({
      email: "master@k-ui.cn",
      password: "abc@123@123",
      confirm_password: "abc@123@123",
      phone: "13888888888",
      captcha: "8888",
      gender: 1,
      slider: 5,
      rate: 5,
      number: 5,
      tree: "0",
      system: 0,
      one: true,
      birthday: new Date(1995, 4, 5),
      country: "1",
      city: "1",
      hobbies: ["0", "1"],
      hardcore: true,
      other: "Test data",
      readme: true,
    });
  const handleSubmit = ({ valid }: FormSubmitEvent) =>
    message[valid ? "success" : "error"](valid ? "success" : "failed");
  const handleReset = () => {
    if (timer.current) clearInterval(timer.current);
    setTime(60);
  };
  const halfCol = { xs: 24, md: 12 };
  const halfLabelCol = { span: 8 };
  const halfWrapperCol = { span: 16 };
  const fieldProps = { labelCol: halfLabelCol, wrapperCol: halfWrapperCol };
  return (
    <div>
      <Form
      model={form}
      onChange={(next) => setForm(next as typeof form)}
      rules={rules}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      onReset={handleReset}
      onSubmit={handleSubmit}
    >
      <Row>
        <Col {...halfCol}>
          <FormItem label="E-mail" prop="email" {...fieldProps}>
            <Input clearable placeholder="Please enter your email" />
          </FormItem>
        </Col>
        <Col {...halfCol}>
          <FormItem label="Number" prop="number" {...fieldProps}>
            <InputNumber placeholder="Please enter your number" />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col {...halfCol}>
          <FormItem label="Password" prop="password" {...fieldProps}>
            <Input type="password" placeholder="Please enter password" />
          </FormItem>
        </Col>
        <Col {...halfCol}>
          <FormItem label="Confirm Password" prop="confirm_password" {...fieldProps}>
            <Input type="password" placeholder="Please enter password" />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col {...halfCol}>
          <FormItem label="Phone Number" prop="phone" {...fieldProps}>
            <Input placeholder="Please enter phone number" />
          </FormItem>
        </Col>
        <Col {...halfCol}>
          <FormItem label="Captcha" prop="captcha" {...fieldProps}>
            <Input
              placeholder="Please enter captcha"
              addonAfter={
                <Button disabled={time !== 60} htmlType="button" onClick={sendCode}>
                  {time === 60 ? "Get Captcha" : `${time}(s)`}
                </Button>
              }
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col {...halfCol}>
          <FormItem label="Country" prop="country" {...fieldProps}>
            <Select clearable style={{ width: "100%" }}>
              <Option value="0" label="China" />
              <Option value="1" label="Russia" />
            </Select>
          </FormItem>
        </Col>
        <Col {...halfCol}>
          <FormItem label="City" prop="city" {...fieldProps}>
            <Select clearable style={{ width: "100%" }}>
              <Option value="0" label="Shanghai" />
              <Option value="1" label="Wuhan" />
              <Option value="2" label="Hangzhou" />
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col {...halfCol}>
          <FormItem label="TreeSelect" prop="tree" {...fieldProps}>
            <TreeSelect style={{ width: "100%" }} treeData={treeData} />
          </FormItem>
        </Col>
        <Col {...halfCol}>
          <FormItem label="Birthday" prop="birthday" {...fieldProps}>
            <DatePicker clearable />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col {...halfCol}>
          <FormItem label="Slider" prop="slider" {...fieldProps}><Slider /></FormItem>
        </Col>
        <Col {...halfCol}>
          <FormItem label="Rate" prop="rate" {...fieldProps}><Rate /></FormItem>
        </Col>
      </Row>
      <Row>
        <Col {...halfCol}>
          <FormItem label="Gender" prop="gender" {...fieldProps}>
            <RadioGroup>
              <Radio value={0} label="Girl" />
              <Radio value={1} label="Boy" />
            </RadioGroup>
          </FormItem>
        </Col>
        <Col {...halfCol}>
          <FormItem label="One" prop="one" {...fieldProps}><Radio label="Only One?" /></FormItem>
        </Col>
      </Row>
      <Row>
        <Col {...halfCol}>
          <FormItem label="System" prop="system" {...fieldProps}>
            <RadioGroup type="button">
              <RadioButton value={0} label="Mac OS" />
              <RadioButton value={1} label="Windows" />
              <RadioButton value={2} label="Linux" />
            </RadioGroup>
          </FormItem>
        </Col>
        <Col {...halfCol}>
          <FormItem label="Hardcore" prop="hardcore" {...fieldProps}>
            <Switch trueText="Yes" falseText="No" />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col {...halfCol}>
          <FormItem label="Hobby" prop="hobbies" {...fieldProps}>
            <CheckboxGroup>
              <Checkbox value="0" label="Football" />
              <Checkbox value="1" label="Music" />
              <Checkbox value="2" label="Photograph" />
              <Checkbox value="3" label="Tennis" />
            </CheckboxGroup>
          </FormItem>
        </Col>
        <Col {...halfCol}>
          <FormItem label="Other" prop="other" {...fieldProps}>
            <TextArea placeholder="Maximum 10 characters" />
          </FormItem>
        </Col>
      </Row>
      <FormItem prop="readme" wrapperCol={{ offset: 6 }}>
        <Checkbox>I have read the <a>Terms of Service</a></Checkbox>
      </FormItem>
      <FormItem wrapperCol={{ offset: 6 }}>
        <Button type="primary" htmlType="submit">Submit</Button>
        <Button style={{ margin: "0 10px" }} htmlType="reset">Reset</Button>
        <Button theme="dashed" htmlType="button" onClick={setValue}>Set Value</Button>
      </FormItem>
      </Form>
    </div>
  );
}
