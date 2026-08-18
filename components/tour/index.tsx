import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Transition from "../base/transition";
import { Button } from "../button";

export interface TourStep {
  target?: HTMLElement | null | (() => HTMLElement | null);
  title?: React.ReactNode;
  description?: React.ReactNode;
  cover?: React.ReactNode;
  placement?: "top" | "right" | "bottom" | "left";
}
export interface TourProps {
  open?: boolean;
  defaultOpen?: boolean;
  current?: number;
  defaultCurrent?: number;
  steps: TourStep[];
  mask?: boolean;
  closable?: boolean;
  onChange?: (current: number) => void;
  onOpenChange?: (open: boolean) => void;
  onFinish?: () => void;
}
const Tour: React.FC<TourProps> = ({
  open,
  defaultOpen = false,
  current,
  defaultCurrent = 0,
  steps,
  mask = true,
  closable = true,
  onChange,
  onOpenChange,
  onFinish,
}) => {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [innerCurrent, setInnerCurrent] = useState(defaultCurrent);
  const [, refresh] = useState(0);
  const visible = open ?? innerOpen;
  const index = current ?? innerCurrent;
  const step = steps[index];
  useEffect(() => {
    if (!visible) return;
    const update = () => refresh((n) => n + 1);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [visible]);
  if (!step || typeof document === "undefined") return null;
  const target = typeof step.target === "function" ? step.target() : step.target;
  const rect = target?.getBoundingClientRect();
  const placement = step.placement ?? "bottom";
  const close = () => {
    if (open === undefined) setInnerOpen(false);
    onOpenChange?.(false);
  };
  const go = (next: number) => {
    if (current === undefined) setInnerCurrent(next);
    onChange?.(next);
  };
  const panelStyle: React.CSSProperties = rect
    ? placement === "top"
      ? {
          left: rect.left + rect.width / 2,
          top: rect.top - 12,
          transform: "translate(-50%, -100%)",
        }
      : placement === "left"
        ? {
            left: rect.left - 12,
            top: rect.top + rect.height / 2,
            transform: "translate(-100%, -50%)",
          }
        : placement === "right"
          ? {
              left: rect.right + 12,
              top: rect.top + rect.height / 2,
              transform: "translateY(-50%)",
            }
          : {
              left: rect.left + rect.width / 2,
              top: rect.bottom + 12,
              transform: "translateX(-50%)",
            }
    : { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };
  return createPortal(
    <div className="k-tour-root">
      <Transition show={visible} name="k-modal-fade">
        <div className="k-tour-overlay">
          {mask && <div className={clsx("k-tour-mask", { "k-tour-mask-spotlight": !!rect })} />}
          {mask && rect && (
            <div
              className="k-tour-focus"
              style={{
                left: rect.left - 5,
                top: rect.top - 5,
                width: rect.width + 10,
                height: rect.height + 10,
              }}
            />
          )}
        </div>
      </Transition>
      <section
        className={clsx("k-tour-panel", `k-tour-${placement}`)}
        style={{ ...panelStyle, display: visible ? undefined : "none" }}
        role="dialog"
        aria-modal="true"
      >
        {closable && (
          <Button
            className="k-tour-close"
            type="text"
            size="small"
            aria-label="Close"
            onClick={close}
          >
            ×
          </Button>
        )}
        {step.cover && <div className="k-tour-cover">{step.cover}</div>}
        {step.title && <h3>{step.title}</h3>}
        <div className="k-tour-description">{step.description}</div>
        <footer>
          <span>
            {index + 1} / {steps.length}
          </span>
          <div className="k-tour-actions">
            {index > 0 && (
              <Button size="small" onClick={() => go(index - 1)}>
                上一步
              </Button>
            )}
            <Button
              size="small"
              type="primary"
              onClick={() => {
                if (index < steps.length - 1) go(index + 1);
                else {
                  onFinish?.();
                  close();
                }
              }}
            >
              {index < steps.length - 1 ? "下一步" : "完成"}
            </Button>
          </div>
        </footer>
      </section>
    </div>,
    document.body
  );
};
export default Tour;
