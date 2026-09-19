import { Button, Upload, message, type UploadCustomRequest } from "react-kui";

const customRequest: UploadCustomRequest = ({ file, onProgress, onSuccess }) => {
  let percent = 0;
  const timer = window.setInterval(() => {
    percent += 10;
    onProgress(percent);
    if (percent >= 100) {
      window.clearInterval(timer);
      onSuccess({ name: file instanceof File ? file.name : "file" });
    }
  }, 200);

  return { abort: () => window.clearInterval(timer) };
};

export default function App() {
  return (
    <Upload
      multiple
      maxConcurrent={2}
      customRequest={customRequest}
      onBeforeUpload={(_item, file) => {
        if (!file.name.endsWith(".tmp")) return;
        message.warning("Temporary files cannot be uploaded");
        return false;
      }}
      uploadText="Select files"
    >
      <Button>Custom upload</Button>
    </Upload>
  );
}
