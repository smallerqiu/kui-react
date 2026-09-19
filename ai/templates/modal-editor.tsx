import { useRef, useState } from "react";
import {
  Button,
  Form,
  FormItem,
  Input,
  Modal,
  Space,
  type FormRules,
  type FormSubmitEvent,
} from "react-kui";

const rules: FormRules = { name: [{ required: true, message: "请输入姓名" }] };

export default function App() {
  const [saved, setSaved] = useState({ name: "示例用户" });
  const [model, setModel] = useState<Record<string, unknown>>({ name: "" });
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const [error, setError] = useState("");
  function edit(create: boolean) {
    setModel({ name: create ? "" : saved.name });
    setSession((value) => value + 1);
    setError("");
    setOpen(true);
  }
  async function save({ valid }: FormSubmitEvent) {
    if (!valid || busy.current) return;
    busy.current = true;
    setSaving(true);
    setError("");
    try {
      const payload = { name: String(model.name ?? "") };
      // Replace this local mock with your create/update API request.
      await new Promise((resolve) => setTimeout(resolve, 200));
      setSaved(payload);
      setOpen(false);
    } catch {
      setError("保存失败，请重试");
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }
  return (
    <>
      <Space>
        <Button onClick={() => edit(true)}>新增</Button>
        <Button onClick={() => edit(false)}>编辑</Button>
        <span>{saved.name}</span>
      </Space>
      <Modal open={open} onOpenChange={setOpen} title="用户编辑" footer={false} loading={saving}>
        <Form
          key={session}
          model={model}
          onChange={setModel}
          rules={rules}
          disabled={saving}
          layout="vertical"
          onSubmit={save}
        >
          <FormItem label="姓名" prop="name">
            <Input />
          </FormItem>
          {error && <p role="alert">{error}</p>}
          <Space>
            <Button type="primary" htmlType="submit" loading={saving} disabled={saving}>
              保存
            </Button>
            <Button disabled={saving} onClick={() => setOpen(false)}>
              取消
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
}
