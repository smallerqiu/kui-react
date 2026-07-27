import { Upload as UploadIcon } from "kui-icons";
import { useRef, useState } from "react";
import { Button } from "../../button";
import Space from "../../space";
import Upload, { type UploadFile, type UploadRef } from "../index";
import { action, headers } from "./shared";
export default function Custom() {
  const ref = useRef<UploadRef>(null),
    [disabled, setDisabled] = useState(true);
  return (
    <Space vertical>
      <Upload
        ref={ref}
        action={action}
        name="file"
        headers={headers}
        data={{ type: "image", time: Date.now() }}
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
