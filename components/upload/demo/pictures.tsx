import { useState } from "react";
import { Button, Space, Upload, type UploadFile } from "react-kui";
import { action, headers } from "./shared";
const initial: UploadFile[] = [
  {
    url: "https://cdn.chuchur.com/upload/demo/test_300.jpg",
    status: "uploading",
    filename: "test.jpg",
    size: "222kb",
    percent: 50,
  },
  {
    url: "https://cdn.chuchur.com/upload/cat/cat1.jpg",
    status: "success",
    filename: "cat.jpg",
    size: "180kb",
  },
  {
    url: "https://cdn.chuchur.com/upload/demo/test_300.jpg",
    status: "error",
    filename: "test.jpg",
    size: "222kb",
  },
];
export default function App() {
  const [files, setFiles] = useState(initial);
  return (
    <Space vertical>
      <Button
        onClick={() =>
          setFiles([
            {
              url: "https://cdn.chuchur.com/upload/cat/cat1.jpg",
              status: "uploading",
              filename: "test.jpg",
              size: "222kb",
              percent: 50,
            },
          ])
        }
      >
        change
      </Button>
      <Upload
        action={action}
        name="file"
        type="picture"
        sortable
        headers={headers}
        onChange={({ file, fileList }) => {
          if (file.status !== "uploading") console.log(file, fileList);
        }}
        fileList={files}
        onSort={({ fileList }) => setFiles(fileList)}
        accept="image/*"
        uploadText="Upload Avatar"
      />
    </Space>
  );
}
