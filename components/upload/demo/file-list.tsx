import { Upload as UploadIcon } from "kui-icons";
import { Button } from "../../button";
import Upload from "../index";
import { action, handleChange, headers } from "./shared";
export default function FileList() {
  return (
    <Upload action={action} name="file" headers={headers} onChange={handleChange} multiple>
      <Button icon={UploadIcon}>Click to upload</Button>
    </Upload>
  );
}
