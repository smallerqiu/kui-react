import { CircleCheck, CircleX, FileText, Info, X } from "kui-icons";
import type { ReactNode } from "react";
import { Button } from "../button";
import Icon from "../icon";
import Progress from "../progress";
import Tooltip from "../tooltip";
import type { UploadFile } from "./index";
import type { Locale } from "../config/config-context";

export interface UploadFileListProps {
  showUploadList?: boolean;
  locale?: Locale;
  type?: "list" | "picture";
  fileList?: UploadFile[];
  disabled?: boolean;
  selector?: ReactNode;
  onRemove?: (index: number, file: UploadFile) => void;
}
export default function FileList({
  showUploadList = true,
  locale,
  type = "list",
  fileList = [],
  disabled,
  selector,
  onRemove,
}: UploadFileListProps) {
  const picture = type === "picture";
  if (!showUploadList && !picture) return null;
  return (
    <div className={`k-upload-${picture ? "picture" : "file"}-list`}>
      {fileList.map((item, index) => {
        const statusText =
          item.status === "success"
            ? locale?.k.upload.successful
            : item.errorText || locale?.k.upload.failed;
        const preview = item.preview || item.url;
        return (
          <div
            key={item.uid ?? index}
            className={[`k-upload-file-${type}-item`, `k-upload-file-status-${item.status}`].join(
              " "
            )}
          >
            <div className={`k-upload-${picture ? "picture" : "file"}-preview`}>
              {preview ? (
                <img src={preview} alt="" />
              ) : (
                <Icon type={FileText} strokeWidth={1} size={30} />
              )}
            </div>
            <div className="k-upload-file-item-info">
              {!picture && (
                <div className="k-upload-file-main">
                  <span className="k-upload-file-name">{item.filename}</span>
                  <span className="k-upload-file-size">{item.size}</span>
                </div>
              )}
              {item.status !== "waiting" && (
                <div className="k-upload-file-status">
                  {item.status === "uploading" ? (
                    <Progress
                      percent={item.percent}
                      type={picture ? "circle" : "line"}
                      size="small"
                      showInfo={false}
                      status="active"
                      strokeWidth={15}
                    />
                  ) : statusText && !picture ? (
                    <div className="k-upload-file-status-text">
                      <Icon type={item.status === "success" ? CircleCheck : CircleX} />
                      {statusText}
                    </div>
                  ) : picture && item.status === "error" ? (
                    <Tooltip title={statusText} placement="bottom">
                      <Icon type={Info} />
                    </Tooltip>
                  ) : null}
                </div>
              )}
            </div>
            <Button
              type="text"
              size="small"
              icon={X}
              disabled={disabled}
              className={`k-upload-file-${picture ? "picture" : "item"}-remove`}
              onClick={() => onRemove?.(index, item)}
            />
          </div>
        );
      })}
      {picture && selector}
    </div>
  );
}
