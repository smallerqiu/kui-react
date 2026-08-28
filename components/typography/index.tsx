/* eslint-disable react-refresh/only-export-components */
import clsx from "clsx";
import { Check, Copy, Pencil } from "kui-icons";
import React, { useEffect, useState } from "react";
import Icon from "../icon";

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
      const text = value ?? (children !== undefined ? String(children) : defaultValue);
      const [draft, setDraft] = useState(text);
      const [editing, setEditing] = useState(false);
      const [copied, setCopied] = useState(false);
      const [expanded, setExpanded] = useState(false);
      useEffect(() => {
        if (value !== undefined) setDraft(value);
      }, [value]);
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
              setEditing(false);
              onChange?.(draft);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setEditing(false);
                onChange?.(draft);
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
      const copy = async () => {
        if (disabled) return;
        await navigator.clipboard?.writeText(text);
        setCopied(true);
        onCopy?.(text);
        window.setTimeout(() => setCopied(false), 1500);
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
          <span
            className={clsx("k-typography-content", isEllipsis && "is-ellipsis")}
            style={isEllipsis ? { WebkitLineClamp: rows } : undefined}
          >
            {value ?? children ?? defaultValue}
          </span>
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
          {editable && (
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
            </button>
          )}
          {copyable && (
            <button
              className="k-typography-action"
              disabled={disabled}
              onClick={() => void copy()}
              aria-label="Copy"
            >
              <Icon type={copied ? Check : Copy} />
            </button>
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
const Typography = createTypography("span", "typography");
export default Typography;
