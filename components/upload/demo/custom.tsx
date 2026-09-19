import { Upload as UploadIcon } from "kui-icons";
import { useRef, useState } from "react";
import { Button, Space, Upload, type UploadFile, type UploadRef } from "react-kui";
import { action, headers } from "./shared";

const requestData = { type: "image", time: Date.now() };

export default function App() {
  const ref = useRef<UploadRef>(null),
    [disabled, setDisabled] = useState(true);
  return (
    <Space vertical>
      <Upload
        ref={ref}
        action={action}
        name="file"
        headers={headers}
        data={requestData}
        autoTrigger={false}
        onSelectFiles={(files: UploadFile[]) => {
          console.log(files);
          setDisabled(files.length === 0);
        }}
        multiple
      >
        <Button icon={UploadIcon}>Click to choose file</Button>
      </Upload>
      <Button disabled={disabled} onClick={() => ref.current?.upload()}>
        Starting Upload
      </Button>
    </Space>
  );
}
