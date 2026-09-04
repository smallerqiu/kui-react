import clsx from "clsx";
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
import { ConfigContext } from "../config/config-context";
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
  response?: unknown;
  errorText?: string;
  xhr?: XMLHttpRequest;
}
export interface UploadChangeEvent {
  file: UploadFile;
  fileList: UploadFile[];
}
export interface UploadSortEvent extends UploadChangeEvent {
  oldIndex: number;
  newIndex: number;
}
export interface UploadRequestOptions {
  action?: string;
  method: string;
  name: string;
  file: File | Blob;
  filename: string;
  data: Record<string, string | number | boolean | Blob>;
  headers: Record<string, string>;
  withCredentials: boolean;
  timeout: number;
  onProgress: (percent: number) => void;
  onSuccess: (response?: unknown) => void;
  onError: (error?: unknown) => void;
}
export interface UploadRequestHandle {
  abort: () => void;
}
export type UploadCustomRequest = (
  options: UploadRequestOptions,
) => void | UploadRequestHandle | Promise<void | UploadRequestHandle>;
export interface UploadRef {
  upload: () => void;
  abort: (file?: UploadFile) => void;
  retry: (file: UploadFile) => void;
}
export interface UploadProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onSelect"> {
  method?: string;
  name?: string;
  action?: string;
  type?: "list" | "picture";
  data?: Record<string, string | number | boolean | Blob>;
  disabled?: boolean;
  readOnly?: boolean;
  directory?: boolean;
  multiple?: boolean;
  accept?: string;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  timeout?: number;
  customRequest?: UploadCustomRequest;
  parseResponse?: (xhr: XMLHttpRequest) => unknown;
  showUploadList?: boolean;
  transformFile?: (file: File) => File | Blob | Promise<File | Blob>;
  fileList?: UploadFile[];
  defaultFileList?: UploadFile[];
  autoTrigger?: boolean;
  limit?: number;
  minSize?: number;
  maxSize?: number;
  uploadText?: string;
  uploadSubText?: string;
  uploadIcon?: IconType[];
  draggable?: boolean;
  sortable?: boolean;
  preview?: boolean;
  validateAccept?: boolean;
  maxConcurrent?: number;
  onChange?: (event: UploadChangeEvent) => void;
  onRemove?: (event: UploadChangeEvent) => void;
  onSelectFiles?: (files: UploadFile[]) => void;
  onExceed?: () => void;
  onSizeError?: (event: UploadChangeEvent) => void;
  onTypeError?: (event: UploadChangeEvent) => void;
  onSort?: (event: UploadSortEvent) => void;
  onBeforeUpload?: (
    item: UploadFile,
    file: File,
  ) => boolean | File | Blob | void | Promise<boolean | File | Blob | void>;
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
    readOnly,
    directory,
    multiple,
    accept,
    headers,
    withCredentials = false,
    timeout = 0,
    customRequest,
    parseResponse,
    showUploadList = true,
    transformFile,
    fileList,
    defaultFileList = [],
    autoTrigger = true,
    limit,
    minSize,
    maxSize,
    uploadText,
    uploadSubText,
    uploadIcon,
    draggable,
    sortable,
    preview = true,
    validateAccept = true,
    maxConcurrent = Infinity,
    onChange,
    onRemove,
    onSelectFiles,
    onExceed,
    onSizeError,
    onTypeError,
    onSort,
    onBeforeUpload,
    className,
    children,
    ...rest
  },
  ref,
) {
  const { locale } = useContext(ConfigContext);
  const messages = locale ?? zhCN;
  const [files, setFiles] = useState<UploadFile[]>(fileList ?? defaultFileList);
  const filesRef = useRef(files);
  filesRef.current = files;
  const pendingRef = useRef(new Map<string, File>());
  const requestHandlesRef = useRef(new Map<string, UploadRequestHandle>());
  const queueRef = useRef<Array<{ item: UploadFile; file: File }>>([]);
  const queuedRef = useRef(new Set<string>());
  const activeRef = useRef(0);
  const generatedPreviewUrlsRef = useRef(new Set<string>());
  const unmountedRef = useRef(false);
  useEffect(() => {
    if (!fileList) return;
    const activePreviews = new Set(fileList.map((item) => item.preview).filter(Boolean));
    generatedPreviewUrlsRef.current.forEach((url) => {
      if (!activePreviews.has(url)) {
        URL.revokeObjectURL(url);
        generatedPreviewUrlsRef.current.delete(url);
      }
    });
    setFiles([...fileList]);
  }, [fileList]);
  useEffect(
    () => () => {
      unmountedRef.current = true;
      filesRef.current.forEach((item) => {
        const xhr = item.xhr;
        if (!xhr) return;
        xhr.onreadystatechange = null;
        xhr.onerror = null;
        xhr.upload.onloadstart = null;
        xhr.upload.onprogress = null;
        xhr.abort();
        item.xhr = undefined;
      });
      requestHandlesRef.current.forEach((handle) => handle.abort());
      requestHandlesRef.current.clear();
      queuedRef.current.clear();
      generatedPreviewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      generatedPreviewUrlsRef.current.clear();
    },
    [],
  );
  const update = (item: UploadFile, callback = onChange) => {
    const next = [...filesRef.current];
    filesRef.current = next;
    setFiles(next);
    callback?.({ file: item, fileList: next });
  };
  const finishTask = (item: UploadFile) => {
    if (item.uid) requestHandlesRef.current.delete(item.uid);
    activeRef.current = Math.max(0, activeRef.current - 1);
    runQueue();
  };
  const send = async (item: UploadFile, original: File) => {
    let file: File | Blob;
    try {
      const beforeResult = await onBeforeUpload?.(item, original);
      if (beforeResult === false) {
        finishTask(item);
        return;
      }
      const beforeFile = beforeResult instanceof Blob ? beforeResult : original;
      file = transformFile ? await transformFile(original) : beforeFile;
    } catch (error) {
      if (!unmountedRef.current && filesRef.current.includes(item)) {
        item.status = "error";
        item.errorText = error instanceof Error ? error.message : String(error || "");
        update(item);
      }
      finishTask(item);
      return;
    }
    if (unmountedRef.current || !filesRef.current.includes(item)) {
      finishTask(item);
      return;
    }
    let settled = false;
    const settle = (status: "success" | "error", value?: unknown) => {
      if (settled || unmountedRef.current || !filesRef.current.includes(item)) return;
      settled = true;
      item.status = status;
      if (status === "success") {
        item.percent = 100;
        item.response = value;
        if (item.uid) pendingRef.current.delete(item.uid);
      } else {
        item.errorText =
          value instanceof Error
            ? value.message
            : String(value || messages?.k?.upload?.failed || "Upload failed");
      }
      item.xhr = undefined;
      update(item);
      finishTask(item);
    };
    if (customRequest) {
      item.status = "uploading";
      update(item);
      try {
        const handle = await customRequest({
          action,
          method,
          name,
          file,
          filename: item.filename || (file instanceof File ? file.name : name),
          data,
          headers: headers ?? {},
          withCredentials,
          timeout,
          onProgress: (percent) => {
            if (!settled) {
              item.percent = Math.max(0, Math.min(100, percent));
              update(item);
            }
          },
          onSuccess: (response) => settle("success", response),
          onError: (error) => settle("error", error),
        });
        if (handle && typeof handle.abort === "function" && item.uid && !settled) {
          requestHandlesRef.current.set(item.uid, handle);
        }
      } catch (error) {
        settle("error", error);
      }
      return;
    }
    if (!action) {
      settle("error", "Upload action is required");
      return;
    }
    const body = new FormData();
    body.append(name, file);
    Object.entries(data).forEach(([key, value]) =>
      body.append(key, value instanceof Blob ? value : String(value)),
    );
    const xhr = new XMLHttpRequest();
    item.xhr = xhr;
    xhr.open(method, action);
    xhr.withCredentials = withCredentials;
    xhr.timeout = Math.max(0, timeout);
    if (item.uid) requestHandlesRef.current.set(item.uid, { abort: () => xhr.abort() });
    Object.entries(headers ?? {}).forEach(([key, value]) => xhr.setRequestHeader(key, value));
    // 失败时给出提示文案，与 kui-vue 的修复保持一致
    const fail = (detail?: string) => {
      const message = detail
        ? `${messages?.k?.upload?.failed ?? "上传失败"}: ${detail}`
        : (messages?.k?.upload?.failed ?? "上传失败");
      settle("error", message);
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
        let response: unknown;
        if (parseResponse) response = parseResponse(xhr);
        else {
          try {
            response = JSON.parse(xhr.responseText);
          } catch {
            response = xhr.responseText;
          }
        }
        settle("success", response);
      } else fail(String(xhr.status));
    };
    xhr.ontimeout = () => fail("timeout");
    xhr.send(body);
  };
  function runQueue() {
    const maximum = Math.max(1, Math.floor(maxConcurrent || 1));
    while (activeRef.current < maximum && queueRef.current.length) {
      const task = queueRef.current.shift()!;
      if (!task.item.uid || !queuedRef.current.delete(task.item.uid)) continue;
      activeRef.current += 1;
      void send(task.item, task.file);
    }
  }
  const schedule = (item: UploadFile, file: File) => {
    if (!item.uid || queuedRef.current.has(item.uid) || requestHandlesRef.current.has(item.uid))
      return;
    queuedRef.current.add(item.uid);
    queueRef.current.push({ item, file });
    runQueue();
  };
  const select = (selected: FileList) => {
    if (readOnly) return;
    const selectedFiles = [...selected].filter((file) => file.name !== ".DS_Store");
    const accepted = multiple ? selectedFiles : selectedFiles.slice(0, 1);
    const normalizedLimit = limit != null && limit >= 0 ? Math.floor(limit) : undefined;
    let exceeded = false;
    for (const file of accepted) {
      if (normalizedLimit !== undefined && filesRef.current.length >= normalizedLimit) {
        exceeded = true;
        continue;
      }
      const isImage =
        file.type.startsWith("image/") ||
        /\.(png|jpe?g|gif|webp|bmp|ico|svg|avif|apng)$/i.test(file.name);
      const preview = isImage ? URL.createObjectURL(file) : null;
      if (preview) generatedPreviewUrlsRef.current.add(preview);
      const item: UploadFile = {
        uid: uuid(),
        filename: file.name,
        size: formatSize(file.size),
        status: "waiting",
        percent: 0,
        preview,
      };
      const acceptedType =
        !accept ||
        !validateAccept ||
        accept.split(",").some((rule) => {
          const value = rule.trim().toLowerCase();
          if (value.startsWith(".")) return file.name.toLowerCase().endsWith(value);
          if (value.endsWith("/*")) return file.type.toLowerCase().startsWith(value.slice(0, -1));
          return file.type.toLowerCase() === value;
        });
      const kb = file.size / 1024;
      filesRef.current = [...filesRef.current, item];
      setFiles(filesRef.current);
      if (!acceptedType) {
        item.status = "error";
        item.errorText = `File type is not accepted: ${accept}`;
        update(item);
        onTypeError?.({ file: item, fileList: filesRef.current });
        continue;
      }
      if ((minSize != null && kb < minSize) || (maxSize != null && kb > maxSize)) {
        item.status = "error";
        item.errorText = messages?.k.upload.errorFileSize;
        update(item);
        onSizeError?.({ file: item, fileList: filesRef.current });
        continue;
      }
      pendingRef.current.set(item.uid!, file);
      update(item);
      if (autoTrigger) schedule(item, file);
    }
    if (exceeded) onExceed?.();
    onSelectFiles?.(filesRef.current);
  };
  const upload = () => {
    if (!disabled && !readOnly)
      pendingRef.current.forEach((file, uid) => {
        const item = filesRef.current.find((entry) => entry.uid === uid);
        if (item?.status === "waiting") schedule(item, file);
      });
  };
  const abort = (file?: UploadFile) => {
    const targets = file ? [file] : filesRef.current;
    targets.forEach((item) => {
      if (!item.uid) return;
      if (queuedRef.current.delete(item.uid)) return;
      const handle = requestHandlesRef.current.get(item.uid);
      if (!handle) return;
      requestHandlesRef.current.delete(item.uid);
      handle.abort();
      item.status = "waiting";
      item.percent = 0;
      update(item);
      finishTask(item);
    });
  };
  const retry = (item: UploadFile) => {
    if (disabled || readOnly || !item.uid) return;
    const file = pendingRef.current.get(item.uid);
    if (!file) return;
    item.status = "waiting";
    item.errorText = undefined;
    item.percent = 0;
    update(item);
    schedule(item, file);
  };
  useImperativeHandle(ref, () => ({ upload, abort, retry }));
  const remove = (index: number, item: UploadFile) => {
    if (disabled || readOnly) return;
    const xhr = item.xhr;
    if (xhr) {
      xhr.onreadystatechange = null;
      xhr.onerror = null;
      xhr.upload.onloadstart = null;
      xhr.upload.onprogress = null;
      xhr.abort();
      item.xhr = undefined;
    }
    if (item.uid) pendingRef.current.delete(item.uid);
    if (item.uid) {
      queuedRef.current.delete(item.uid);
      const handle = requestHandlesRef.current.get(item.uid);
      if (handle) {
        handle.abort();
        finishTask(item);
      }
    }
    if (item.preview && generatedPreviewUrlsRef.current.has(item.preview)) {
      URL.revokeObjectURL(item.preview);
      generatedPreviewUrlsRef.current.delete(item.preview);
    }
    filesRef.current = filesRef.current.filter((_, position) => position !== index);
    setFiles(filesRef.current);
    onRemove?.({ file: item, fileList: filesRef.current });
  };
  const sort = (oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex || disabled || readOnly) return;
    const next = [...filesRef.current];
    const [item] = next.splice(oldIndex, 1);
    if (!item) return;
    next.splice(newIndex, 0, item);
    filesRef.current = next;
    setFiles(next);
    onSort?.({ file: item, fileList: next, oldIndex, newIndex });
  };
  const selector = readOnly ? null : (
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
      className={clsx(
        "k-upload",
        {
          "k-upload-disabled": disabled,
          "k-upload-readonly": readOnly,
          "k-upload-picture": type === "picture",
          "k-upload-drag": draggable,
        },
        className,
      )}
    >
      {type !== "picture" && selector}
      <FileList
        type={type}
        fileList={files}
        showUploadList={showUploadList}
        disabled={disabled}
        readOnly={readOnly}
        locale={messages}
        onRemove={remove}
        sortable={sortable && type === "picture"}
        preview={preview}
        onSort={sort}
        onAbort={abort}
        onRetry={retry}
        selector={selector}
      />
    </div>
  );
});
export default Upload;
