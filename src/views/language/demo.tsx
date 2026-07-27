import dayjs from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/zh-cn";
import { useRef, useState } from "react";
import { Button } from "../../../components/button";
import ConfigProvider from "../../../components/config";
import DatePicker from "../../../components/date-picker";
import Drawer from "../../../components/drawer";
import { Form, FormItem } from "../../../components/form";
import { KImage } from "../../../components/image";
import { Input } from "../../../components/input";
import InputNumber from "../../../components/input-number";
import de from "../../../components/locale/de";
import en from "../../../components/locale/en";
import zh from "../../../components/locale/zh-CN";
import message from "../../../components/message";
import Modal, { modal } from "../../../components/modal";
import Page from "../../../components/page";
import Popconfirm from "../../../components/popconfirm";
import { RadioGroup } from "../../../components/radio";
import { Select } from "../../../components/select";
import Space from "../../../components/space";
import Table from "../../../components/table";
import TreeSelect from "../../../components/tree-select";
import Upload, { type UploadFile } from "../../../components/upload";
const locales = { en, zh, de },
  columns = [
    { title: "Name", key: "name" },
    { title: "Age", key: "age" },
  ],
  fileList: UploadFile[] = [
    {
      url: "https://cdn.chuchur.com/upload/demo/test_300.jpg",
      status: "uploading",
      filename: "test.jpg",
      size: "222kb",
      percent: 50,
    },
    {
      url: "https://cdn.chuchur.com/upload/demo/test_300.jpg",
      status: "error",
      filename: "test.jpg",
      size: "222kb",
    },
  ];
export default function LanguageDemo() {
  const [lang, setLang] = useState<keyof typeof locales>("en"),
    [loading, setLoading] = useState(false),
    [visible, setVisible] = useState(false),
    [drawer, setDrawer] = useState(false),
    [form, setForm] = useState({ name: "", email: "", age: "" });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const change = (value: keyof typeof locales) => {
    setLang(value);
    dayjs.locale(value === "zh" ? "zh-cn" : value);
  };
  const search = () => {
    setLoading(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLoading(false), 1000);
  };
  return (
    <Space vertical block>
      <Space>
        <code>Language:</code>
        <RadioGroup
          value={lang}
          onChange={change}
          type="button"
          options={[
            { value: "en", label: "English" },
            { value: "zh", label: "中文" },
            { value: "de", label: "Deutsch" },
          ]}
        />
      </Space>
      <ConfigProvider locale={locales[lang]}>
        <Space vertical block>
          <Space wrap>
            <DatePicker mode="year" />
            <DatePicker mode="month" />
            <DatePicker />
            <DatePicker mode="time" />
            <DatePicker mode="dateTime" />
            <DatePicker mode="dateRange" />
          </Space>
          <Space>
            <Select style={{ width: 120 }} />
            <Select
              value={[]}
              multiple
              style={{ width: 120 }}
              onSearch={search}
              loading={loading}
            />
          </Space>
          <Page total={50} showTotal showSizer showElevator />
          <Space>
            <Button onClick={() => setVisible(true)}>Modal</Button>
            <Button
              onClick={() =>
                modal.info({
                  title: "Hello",
                  content: "modal info.",
                  onOk: () => message.info("info"),
                })
              }
            >
              Info
            </Button>
            <Button
              onClick={() =>
                modal.confirm({
                  title: "Are you sure?",
                  content: "This operation cannot be undone.",
                  onOk: () => message.success("confirmed"),
                  onCancel: () => message.info("cancelled"),
                })
              }
            >
              Confirm
            </Button>
            <Popconfirm title="Are you sure?">
              <Button>Pop Confirm</Button>
            </Popconfirm>
            <Button onClick={() => setDrawer(true)}>Open Drawer</Button>
          </Space>
          <Table columns={columns} />
          <Space>
            TreeSelect: <TreeSelect treeData={[]} style={{ width: 180 }} />
          </Space>
          <Space>
            Image:{" "}
            <KImage width={120} height={120} src="https://cdn.chuchur.com/upload/cat/cat1.jpg" />
          </Space>
          <Upload
            action="https://www.chuchur.com/api/upload/image"
            name="file"
            directory
            fileList={fileList}
          >
            <Button>Click to upload</Button>
          </Upload>
          <Space block style={{ maxWidth: 500 }}>
            <Form
              model={form}
              onChange={() => setForm({ ...form })}
              rules={{
                name: [{ required: true }],
                email: [{ required: true }, { type: "mail" }],
                age: [{ required: true }, { type: "number", min: 10, max: 50 }],
              }}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
            >
              <FormItem label="Name" prop="name">
                <Input />
              </FormItem>
              <FormItem label="Email" prop="email">
                <Input />
              </FormItem>
              <FormItem label="Age" prop="age">
                <InputNumber />
              </FormItem>
              <FormItem wrapperCol={{ offset: 6 }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button style={{ margin: "0 10px" }} htmlType="reset">
                  Reset
                </Button>
              </FormItem>
            </Form>
          </Space>
          <Modal
            open={visible}
            title="Basic Modal"
            onClose={() => setVisible(false)}
            onCancel={() => setVisible(false)}
            onOk={() => setVisible(false)}
          />
          <Drawer
            open={drawer}
            title="Basic Drawer"
            onClose={() => setDrawer(false)}
            onCancel={() => setDrawer(false)}
            onOk={() => setDrawer(false)}
          />
        </Space>
      </ConfigProvider>
    </Space>
  );
}
