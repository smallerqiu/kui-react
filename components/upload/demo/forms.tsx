import { Camera, Upload as UploadIcon } from "kui-icons";
import { useRef, useState } from "react";
import { Button } from "../../button";
import { Form, FormItem, type FormExpose, type FormSubmitEvent } from "../../form";
import { Input } from "../../input";
import message from "../../message";
import Upload, { type UploadChangeEvent } from "../index";
import { action, headers } from "./shared";
const urlOf = ({ file }: UploadChangeEvent) =>
  file.response?.url ?? file.url ?? file.filename ?? "";
export default function Forms() {
  const ref = useRef<FormExpose>(null);
  const [form, setForm] = useState({ avatar: "", file: "", files: "" }),
    [loading, setLoading] = useState(false),
    files = useRef<string[]>([]);
  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setTimeout(() => ref.current?.test(key), 0);
  };
  const rules = {
    avatar: [{ required: true, message: "Please select an avatar" }],
    file: [{ required: true, message: "Please select a file" }],
    files: [{ required: true, message: "Please select a file" }],
  };
  const uploadFile = (event: UploadChangeEvent) => {
    setLoading(event.file.status === "uploading");
    if (event.file.status === "success") {
      setLoading(false);
      update("file", urlOf(event));
    }
  };
  const uploadFiles = (event: UploadChangeEvent) => {
    if (event.file.status === "success") {
      files.current = [...files.current, urlOf(event)];
      update("files", files.current.join(","));
    }
  };
  const remove = (event: UploadChangeEvent) => {
    const url = urlOf(event);
    files.current = files.current.filter((item) => item !== url);
    update("files", files.current.join(","));
  };
  const submit = (e: FormSubmitEvent) =>
    message[e.valid ? "success" : "error"](e.valid ? "success" : "failed");
  return (
    <Form
      ref={ref}
      model={form}
      rules={rules}
      onSubmit={submit}
      wrapperCol={{ span: 16 }}
      labelCol={{ span: 8 }}
    >
      <FormItem label="Avatar" prop="avatar">
        <div>
          <Upload
            action={action}
            name="file"
            type="picture"
            headers={headers}
            onChange={(event) => {
              if (event.file.status === "success") update("avatar", urlOf(event));
            }}
            onRemove={() => update("avatar", "")}
            limit={1}
            accept="image/*"
            uploadIcon={Camera}
            uploadText="Upload Avatar"
          />
          <Input type="hidden" value={form.avatar} />
        </div>
      </FormItem>
      <FormItem label="Single file" prop="file">
        <Input
          value={form.file}
          readOnly
          placeholder="Please upload file"
          clearable
          suffix={
            <Upload
              action={action}
              name="file"
              headers={headers}
              onChange={uploadFile}
              showUploadList={false}
              limit={1}
              accept="image/*"
            >
              <Button icon={UploadIcon} loading={loading} />
            </Upload>
          }
        />
      </FormItem>
      <FormItem label="Multiple files" prop="files">
        <div>
          <Upload
            action={action}
            name="file"
            headers={headers}
            onChange={uploadFiles}
            onRemove={remove}
            accept="image/*"
            multiple
          >
            <Button>Upload File</Button>
          </Upload>
          <Input type="hidden" value={form.files} />
        </div>
      </FormItem>
      <FormItem wrapperCol={{ offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit Forms
        </Button>
      </FormItem>
    </Form>
  );
}
