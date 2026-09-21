import clsx from "clsx";
import { CircleQuestionMark } from "kui-icons";
import React, { useCallback, useContext, useRef, useState } from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import Button from "../button/button";
import { ConfigContext } from "../config/config-context";
import type { PlacementsType } from "../const/types";
import Icon from "../icon";
import zhCN from "../locale/zh-CN";
import { usePopoverPosition, usePopoverOutsideClick } from "../utils/use-popover";
import { getChildren, setRef } from "../utils/react-node";

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
  const config = useContext(ConfigContext);
  const locale = config?.locale || zhCN;

  const externalOpen = open ?? show;
  const initialOpen = externalOpen ?? defaultOpen;
  const [visible, setVisible] = useState(initialOpen);
  const [rendered, setRendered] = useState(initialOpen);
  const [previousOpen, setPreviousOpen] = useState(externalOpen);
  if (previousOpen !== externalOpen) {
    setPreviousOpen(externalOpen);
    if (externalOpen !== undefined) {
      setVisible(externalOpen);
      if (externalOpen) setRendered(true);
    }
  }
  const {
    left,
    top,
    currentPlacement,
    transOrigin,
    refPopper,
    refSelection,
    updatePosition,
    setSelectionRef,
  } = usePopoverPosition(placement, visible, panelOnly, title);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const showTimer = useRef<NodeJS.Timeout | null>(null);

  const updateShow = useCallback(
    (value: boolean) => {
      if (externalOpen === undefined) setVisible(value);
      onOpenChange?.(value);
      onShowChange?.(value);
    },
    [externalOpen, onOpenChange, onShowChange],
  );

  usePopoverOutsideClick(visible, refSelection, refPopper, updateShow);

  const showPopconfirm = () => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (!rendered) {
      setRendered(true);
      setTimeout(() => {
        updateShow(true);
        setTimeout(updatePosition, 0);
      }, 0);
    } else {
      updateShow(true);
      setTimeout(updatePosition, 0);
    }
  };

  const ok = () => {
    updateShow(false);
    onOk?.();
  };

  const cancel = () => {
    updateShow(false);
    onCancel?.();
  };

  const childList = getChildren(children);
  const firstChild = childList.length === 1 ? childList[0] : null;

  let triggerNode: React.ReactNode;
  if (
    firstChild &&
    React.isValidElement<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>(
      firstChild,
    )
  ) {
    const childProps = firstChild.props;
    triggerNode = React.cloneElement(firstChild, {
      ref: (node) => {
        setRef(childProps.ref, node);
        setSelectionRef(node);
      },
      onClick: (event) => {
        childProps.onClick?.(event);
        showPopconfirm();
      },
    });
  } else {
    triggerNode = (
      <span ref={setSelectionRef} onClick={showPopconfirm}>
        {children}
      </span>
    );
  }

  const preCls = "popconfirm";

  const overlayNode = rendered ? (
    <Transition show={visible} name={`k-${preCls}`} nodeRef={refPopper} appear>
      <div
        ref={refPopper}
        {...({ "k-placement": currentPlacement } as React.HTMLAttributes<HTMLDivElement>)}
        className={clsx(`k-${preCls}`, `k-${preCls}-has-arrow`, {
          [`k-${preCls}-dark`]: dark,
        })}
        style={{
          left: `${left}px`,
          top: `${top}px`,
          transformOrigin: transOrigin,
          width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
        }}
        onMouseEnter={() => {
          if (hideTimer.current) clearTimeout(hideTimer.current);
          updateShow(true);
        }}
        onMouseLeave={() => {
          showTimer.current = setTimeout(() => {
            updateShow(false);
          }, 300);
        }}
      >
        <div className={`k-${preCls}-content`}>
          <div className={`k-${preCls}-body`}>
            <Icon type={CircleQuestionMark} />
            <div className={`k-${preCls}-title`}>{title}</div>
          </div>
          <div className={`k-${preCls}-footer`}>
            <Button size="small" onClick={cancel}>
              {cancelText || locale?.k?.common?.cancel}
            </Button>
            <Button size="small" type="primary" onClick={ok}>
              {okText || locale?.k?.common?.ok}
            </Button>
          </div>
          <div className={`k-${preCls}-arrow`}>
            <svg style={{ fill: "currentcolor" }} viewBox="0 0 24 8">
              <path
                d="M24,0.97087 L24,1.97087 C20,1.97087 18.5,2.97087 16.5,4.97087 C14.5,6.97087 14,7.97087 12,7.97087 C10,7.97087 9.5,6.97087 7.5,4.97087 C5.5,2.97087 4,1.97087 0,1.97087 L0,0.97087 L24,0.97087 Z"
                id="ot"
              />
              <path
                d="M24,0 L24,1 C20.032328,1 18.1576594,1.985435 16.1576594,3.985435 C14.1576594,5.985435 13.3847825,7 12,7 C10.6152175,7 9.81306952,5.985435 7.81306952,3.985435 C5.81306952,1.985435 4.0114261,1 0,1 L0,0 L24,0 Z"
                id="in"
                stroke="currentcolor"
              />
            </svg>
          </div>
        </div>
      </div>
    </Transition>
  ) : null;

  // panelOnly：直接渲染浮层本身，无触发元素、无 Teleport、无动画与定位
  if (panelOnly) {
    return (
      <div
        {...({ "k-placement": placement } as React.HTMLAttributes<HTMLDivElement>)}
        className={clsx(`k-${preCls}`, `k-${preCls}-has-arrow`, `k-${preCls}-panel`, {
          [`k-${preCls}-dark`]: dark,
        })}
        style={{ width: width ? (typeof width === "number" ? `${width}px` : width) : undefined }}
      >
        <div className={`k-${preCls}-content`}>
          <div className={`k-${preCls}-body`}>
            <Icon type={CircleQuestionMark} />
            <div className={`k-${preCls}-title`}>{title}</div>
          </div>
          <div className={`k-${preCls}-footer`}>
            <Button size="small" onClick={cancel}>
              {cancelText || locale?.k?.common?.cancel}
            </Button>
            <Button size="small" type="primary" onClick={ok}>
              {okText || locale?.k?.common?.ok}
            </Button>
          </div>
          <div className={`k-${preCls}-arrow`}>
            <svg style={{ fill: "currentcolor" }} viewBox="0 0 24 8">
              <path
                id="ot"
                d="m24,0.97087l0,1c-4,0 -5.5,1 -7.5,3c-2,2 -2.5,3 -4.5,3c-2,0 -2.5,-1 -4.5,-3c-2,-2 -3.5,-3 -7.5,-3l0,-1l24,0z"
              />
              <path
                id="in"
                stroke="currentcolor"
                d="m24,0l0,1c-4,0 -5.5,1 -7.5,3c-2,2 -2.5,3 -4.5,3c-2,0 -2.5,-1 -4.5,-3c-2,-2 -3.5,-3 -7.5,-3l0,-1l24,0z"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {triggerNode}
      <Teleport to="body">{overlayNode}</Teleport>
    </>
  );
};

export default Popconfirm;
