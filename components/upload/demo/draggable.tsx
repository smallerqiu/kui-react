import { Upload as UploadIcon } from "kui-icons";
import Upload from "../index";
import { action, handleChange, headers } from "./shared";
export default function Draggable() {
  return (
    <div style={{ width: "100%" }}>
      <Upload
        action={action}
        name="file"
        headers={headers}
        draggable
        uploadIcon={UploadIcon}
        uploadText="Click to upload files or drag files here"
        uploadSubText="Supports any type of file"
        onChange={handleChange}
      />
    </div>
  );
}
