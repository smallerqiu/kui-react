import clsx from "clsx";
import { Plus } from "kui-icons";
import {
  useRef,
  useState,
  type DragEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
} from "react";
import Icon, { type IconType } from "../icon";
import type { UploadFile } from "./index";
import type { Locale } from "../config/config-context";

export interface SelectorProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  disabled?: boolean;
  name?: string;
  accept?: string;
  multiple?: boolean;
  directory?: boolean;
  limit?: number;
  uploadText?: string;
  uploadSubText?: string;
  draggable?: boolean;
  locale?: Locale;
  fileList?: UploadFile[];
  uploadIcon?: IconType[];
  type?: "list" | "picture";
  onSelect?: (files: FileList) => void;
}

export default function Selector({
  disabled,
  name = "file",
  accept,
  multiple,
  directory,
  limit,
  uploadText,
  uploadSubText,
  draggable,
  locale,
  fileList = [],
  uploadIcon,
  type = "list",
  onSelect,
  children,
}: SelectorProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const directoryProps: InputHTMLAttributes<HTMLInputElement> & {
    webkitdirectory?: string;
  } = directory ? { webkitdirectory: "" } : {};
  const normalizedLimit = limit != null && limit >= 0 ? Math.floor(limit) : undefined;
  if (type === "picture" && normalizedLimit !== undefined && fileList.length >= normalizedLimit)
    return null;
  const select = (files: FileList | null) => {
    if (files?.length) onSelect?.(files);
    setDragOver(false);
  };
  const drop = (event: DragEvent) => {
    event.preventDefault();
    if (!disabled) select(event.dataTransfer.files);
  };
  return (
    <div className="k-upload-select">
      <div
        className={clsx("k-upload-add", { "k-upload-drag-over": dragOver })}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!disabled) inputRef.current?.click();
          }
        }}
        onDragEnter={
          draggable
            ? (event) => {
                event.preventDefault();
                setDragOver(true);
              }
            : undefined
        }
        onDragOver={
          draggable
            ? (event) => {
                event.preventDefault();
                setDragOver(true);
              }
            : undefined
        }
        onDragLeave={draggable ? () => setDragOver(false) : undefined}
        onDrop={draggable ? drop : undefined}
      >
        <input
          ref={inputRef}
          type="file"
          className="k-upload-file"
          name={name}
          accept={accept}
          disabled={disabled}
          multiple={multiple}
          {...directoryProps}
          onChange={(event) => {
            select(event.target.files);
            event.target.value = "";
          }}
        />
        {type === "picture" || draggable ? <Icon type={uploadIcon ?? Plus} /> : children}
        {(type === "picture" || (draggable && uploadText)) && (
          <span className="k-upload-text">{uploadText}</span>
        )}
        {draggable && uploadSubText && (
          <span className="k-upload-sub-text">
            {dragOver ? locale?.k.upload.releaseToUpload : uploadSubText}
          </span>
        )}
      </div>
    </div>
  );
}
