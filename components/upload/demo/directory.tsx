import { Upload as UploadIcon } from "kui-icons";
import { Button, Upload } from "react-kui";
import { action, headers } from "./shared";
export default function App() {
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
