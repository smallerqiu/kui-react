import React from "react";
import Popup from "../base/popup";
import type { PlacementsType } from "../const/types";
import { CircleQuestionMark } from "kui-icons";
import Button from "../button/button";
import Icon from "../icon";
import { ConfigContext } from "../config/config-context";
import zhCN from "../locale/zh-CN";
export interface PopconfirmProps {
  dark?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  /** @deprecated Use `open` instead. */
  show?: boolean;
  title?: React.ReactNode;
  width?: number | string;
  okText?: string;
  cancelText?: string;
  placement?: PlacementsType;
  /** 只渲染浮层本身，不包含触发元素、定位与动画，与 kui-vue 一致 */
  panelOnly?: boolean;
  onCancel?: () => void;
  onOk?: () => void;
  onOpenChange?: (open: boolean) => void;
  /** @deprecated Use `onOpenChange` instead. */
  onShowChange?: (show: boolean) => void;
  children?: React.ReactNode;
}

export type PopconfirmPanelProps = Omit<
  PopconfirmProps,
  "children" | "open" | "defaultOpen" | "show"
>;

/** 与 kui-vue 一致：`PopconfirmPanel` 是 `panelOnly` 模式的 `Popconfirm` */
export function PopconfirmPanel(props: PopconfirmPanelProps) {
  return <Popconfirm {...props} panelOnly />;
}

const Popconfirm: React.FC<PopconfirmProps> = ({
  dark = false,
  open,
  defaultOpen = false,
  show,
  title,
  width,
  okText,
  cancelText,
  placement = "top",
  panelOnly = false,
  onCancel,
  onOk,
  onOpenChange,
  onShowChange,
  children,
}) => {
  const config = React.useContext(ConfigContext);
  const locale = config.locale || zhCN;
  return (
    <Popup
      open={open ?? show}
      defaultOpen={defaultOpen}
      trigger="click"
      placement={placement}
      panelOnly={panelOnly}
      arrow
      destroyOnClose
      respectDefaultPrevented={false}
      prefixCls="k-popconfirm"
      className={dark ? "k-popconfirm-dark" : undefined}
      style={{ width }}
      onOpenChange={(next) => {
        onOpenChange?.(next);
        onShowChange?.(next);
      }}
      overlay={(popup) => (
        <>
          <div className="k-popconfirm-body">
            <Icon type={CircleQuestionMark} />
            <div className="k-popconfirm-title">{title}</div>
          </div>
          <div className="k-popconfirm-footer">
            <Button
              size="small"
              onClick={() => {
                popup.close();
                onCancel?.();
              }}
            >
              {cancelText || locale.k.common.cancel}
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={() => {
                popup.close();
                onOk?.();
              }}
            >
              {okText || locale.k.common.ok}
            </Button>
          </div>
        </>
      )}
    >
      {children}
    </Popup>
  );
};
export default Popconfirm;
