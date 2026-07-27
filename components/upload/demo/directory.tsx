import { Upload as UploadIcon } from "kui-icons";
import { Button } from "../../button";
import Upload from "../index";
import { action, headers } from "./shared";
export default function Directory() {
  return (
    <Upload
      action={action}
      name="file"
      directory
      headers={headers}
      onChange={({ file, fileList }) => {
        if (file.status !== "uploading") console.log(file, fileList);
      }}
    >
      <Button icon={UploadIcon}>Click to upload</Button>
    </Upload>
  );
}
