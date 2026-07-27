import { Image, Upload as UploadIcon, Video } from "kui-icons";
import { Button, Space, Upload } from "react-kui";
import { action, handleChange, headers } from "./shared";
const choices = [
  { accept: "image/*", icon: Image, label: "Upload Image" },
  { accept: "video/*", icon: Video, label: "Upload Video" },
  { accept: ".pdf,.png,.jpeg", icon: UploadIcon, label: "Upload PDF, PNG, JPEG" },
];
export default function Accept() {
  return (
    <Space vertical>
      {choices.map(({ accept, icon, label }) => (
        <Upload
          key={accept}
          action={action}
          name="file"
          headers={headers}
          onChange={handleChange}
          multiple
          accept={accept}
        >
          <Button icon={icon}>{label}</Button>
        </Upload>
      ))}
    </Space>
  );
}
