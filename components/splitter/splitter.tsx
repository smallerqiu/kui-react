import clsx from "clsx";
import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useMemo,
  useState,
  useRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { SplitterPanel, type SplitterPanelProps } from "./splitter-panel";
import { createSplitterController, emptyState, type PanelOptions } from "./controller";
export interface SplitterProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onResize" | "onChange" | "defaultValue" | "defaultChecked"
> {
  direction?: "horizontal" | "vertical";
  value?: number[];
  disabled?: boolean;
  lazy?: boolean;
  onChange?: (sizes: number[]) => void;
  onResize?: (sizes: number[]) => void;
  onResizeEnd?: (sizes: number[]) => void;
  onResizeStart?: (sizes: number[]) => void;
  onCollapse?: (index: number, collapsed: boolean) => void;
}
const flattenPanels = (children: ReactNode, path = ""): ReactElement<SplitterPanelProps>[] => {
  const result: ReactElement<SplitterPanelProps>[] = [];
  Children.forEach(children, (child, index) => {
    if (!isValidElement(child)) return;
    const key = path + String(child.key ?? index);
    if (child.type === Fragment)
      result.push(...flattenPanels((child.props as { children?: ReactNode }).children, key + "/"));
    else if (child.type === SplitterPanel)
      result.push(cloneElement(child as ReactElement<SplitterPanelProps>, { key }));
  });
  return result;
};
export function Splitter({
  direction = "horizontal",
  value,
  disabled = false,
  lazy = false,
  onChange,
  onResize,
  onResizeEnd,
  onResizeStart,
  onCollapse,
  className,
  children,
  ...rest
}: SplitterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [controller] = useState(createSplitterController);
  const [state, setState] = useState(emptyState);
  const panels = useMemo(() => flattenPanels(children), [children]);
  const options: PanelOptions[] = useMemo(
    () =>
      panels.map((panel, i) => ({
        key: String(panel.key ?? i),
        size: panel.props.size,
        min: panel.props.min,
        max: panel.props.max,
        resizable: panel.props.resizable !== false,
        collapsible: !!panel.props.collapsible,
        collapsed: panel.props.collapsed,
      })),
    [panels],
  );
  useLayoutEffect(() => {
    controller.configure({
      panels: options,
      direction,
      disabled,
      lazy,
      value,
      onState: setState,
      onChange: (sizes) => onChange?.(sizes),
      onResize: (sizes) => onResize?.(sizes),
      onResizeStart: (sizes) => onResizeStart?.(sizes),
      onResizeEnd: (sizes) => onResizeEnd?.(sizes),
      onCollapse: (index, collapsed) => {
        panels[index].props.onCollapsedChange?.(collapsed);
        onCollapse?.(index, collapsed);
      },
    });
  }, [
    controller,
    options,
    direction,
    disabled,
    lazy,
    value,
    onChange,
    onResize,
    onResizeStart,
    onResizeEnd,
    panels,
    onCollapse,
  ]);
  useLayoutEffect(() => {
    if (containerRef.current) controller.mount(containerRef.current);
    return () => controller.dispose();
  }, [controller]);
  const collapseButton = (index: number, neighbor: number, before: boolean) => {
    if (!options[index]?.collapsible) return null;
    const collapsed = state.collapsed[index];
    const arrow =
      direction === "horizontal"
        ? before !== collapsed
          ? "‹"
          : "›"
        : before !== collapsed
          ? "↑"
          : "↓";
    return (
      <button
        type="button"
        className="k-splitter-collapse"
        disabled={!controller.canCollapse(index, neighbor)}
        aria-label={`${collapsed ? "Expand" : "Collapse"} panel ${index + 1}`}
        aria-expanded={!collapsed}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => controller.toggle(index, neighbor)}
      >
        {arrow}
      </button>
    );
  };
  return (
    <div
      {...rest}
      ref={containerRef}
      className={clsx("k-splitter", `is-${direction}`, { "is-disabled": disabled }, className)}
    >
      {panels.map((panel, index) => {
        const draggable = controller.canResize(index);
        const limits = controller.range(index);
        const dragging = state.dragging === index;
        return (
          <Fragment key={panel.key ?? index}>
            <div
              className={clsx("k-splitter-item", { "is-collapsed": state.collapsed[index] })}
              aria-hidden={state.collapsed[index] || undefined}
              inert={state.collapsed[index] || undefined}
              style={{
                flexBasis: state.sizes[index],
                flexGrow: state.sizes[index] === undefined ? 1 : 0,
                flexShrink: 0,
              }}
            >
              {panel}
            </div>
            {index < panels.length - 1 && (
              <div
                className={clsx("k-splitter-resizer", {
                  "is-active": dragging,
                  "is-after-collapsed": state.collapsed[index + 1],
                  "is-restorable": state.collapsed[index] || state.collapsed[index + 1],
                })}
              >
                <div
                  className="k-splitter-handle"
                  role="separator"
                  tabIndex={draggable ? 0 : -1}
                  aria-label={`Resize panels ${index + 1} and ${index + 2}`}
                  aria-orientation={direction === "horizontal" ? "vertical" : "horizontal"}
                  aria-disabled={!draggable || undefined}
                  aria-valuemin={Math.round(limits.min)}
                  aria-valuemax={Math.round(limits.max)}
                  aria-valuenow={Math.round(state.sizes[index] ?? 0)}
                  onPointerDown={(event) => controller.start(index, event)}
                  onKeyDown={(event) => controller.keydown(index, event)}
                />
                <div className="k-splitter-actions">
                  {collapseButton(index, index + 1, true)}
                  {collapseButton(index + 1, index, false)}
                </div>
                {dragging && lazy && state.preview !== null && (
                  <div
                    className="k-splitter-preview"
                    style={{
                      transform:
                        direction === "horizontal"
                          ? `translateX(${state.preview}px)`
                          : `translateY(${state.preview}px)`,
                    }}
                  />
                )}
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
