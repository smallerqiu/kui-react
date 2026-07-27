import { useRef, useState } from "react";
import {
  Button,
  Input,
  message,
  Modal,
  Space,
  Tag,
  Form,
  FormItem,
  type FormExpose,
  type FormSubmitEvent,
  type FormRule,
} from "react-kui";
const labelCol = { span: 6 },
  wrapperCol = { span: 16 };
export default function WithModal() {
  const ref = useRef<FormExpose>(null);
  const [visible, setVisible] = useState(false),
    [group, setGroup] = useState<{ name: string; list: { username: string; age: string }[] }>({
      name: "",
      list: [],
    }),
    [form, setForm] = useState({ username: "", age: "" });
  const rules = { name: [{ required: true, message: "Please input the organization name" }] };
  const userRules = {
    username: [{ required: true, message: "Please input the username" }],
    age: [
      { required: true, message: "Please input the age." },
      { type: "number", message: "Please input the valid age." },
    ],
  } as Record<string, FormRule[]>;
  const submitUser = ({ valid }: FormSubmitEvent) => {
    if (valid) {
      setGroup({ ...group, list: [...group.list, { ...form }] });
      ref.current?.reset();
      setForm({ username: "", age: "" });
      setVisible(false);
    }
  };
  const cancel = () => {
    ref.current?.reset();
    setVisible(false);
  };
  return (
    <div style={{ maxWidth: 512 }}>
      <Form
        name="with-modal"
        model={group}
        onChange={() => setGroup({ ...group })}
        onSubmit={(e) => message[e.valid ? "success" : "error"](e.valid ? "success" : "failed")}
        rules={rules}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        <FormItem label="Group" prop="name">
          <Input />
        </FormItem>
        <FormItem label="UserList">
          <Space>
            {group.list.map((item, i) => (
              <Tag theme="fill" key={i}>
                {item.username} - {item.age}
              </Tag>
            ))}
          </Space>
        </FormItem>
        <FormItem wrapperCol={{ offset: 6 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={() => setVisible(true)} style={{ marginLeft: 10 }}>
            Add User
          </Button>
        </FormItem>
      </Form>
      <Modal
        open={visible}
        title="New User"
        width={450}
        onClose={cancel}
        onCancel={cancel}
        onOk={() => ref.current?.submit()}
      >
        <Form
          ref={ref}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          name="modal"
          model={form}
          onChange={() => setForm({ ...form })}
          rules={userRules}
          onSubmit={submitUser}
        >
          <FormItem label="Username" prop="username">
            <Input placeholder="Please input username" />
          </FormItem>
          <FormItem label="Age" prop="age">
            <Input placeholder="Please input age" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}
