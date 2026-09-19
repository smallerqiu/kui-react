import { useRef, useState } from "react";
import {
  Button,
  Form,
  FormItem,
  Input,
  Space,
  type FormRules,
  type FormSubmitEvent,
} from "react-kui";

const rules: FormRules = {
  name: [{ required: true, message: "请输入姓名" }],
  email: [
    { required: true, message: "请输入邮箱" },
    { type: "mail", message: "邮箱格式不正确" },
  ],
};

export default function App() {
  const [model, setModel] = useState<Record<string, unknown>>({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const [result, setResult] = useState("");
  async function submit({ valid }: FormSubmitEvent) {
    if (!valid || busy.current) return;
    busy.current = true;
    setSaving(true);
    setResult("");
    try {
      const payload = { ...model };
      // Replace this local mock with your API request.
      await new Promise((resolve) => setTimeout(resolve, 200));
      setResult(`已保存：${String(payload.name)}`);
    } catch {
      setResult("保存失败，请重试");
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }
  return (
    <Form
      model={model}
      onChange={setModel}
      rules={rules}
      disabled={saving}
      layout="vertical"
      onSubmit={submit}
      onReset={() => setResult("")}
    >
      <FormItem label="姓名" prop="name">
        <Input />
      </FormItem>
      <FormItem label="邮箱" prop="email">
        <Input />
      </FormItem>
      <Space>
        <Button type="primary" htmlType="submit" loading={saving} disabled={saving}>
          保存
        </Button>
        <Button htmlType="reset" disabled={saving}>
          重置
        </Button>
      </Space>
      <p role="status">{result}</p>
    </Form>
  );
}
