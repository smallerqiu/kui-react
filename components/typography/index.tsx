/* eslint-disable react-refresh/only-export-components */
import clsx from "clsx";
import { Check, Copy, Pencil } from "kui-icons";
import React, { isValidElement, useEffect, useRef, useState, type ReactNode } from "react";
import Icon from "../icon";
import Tooltip from "../tooltip";

export type TypographyType = "secondary" | "success" | "warning" | "danger";
export type TypographyTag = "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export interface TypographyCopyableOptions {
  tooltip?: string;
  copiedTooltip?: string;
}
export interface TypographyEditableOptions {
  tooltip?: string;
}
export interface TypographyEllipsisOptions {
  rows?: number;
  expandable?: boolean;
  expandText?: string;
  collapseText?: string;
  tooltip?: boolean | string;
}
export interface TypographyProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onChange" | "onCopy" | "title"
> {
  value?: string;
  defaultValue?: string;
  tag?: TypographyTag;
  type?: TypographyType;
  strong?: boolean;
  italic?: boolean;
  underline?: boolean;
  delete?: boolean;
  mark?: boolean;
  code?: boolean;
  disabled?: boolean;
  copyable?: boolean | TypographyCopyableOptions;
  editable?: boolean | TypographyEditableOptions;
  ellipsis?: boolean | number | TypographyEllipsisOptions;
  onCopy?: (text: string) => void;
  onChange?: (text: string) => void;
  children?: React.ReactNode;
}

const getReactNodeText = (node: ReactNode): string => {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getReactNodeText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return getReactNodeText(node.props.children);
  return "";
};

function createTypography(defaultTag: TypographyTag, name: string) {
  const Component = React.forwardRef<HTMLElement, TypographyProps>(
    (
      {
        value,
        defaultValue = "",
        tag = defaultTag,
        type,
        strong,
        italic,
        underline,
        delete: deleted,
        mark,
        code,
        disabled,
        copyable = false,
        editable = false,
        ellipsis = false,
        onCopy,
        onChange,
        children,
        className,
        ...rest
      },
      ref,
    ) => {
      const controlled = value !== undefined;
      const initialText =
        value ?? (children !== undefined ? getReactNodeText(children) : defaultValue);
      const [innerValue, setInnerValue] = useState(initialText);
      const [draft, setDraft] = useState(initialText);
      const [editing, setEditing] = useState(false);
      const [copied, setCopied] = useState(false);
      const [expanded, setExpanded] = useState(false);
      const [edited, setEdited] = useState(false);
      const copiedTimer = useRef<number | undefined>(undefined);
      const text = controlled
        ? value
        : edited
          ? innerValue
          : children !== undefined
            ? getReactNodeText(children)
            : innerValue;
      useEffect(() => {
        if (controlled) setDraft(value);
      }, [controlled, value]);
      useEffect(() => () => window.clearTimeout(copiedTimer.current), []);
      const finishEdit = () => {
        if (!editing) return;
        setEditing(false);
        if (!controlled) {
          setInnerValue(draft);
          setEdited(true);
        }
        onChange?.(draft);
      };
      if (editing) {
        return (
          <input
            {...rest}
            ref={ref as React.Ref<HTMLInputElement>}
            className="k-typography-editor"
            value={draft}
            autoFocus
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => {
              finishEdit();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                finishEdit();
              }
            }}
          />
        );
      }
      const options = typeof ellipsis === "object" ? ellipsis : undefined;
      const rows = Math.max(
        1,
        Math.floor(typeof ellipsis === "number" ? ellipsis : (options?.rows ?? 1)),
      );
      const isEllipsis = Boolean(ellipsis) && !expanded;
      const Tag = tag;
      const copyOptions = typeof copyable === "object" ? copyable : undefined;
      const editableOptions = typeof editable === "object" ? editable : undefined;
      const tooltipTitle = options?.tooltip
        ? typeof options.tooltip === "string"
          ? options.tooltip
          : text
        : undefined;
      const withTooltip = (node: ReactNode, title?: string) =>
        title ? <Tooltip title={title}>{node}</Tooltip> : node;
      const copy = async () => {
        if (disabled) return;
        await navigator.clipboard?.writeText(text);
        setCopied(true);
        onCopy?.(text);
        window.clearTimeout(copiedTimer.current);
        copiedTimer.current = window.setTimeout(() => setCopied(false), 1500);
      };
      return (
        <Tag
          {...rest}
          className={clsx(
            "k-typography",
            `k-typography-${name}`,
            type && `k-typography-${type}`,
            {
              "is-strong": strong,
              "is-italic": italic,
              "is-underline": underline,
              "is-delete": deleted,
              "is-mark": mark,
              "is-code": code,
              "is-disabled": disabled,
              "has-ellipsis": ellipsis,
            },
            className,
          )}
        >
          {withTooltip(
            <span
              className={clsx("k-typography-content", isEllipsis && "is-ellipsis")}
              style={isEllipsis ? { WebkitLineClamp: rows } : undefined}
            >
              {controlled ? value : edited ? innerValue : (children ?? innerValue)}
            </span>,
            isEllipsis ? tooltipTitle : undefined,
          )}
          {options?.expandable && (
            <button
              className="k-typography-action k-typography-expand"
              disabled={disabled}
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (options.collapseText ?? "Collapse") : (options.expandText ?? "More")}
            </button>
          )}
          {editable &&
            withTooltip(
              <button
                className="k-typography-action"
                disabled={disabled}
                onClick={() => {
                  setDraft(text);
                  setEditing(true);
                }}
                aria-label="Edit"
              >
                <Icon type={Pencil} />
              </button>,
              editableOptions?.tooltip,
            )}
          {copyable &&
            withTooltip(
              <button
                className="k-typography-action"
                disabled={disabled}
                onClick={() => void copy()}
                aria-label="Copy"
              >
                <Icon type={copied ? Check : Copy} />
              </button>,
              copied ? (copyOptions?.copiedTooltip ?? copyOptions?.tooltip) : copyOptions?.tooltip,
            )}
        </Tag>
      );
    },
  );
  Component.displayName = name;
  return Component;
}
export const TypographyText = createTypography("span", "text");
export const TypographyParagraph = createTypography("p", "paragraph");
export const TypographyTitle = createTypography("h2", "title");
const Typography = createTypography("span", "text");
export default Typography;
