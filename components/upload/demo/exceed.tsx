import { Upload as UploadIcon } from "kui-icons";
import { useState } from "react";
import { Button, message, Upload } from "react-kui";
import { action, headers } from "./shared";
const limit = 2;
export default function App() {
  const [disabled, setDisabled] = useState(false);
  return (
    <Upload
      action={action}
      name="file"
      headers={headers}
      limit={limit}
      minSize={200}
      maxSize={1024}
      onExceed={() => message.warning(`You can upload a maximum of ${limit} files.`)}
      onSizeError={({ file }) => message.warning(`The size of ${file.filename} exceeds the limit`)}
      onChange={({ fileList }) => setDisabled(fileList.length >= limit)}
      onRemove={({ fileList }) => setDisabled(fileList.length >= limit)}
      multiple
    >
      <Button icon={UploadIcon} disabled={disabled}>
        Click to upload (Minimum 200KB, Maximum 1MB, up to {limit} items)
      </Button>
    </Upload>
  );
}
