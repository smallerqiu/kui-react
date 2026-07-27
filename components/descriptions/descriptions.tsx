import React from "react";
import type { DirectionType } from "../const/types";
import { getChildren } from "../utils/react-node";

export interface DescriptionsItemProps {
  label?: string;
  span?: number;
  children?: React.ReactNode;
}

// Internal rendering cell – not exported as a public component
interface CellProps {
  label?: string;
  span?: number;
  type?: "label" | "content";
  bordered?: boolean;
  layout?: DirectionType;
  children?: React.ReactNode;
}

const Cell: React.FC<CellProps> = ({ label, span = 1, type, bordered, layout, children }) => {
  if (bordered && layout !== "vertical") {
    if (type === "label") {
      return (
        <th className="k-descriptions-item-label" colSpan={span}>
          {label}
        </th>
      );
    }
    return (
      <td className="k-descriptions-item-content" colSpan={span}>
        {children}
      </td>
    );
  }

  if (layout === "vertical") {
    if (bordered) {
      if (type === "label") {
        return (
          <th className="k-descriptions-item-label" colSpan={span}>
            {label}
          </th>
        );
      }
      return (
        <td className="k-descriptions-item-content" colSpan={span}>
          {children}
        </td>
      );
    }
    if (type === "label") {
      return (
        <td className="k-descriptions-item" colSpan={span}>
          <div className="k-descriptions-item-inner">
            <div className="k-descriptions-item-label">{label}</div>
          </div>
        </td>
      );
    }
    return (
      <td className="k-descriptions-item" colSpan={span}>
        <div className="k-descriptions-item-inner">
          <div className="k-descriptions-item-content">{children}</div>
        </div>
      </td>
    );
  }

  return (
    <td className="k-descriptions-item" colSpan={span}>
      <div className="k-descriptions-item-inner">
        {label && <div className="k-descriptions-item-label">{label}</div>}
        <div className="k-descriptions-item-content">{children}</div>
      </div>
    </td>
  );
};

export interface DescriptionsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  bordered?: boolean;
  column?: number;
  layout?: DirectionType;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  size?: "medium" | "small";
  children?: React.ReactNode;
}

const Descriptions: React.FC<DescriptionsProps> = ({
  bordered = false,
  column = 3,
  layout = "horizontal",
  title,
  extra,
  size,
  children,
  className = "",
  ...rest
}) => {
  const childList = getChildren(children);
  const isVertical = layout === "vertical";

  type Row = React.ReactNode[];
  const rows: Row[] = [];
  let currentRow: Row = [];
  let currentContentRow: Row = [];
  let currentSpanSum = 0;

  childList.forEach((child, index) => {
    if (!React.isValidElement(child)) return;
    const isLast = index === childList.length - 1;
    const childProps = (child.props as DescriptionsItemProps) || {};
    let span = Number(childProps.span || 1);
    const label = childProps.label;
    const content = childProps.children;

    const remaining = column - currentSpanSum;
    if (isLast) span = remaining;

    if (isVertical) {
      currentRow.push(
        <Cell
          key={`l-${index}`}
          label={label}
          span={span}
          type="label"
          layout={layout}
          bordered={bordered}
        />
      );
      currentContentRow.push(
        <Cell key={`c-${index}`} span={span} layout={layout} bordered={bordered}>
          {content}
        </Cell>
      );
      currentSpanSum += span;

      if (currentSpanSum >= column || isLast) {
        rows.push(currentRow);
        rows.push(currentContentRow);
        currentRow = [];
        currentContentRow = [];
        currentSpanSum = 0;
      }
    } else {
      if (bordered) {
        currentRow.push(
          <Cell key={`l-${index}`} label={label} bordered={bordered} span={1} type="label" />,
          <Cell key={`c-${index}`} span={span * 2 - 1} bordered={bordered}>
            {content}
          </Cell>
        );
      } else {
        currentRow.push(
          <Cell key={`i-${index}`} label={label} span={span}>
            {content}
          </Cell>
        );
      }
      currentSpanSum += span;

      if (currentSpanSum >= column || isLast) {
        rows.push(currentRow);
        currentRow = [];
        currentSpanSum = 0;
      }
    }
  });

  const classes = [
    "k-descriptions",
    isVertical ? "k-descriptions-vertical" : "",
    bordered ? "k-descriptions-bordered" : "",
    size === "medium" ? "k-descriptions-medium" : "",
    size === "small" ? "k-descriptions-sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      <div className="k-descriptions-header">
        <div className="k-descriptions-title">{title}</div>
        {extra && <div className="k-descriptions-extra">{extra}</div>}
      </div>
      <div className="k-descriptions-view">
        <table>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="k-descriptions-row">
                {row}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// DescriptionsItem is used as a data-bearing child – it renders nothing by itself.
// The Descriptions parent reads its props.
export const DescriptionsItem: React.FC<DescriptionsItemProps> = ({ children }) => {
  return <>{children}</>;
};

export default Descriptions;
