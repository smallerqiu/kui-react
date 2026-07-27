import { Trash2 } from "kui-icons";
import { useRef, useState } from "react";
import {
  Button,
  Input,
  message,
  Col,
  Row,
  Option,
  Select,
  Form,
  FormItem,
  type FormExpose,
} from "react-kui";
export default function DynamicValid() {
  const ref = useRef<FormExpose>(null),
    count = useRef(2);
  const [form, setForm] = useState({
    cname: "",
    info: { gender: "", age: "" },
    webs: [
      { value: "", key: "0" },
      { value: "", key: "1" },
    ],
  });
  const refresh = () => setForm({ ...form, info: { ...form.info }, webs: [...form.webs] });
  const required = (message: string) => ({ required: true, message });
  return (
    <Row>
      <Col span={16}>
        <Form
          ref={ref}
          model={form}
          onChange={refresh}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
        >
          <FormItem label="Name" prop="cname" rules={required("Please input your name")}>
            <Input clearable />
          </FormItem>
          <FormItem label="Gender" prop="info.gender" rules={required("Please select your gender")}>
            <Select clearable style={{ width: "100%" }}>
              <Option value="1" label="Male" />
              <Option value="0" label="Female" />
            </Select>
          </FormItem>
          <FormItem label="Age" prop="info.age" rules={required("Please input your age")}>
            <Input clearable />
          </FormItem>
          {form.webs.map((item, i) => (
            <FormItem
              key={item.key}
              label={`Web Site${item.key}`}
              prop={`webs.${i}.value`}
              rules={required("Web site is required")}
            >
              <Input style={{ width: 230 }} />
              {i > 0 && (
                <Button
                  icon={Trash2}
                  onClick={() => setForm({ ...form, webs: form.webs.filter((_, n) => n !== i) })}
                  style={{ fontSize: 25, margin: "0 10px" }}
                />
              )}
            </FormItem>
          ))}
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
            <Button
              onClick={() => {
                count.current += 1;
                setForm({
                  ...form,
                  webs: [...form.webs, { value: "", key: String(count.current) }],
                });
              }}
              style={{ margin: "0 10px" }}
            >
              Add
            </Button>
            <Button onClick={() => ref.current?.reset()}>Reset</Button>
          </FormItem>
        </Form>
      </Col>
      <Col span={8}>
        <pre style={{ height: "100%", overflow: "scroll", lineHeight: 1.4 }}>
          {JSON.stringify(form, null, 2)}
        </pre>
      </Col>
    </Row>
  );
}
