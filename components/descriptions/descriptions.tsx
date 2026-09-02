import clsx from "clsx";
import React, { useRef } from "react";
import type { DirectionType, ShapeType, SizeType } from "../const/types";
import { useBreakpoint, type Breakpoint, type ResponsiveValue } from "../grid/useBreakpoint";
import { getChildren } from "../utils/react-node";

export interface DescriptionsItemProps {
  label?: React.ReactNode;
  span?: number;
  children?: React.ReactNode;
}
export type DescriptionsColumn = ResponsiveValue<number>;

// Internal rendering cell – not exported as a public component
interface CellProps {
  label?: React.ReactNode;
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
  column?: DescriptionsColumn;
  layout?: DirectionType;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  size?: SizeType;
  shape?: ShapeType;
  children?: React.ReactNode;
}

const Descriptions: React.FC<DescriptionsProps> = ({
  bordered = false,
  column = 3,
  layout = "horizontal",
  title,
  extra,
  size,
  shape = "round",
  children,
  className = "",
  ...rest
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const breakpoint = useBreakpoint(rootRef);
  const childList = getChildren(children);
  const isVertical = layout === "vertical";

  const order: Breakpoint[] = ["xxl", "xl", "lg", "md", "sm", "xs"];
  let activeColumn = typeof column === "number" ? column : 3;
  if (typeof column === "object") {
    const current = order.indexOf(breakpoint);
    for (let index = current; index < order.length; index++) {
      const candidate = column[order[index]];
      if (candidate !== undefined) {
        activeColumn = candidate;
        break;
      }
    }
  }
  const safeColumn = Math.max(1, Math.floor(Number(activeColumn) || 1));
  type LogicalItem = {
    child: React.ReactElement<DescriptionsItemProps>;
    index: number;
    span: number;
  };
  const logicalRows: LogicalItem[][] = [];
  let logicalRow: LogicalItem[] = [];
  let currentSpanSum = 0;

  const finishRow = () => {
    if (!logicalRow.length) return;
    logicalRow[logicalRow.length - 1].span += safeColumn - currentSpanSum;
    logicalRows.push(logicalRow);
    logicalRow = [];
    currentSpanSum = 0;
  };

  childList.forEach((child, index) => {
    if (!React.isValidElement(child)) return;
    const item = child as React.ReactElement<DescriptionsItemProps>;
    const parsedSpan = Math.floor(Number(item.props.span) || 1);
    const span = Math.min(safeColumn, Math.max(1, parsedSpan));
    if (currentSpanSum && currentSpanSum + span > safeColumn) finishRow();
    logicalRow.push({ child: item, index, span });
    currentSpanSum += span;
    if (currentSpanSum === safeColumn) finishRow();
  });
  finishRow();

  const rows: React.ReactNode[][] = [];
  logicalRows.forEach((items) => {
    if (isVertical) {
      rows.push(
        items.map(({ child, index, span }) => (
          <Cell
            key={`l-${index}`}
            label={child.props.label}
            span={span}
            type="label"
            layout={layout}
            bordered={bordered}
          />
        )),
        items.map(({ child, index, span }) => (
          <Cell key={`c-${index}`} span={span} layout={layout} bordered={bordered}>
            {child.props.children}
          </Cell>
        )),
      );
      return;
    }
    rows.push(
      items.flatMap(({ child, index, span }) =>
        bordered
          ? [
              <Cell key={`l-${index}`} label={child.props.label} bordered span={1} type="label" />,
              <Cell key={`c-${index}`} span={span * 2 - 1} bordered>
                {child.props.children}
              </Cell>,
            ]
          : [
              <Cell key={`i-${index}`} label={child.props.label} span={span}>
                {child.props.children}
              </Cell>,
            ],
      ),
    );
  });

  const classes = clsx(
    "k-descriptions",
    {
      "k-descriptions-vertical": isVertical,
      "k-descriptions-bordered": bordered,
      "k-descriptions-medium": size === "medium",
      "k-descriptions-sm": size === "small",
      [`k-descriptions-${shape}`]: shape,
    },
    className,
  );

  return (
    <div className={classes} {...rest} ref={rootRef}>
      {title || extra ? (
        <div className="k-descriptions-header">
          <div className="k-descriptions-title">{title}</div>
          {extra && <div className="k-descriptions-extra">{extra}</div>}
        </div>
      ) : null}
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

export default Descriptions;
