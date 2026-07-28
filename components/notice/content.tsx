import clsx from "clsx";
import { CircleAlert, CircleCheck, CircleX, Info, Loading, X } from "kui-icons";
import type { ReactNode } from "react";
import { Button } from "../button";
import type { NoticeType } from "../const/types";
import Icon, { type IconType } from "../icon";

export interface ContentProps {
  type?: NoticeType;
  title?: ReactNode;
  content?: ReactNode;
  icon?: IconType[];
  color?: string;
  duration?: number;
  closable?: boolean;
  onClose?: () => void;
  noticeType?: "message" | "notice";
}
const icons = {
  info: Info,
  error: CircleX,
  success: CircleCheck,
  warning: CircleAlert,
  loading: Loading,
};

export default function Content({
  noticeType = "message",
  type,
  content,
  title,
  closable,
  icon,
  color,
  onClose,
}: ContentProps) {
  const alertIcon = icon ?? (type ? icons[type] : undefined);
  return (
    <div
      className={clsx(`k-${noticeType}-box`, {
        [`k-${noticeType}-${type}`]: type,
        "k-notice-has-icon": alertIcon,
      })}
    >
      <div className={`k-${noticeType}-content`}>
        {alertIcon && (
          <Icon
            type={alertIcon}
            color={color}
            className={`k-${noticeType}-icon`}
            spin={type === "loading"}
          />
        )}
        {noticeType === "message" ? (
          <>
            <span>{content}</span>
            {closable && (
              <Button
                className="k-message-close"
                size="small"
                type="text"
                icon={X}
                onClick={onClose}
              />
            )}
          </>
        ) : (
          <>
            <div className="k-notice-title">{title}</div>
            <div className="k-notice-desc">{content}</div>
            <Button
              className="k-notice-close"
              size="small"
              type="text"
              icon={X}
              onClick={onClose}
            />
          </>
        )}
      </div>
    </div>
  );
}
