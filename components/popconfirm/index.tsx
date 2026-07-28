import clsx from "clsx";
import { CircleQuestionMark } from "kui-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../button/button";
import { ConfigContext } from "../config";
import type { PlacementsType } from "../const/types";
import Icon from "../icon";
import zhCN from "../locale/zh-CN";
import { setPlacement } from "../utils/placement";
import { getChildren } from "../utils/react-node";

export interface PopconfirmProps {
  dark?: boolean;
  show?: boolean;
  title?: React.ReactNode;
  width?: number | string;
  okText?: string;
  cancelText?: string;
  placement?: PlacementsType;
  onCancel?: () => void;
  onOk?: () => void;
  onShowChange?: (show: boolean) => void;
  children?: React.ReactNode;
}

const Popconfirm: React.FC<PopconfirmProps> = ({
  dark = false,
  show = false,
  title,
  width,
  okText,
  cancelText,
  placement = "top",
  onCancel,
  onOk,
  onShowChange,
  children,
}) => {
  const config = useContext(ConfigContext);
  const locale = config?.locale || zhCN;

  const [visible, setVisible] = useState(show);
  const [rendered, setRendered] = useState(show);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [currentPlacement, setCurrentPlacement] = useState(placement);
  const [transOrigin, setTransOrigin] = useState("bottom");

  const refPopper = useRef<HTMLDivElement>(null);
  const refSelection = useRef<HTMLElement>(null);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const showTimer = useRef<NodeJS.Timeout | null>(null);

  const updatePosition = () => {
    if (!refSelection.current || !refPopper.current) return;
    const placementObj = { value: currentPlacement };
    const originObj = { value: transOrigin };
    const topObj = { value: top };
    const leftObj = { value: left };

    setPlacement({
      refSelection: refSelection.current,
      refPopper: refPopper.current,
      currentPlacement: placementObj,
      transOrigin: originObj,
      top: topObj,
      left: leftObj,
    });

    setCurrentPlacement(placementObj.value as PlacementsType);
    setTransOrigin(originObj.value);
    setTop(topObj.value);
    setLeft(leftObj.value);
  };

  useEffect(() => {
    setVisible(show);
  }, [show]);

  useEffect(() => {
    if (visible) updatePosition();
  }, [title, visible]);

  useEffect(() => {
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("click", outsideClick);
    };
  }, []);

  const updateShow = (value: boolean) => {
    setVisible(value);
    onShowChange?.(value);
  };

  const outsideClick = (e: MouseEvent) => {
    const ctx = refSelection.current;
    if (
      refPopper.current &&
      !refPopper.current.contains(e.target as Node) &&
      ctx &&
      !ctx.contains(e.target as Node)
    ) {
      updateShow(false);
    }
  };

  const showPopconfirm = () => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (!rendered) {
      setRendered(true);
      document.addEventListener("click", outsideClick);
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
  if (firstChild && React.isValidElement(firstChild)) {
    triggerNode = React.cloneElement(firstChild as React.ReactElement<any>, {
      ref: refSelection,
      onClick: showPopconfirm,
    });
  } else {
    triggerNode = (
      <span ref={refSelection as any} onClick={showPopconfirm}>
        {children}
      </span>
    );
  }

  const preCls = "popconfirm";

  const overlayNode = rendered ? (
    <div
      ref={refPopper}
      className={clsx(`k-${preCls}`, `k-${preCls}-has-arrow`, dark ? `k-${preCls}-dark` : "")}
      style={{
        left: `${left}px`,
        top: `${top}px`,
        transformOrigin: transOrigin,
        display: visible ? undefined : "none",
        width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
      }}
      onMouseEnter={() => {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        updateShow(true);
      }}
      onMouseLeave={() => {
        showTimer.current = setTimeout(() => {
          if (!show) updateShow(false);
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
  ) : null;

  return (
    <>
      {triggerNode}
      {overlayNode && createPortal(overlayNode, document.body)}
    </>
  );
};

export default Popconfirm;
