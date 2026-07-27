import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { v4 as uuid } from "uuid";
import { ConfigContext } from "../config";
import type { UploadStatusType } from "../const/types";
import type { IconType } from "../icon";
import zhCN from "../locale/zh-CN";
import FileList from "./file-list";
import Selector from "./selector";

export interface UploadFile {
  uid?: string;
  url?: string;
  filename?: string;
  size?: string;
  status?: UploadStatusType;
  percent?: number;
  preview?: string | null;
  response?: any;
  errorText?: string;
  xhr?: XMLHttpRequest;
}
export interface UploadChangeEvent {
  file: UploadFile;
  fileList: UploadFile[];
}
export interface UploadRef {
  upload: () => void;
}
export interface UploadProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onSelect"> {
  method?: string;
  name?: string;
  action: string;
  type?: "list" | "picture";
  data?: Record<string, any>;
  disabled?: boolean;
  directory?: boolean;
  multiple?: boolean;
  accept?: string;
  headers?: Record<string, string>;
  showUploadList?: boolean;
  transformFile?: (file: File) => Promise<File>;
  fileList?: UploadFile[];
  autoTrigger?: boolean;
  limit?: number;
  minSize?: number;
  maxSize?: number;
  uploadText?: string;
  uploadSubText?: string;
  uploadIcon?: IconType[];
  draggable?: boolean;
  onChange?: (event: UploadChangeEvent) => void;
  onRemove?: (event: UploadChangeEvent) => void;
  onSelectFiles?: (files: UploadFile[]) => void;
  onExceed?: () => void;
  onSizeError?: (event: UploadChangeEvent) => void;
  onBeforeUpload?: (item: UploadFile, file: File) => void | boolean;
}
export type UploadContext = UploadProps & UploadRef;

const formatSize = (size: number) =>
  size < 1024
    ? `${size}B`
    : size < 1024 ** 2
      ? `${(size / 1024).toFixed(2)}KB`
      : size < 1024 ** 3
        ? `${(size / 1024 ** 2).toFixed(2)}MB`
        : `${(size / 1024 ** 3).toFixed(2)}GB`;

const Upload = forwardRef<UploadRef, UploadProps>(function Upload(
  {
    method = "post",
    name = "file",
    action,
    type = "list",
    data = {},
    disabled,
    directory,
    multiple,
    accept,
    headers,
    showUploadList = true,
    transformFile,
    fileList,
    autoTrigger = true,
    limit,
    minSize,
    maxSize,
    uploadText,
    uploadSubText,
    uploadIcon,
    draggable,
    onChange,
    onRemove,
    onSelectFiles,
    onExceed,
    onSizeError,
    onBeforeUpload,
    className,
    children,
    ...rest
  },
  ref
) {
  const { locale } = useContext(ConfigContext);
  const messages = locale ?? zhCN;
  const [files, setFiles] = useState<UploadFile[]>(fileList ?? []);
  const filesRef = useRef(files);
  filesRef.current = files;
  const pendingRef = useRef(new Map<string, File>());
  useEffect(() => {
    if (fileList) setFiles([...fileList]);
  }, [fileList]);
  useEffect(
    () => () => {
      filesRef.current.forEach((item) => {
        item.xhr?.abort();
        if (item.preview) URL.revokeObjectURL(item.preview);
      });
    },
    []
  );
  const update = (item: UploadFile, callback = onChange) => {
    const next = [...filesRef.current];
    filesRef.current = next;
    setFiles(next);
    callback?.({ file: item, fileList: next });
  };
  const send = async (item: UploadFile, original: File) => {
    if (onBeforeUpload?.(item, original) === false) return;
    const file = transformFile ? await transformFile(original) : original;
    const body = new FormData();
    body.append(name, file);
    Object.entries(data).forEach(([key, value]) => body.append(key, value));
    const xhr = new XMLHttpRequest();
    item.xhr = xhr;
    xhr.open(method, action);
    Object.entries(headers ?? {}).forEach(([key, value]) => xhr.setRequestHeader(key, value));
    const fail = () => {
      item.status = "error";
      if (item.uid) pendingRef.current.delete(item.uid);
      update(item);
    };
    xhr.upload.onloadstart = () => {
      item.status = "uploading";
      update(item);
    };
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        item.percent = (event.loaded / event.total) * 100;
        update(item);
      }
    };
    xhr.onerror = fail;
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        item.status = "success";
        item.percent = 100;
        try {
          item.response = JSON.parse(xhr.responseText);
        } catch {
          item.response = xhr.responseText;
        }
        if (item.uid) pendingRef.current.delete(item.uid);
        update(item);
      } else fail();
    };
    xhr.send(body);
  };
  const select = (selected: FileList) => {
    const accepted = [...selected].filter((file) => file.name !== ".DS_Store");
    let exceeded = false;
    for (const file of accepted) {
      if (limit && filesRef.current.length >= limit) {
        exceeded = true;
        continue;
      }
      const item: UploadFile = {
        uid: uuid(),
        filename: file.name,
        size: formatSize(file.size),
        status: "waiting",
        percent: 0,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      };
      const kb = file.size / 1024;
      filesRef.current = [...filesRef.current, item];
      setFiles(filesRef.current);
      if ((minSize != null && kb < minSize) || (maxSize != null && kb > maxSize)) {
        item.status = "error";
        item.errorText = messages?.k.upload.errorFileSize;
        update(item);
        onSizeError?.({ file: item, fileList: filesRef.current });
        continue;
      }
      pendingRef.current.set(item.uid!, file);
      update(item);
      if (autoTrigger) void send(item, file);
    }
    if (exceeded) onExceed?.();
    onSelectFiles?.(filesRef.current);
  };
  const upload = () => {
    if (!disabled)
      pendingRef.current.forEach((file, uid) => {
        const item = filesRef.current.find((entry) => entry.uid === uid);
        if (item?.status === "waiting") void send(item, file);
      });
  };
  useImperativeHandle(ref, () => ({ upload }));
  const remove = (index: number, item: UploadFile) => {
    if (disabled) return;
    item.xhr?.abort();
    if (item.uid) pendingRef.current.delete(item.uid);
    if (item.preview) URL.revokeObjectURL(item.preview);
    filesRef.current = filesRef.current.filter((_, position) => position !== index);
    setFiles(filesRef.current);
    onRemove?.({ file: item, fileList: filesRef.current });
  };
  const selector = (
    <Selector
      disabled={disabled}
      name={name}
      accept={accept}
      multiple={multiple}
      directory={directory}
      limit={limit}
      uploadText={uploadText}
      uploadSubText={uploadSubText}
      draggable={draggable}
      fileList={files}
      uploadIcon={uploadIcon}
      type={type}
      locale={messages}
      onSelect={select}
    >
      {children}
    </Selector>
  );
  return (
    <div
      {...rest}
      className={[
        "k-upload",
        disabled && "k-upload-disabled",
        type === "picture" && "k-upload-picture",
        draggable && "k-upload-drag",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {type !== "picture" && selector}
      <FileList
        type={type}
        fileList={files}
        showUploadList={showUploadList}
        disabled={disabled}
        locale={messages}
        onRemove={remove}
        selector={selector}
      />
    </div>
  );
});
export default Upload;
