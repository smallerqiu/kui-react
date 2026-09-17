import { Camera, Upload as UploadIcon } from "kui-icons";
import { useState } from "react";
import {
  Button,
  Form,
  FormItem,
  message,
  Space,
  Upload,
  type FormRule,
  type FormSubmitEvent,
  type UploadFile,
} from "react-kui";
import { action, headers } from "./shared";

interface UploadForm extends Record<string, unknown> {
  avatar: UploadFile[] | null;
  file: UploadFile[] | null;
  files: UploadFile[] | null;
}

const uploaded: FormRule = {
  // Check completion on submit, not during normal upload progress.
  trigger: [],
  validator: (_rule, value, done) => {
    const files = value as UploadFile[] | null;
    if (!files?.length) return done();
    if (files.some((file) => file.status === "error")) {
      return done(new Error("Remove or retry failed files"));
    }
    if (files.some((file) => file.status !== "success")) {
      return done(new Error("Please wait for all files to finish uploading"));
    }
    done();
  },
};

const uploadFailed: FormRule = {
  validator: (_rule, value, done) => {
    const files = value as UploadFile[] | null;
    done(
      files?.some((file) => file.status === "error")
        ? new Error("Remove or retry failed files")
        : undefined,
    );
  },
};

const rules: Record<string, FormRule[]> = {
  avatar: [{ required: true, message: "Please select an avatar" }, uploadFailed, uploaded],
  file: [{ required: true, message: "Please select a file" }, uploadFailed, uploaded],
  files: [{ required: true, message: "Please select at least one file" }, uploadFailed, uploaded],
};

export default function App() {
  const [form, setForm] = useState<UploadForm>({ avatar: [], file: [], files: [] });
  const submit = ({ valid }: FormSubmitEvent) =>
    message[valid ? "success" : "error"](
      valid ? "Validation passed (demo only)" : "Please check the upload fields",
    );
  return (
    <Form
      model={form}
      onChange={(next) => setForm(next as UploadForm)}
      rules={rules}
      wrapperCol={{ span: 16 }}
      labelCol={{ span: 8 }}
      onSubmit={submit}
    >
      <FormItem label="Avatar" prop="avatar">
        <Upload
          action={action}
          name="file"
          type="picture"
          headers={headers}
          limit={1}
          accept="image/*"
          uploadIcon={Camera}
          uploadText="Upload Avatar"
        />
      </FormItem>
      <FormItem label="Single file" prop="file">
        <Upload action={action} name="file" headers={headers} limit={1} accept="image/*">
          <Button icon={UploadIcon}>Upload File</Button>
        </Upload>
      </FormItem>
      <FormItem label="Multiple files" prop="files">
        <Upload action={action} name="file" headers={headers} multiple accept="image/*">
          <Button icon={UploadIcon}>Upload Files</Button>
        </Upload>
      </FormItem>
      <FormItem wrapperCol={{ offset: 8 }}>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit Form
          </Button>
          <Button htmlType="reset">Reset</Button>
        </Space>
      </FormItem>
    </Form>
  );
}
