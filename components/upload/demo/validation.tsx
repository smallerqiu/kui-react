import { Button, Upload, message } from "react-kui";

export default function App() {
  return (
    <Upload
      action="/api/upload"
      accept="image/png,image/jpeg"
      maxSize={1024}
      autoTrigger={false}
      onTypeError={() => message.error("Only PNG and JPEG files are accepted")}
      onSizeError={() => message.error("The image must not exceed 1 MB")}
    >
      <Button>Select image</Button>
    </Upload>
  );
}
