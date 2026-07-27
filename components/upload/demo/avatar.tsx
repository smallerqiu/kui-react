import { Camera } from "kui-icons";
import { Upload } from "react-kui";
import { action, headers } from "./shared";
export default function Avatar() {
  return (
    <Upload
      action={action}
      name="file"
      type="picture"
      headers={headers}
      onChange={({ file, fileList }) => {
        if (file.status !== "uploading") console.log(file, fileList);
      }}
      limit={1}
      accept="image/*"
      uploadIcon={Camera}
      uploadText="Upload Avatar"
    />
  );
}
