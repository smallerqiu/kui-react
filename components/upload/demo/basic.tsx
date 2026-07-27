import { Upload as UploadIcon } from "kui-icons";
import { Button, Upload } from "react-kui";
import { action, handleChange, headers } from "./shared";
export default function Basic() {
  return (
    <Upload action={action} name="file" headers={headers} onChange={handleChange}>
      <Button icon={UploadIcon}>Click to upload</Button>
    </Upload>
  );
}
