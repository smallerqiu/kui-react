import { Camera } from "kui-icons";
import { Upload } from "react-kui";
import { action, headers } from "./shared";
const transformFile = (file: File) =>
  new Promise<File>((resolve, reject) => {
    const canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d", { willReadFrequently: true }),
      img = new Image(),
      url = URL.createObjectURL(file);
    img.onload = () => {
      canvas.width = 200;
      canvas.height = 300;
      ctx?.drawImage(img, (img.width - 200) / 2, (img.height - 300) / 2, 200, 300);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (blob) {
          resolve(new File([blob], file.name, { type: "image/png" }));
        } else {
          reject(new Error("Image conversion failed"));
        }
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image loading failed"));
    };
    img.src = url;
  });
export default function App() {
  return (
    <Upload
      action={action}
      name="file"
      type="picture"
      headers={headers}
      onChange={({ file, fileList }) => {
        if (file.status !== "uploading") console.log(file, fileList);
      }}
      transformFile={transformFile}
      limit={1}
      accept="image/*"
      uploadIcon={Camera}
      uploadText="Upload Image"
    />
  );
}
