import { message, type UploadChangeEvent } from "react-kui";
export const action = "https://www.chuchur.com/api/upload/image";
export const headers = { authorization: "here is token" };
export const handleChange = (event: UploadChangeEvent) => {
  const { file, fileList } = event;
  if (file.status !== "uploading") console.log(file, fileList);
  if (file.status === "success") message.success(`${file.filename} uploaded successfully`);
  else if (file.status === "error") message.error(`${file.filename} upload failed.`);
};
