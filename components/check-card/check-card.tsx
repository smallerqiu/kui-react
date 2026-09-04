import clsx from "clsx";
import { Check } from "kui-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import Icon from "../icon";
import { CheckCardGroupContext } from "./context";
import type { CheckCardProps } from "./types";

const CheckCard = React.forwardRef<HTMLDivElement, CheckCardProps>(
  (
    {
      checked,
      defaultChecked = false,
      value,
      title,
      description,
      symbol,
      checkedSymbol,
      showIndicator = true,
      disabled = false,
      readOnly = false,
      theme = "outline",
      size = "medium",
      shape = "round",
      onChange,
      className,
      children,
      ...rest
    },
    forwardedRef,
  ) => {
    const group = useContext(CheckCardGroupContext);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [localChecked, setLocalChecked] = useState(defaultChecked);
    const grouped = !!group && value !== undefined;
    const isChecked = grouped ? group.value === value : (checked ?? localChecked);
    const isDisabled = disabled || !!group?.disabled;
    const isReadOnly = readOnly || !!group?.readOnly;
    const currentTheme = group?.theme ?? theme;
    const currentSize = group?.size ?? size;
    const currentShape = group?.shape ?? shape;

    useEffect(() => {
      if (grouped && value !== undefined && rootRef.current) {
        group?.register(value, rootRef.current, isDisabled);
        return () => group.unregister(value);
      }
    }, [group, grouped, isDisabled, value]);

    const setRefs = (element: HTMLDivElement | null) => {
      rootRef.current = element;
      if (typeof forwardedRef === "function") forwardedRef(element);
      else if (forwardedRef) forwardedRef.current = element;
    };

    const select = () => {
      if (isDisabled || isReadOnly) return;
      if (grouped && value !== undefined) {
        if (isChecked) return;
        group.select(value);
        onChange?.({ checked: true, value });
        return;
      }
      const next = !isChecked;
      if (checked === undefined) setLocalChecked(next);
      onChange?.({ checked: next, value });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isDisabled || isReadOnly) return;
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        select();
        return;
      }
      if (!grouped || value === undefined) return;
      if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        group.selectRelative(
          value,
          event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1,
        );
      }
    };

    const symbolType = isChecked ? (checkedSymbol ?? symbol) : symbol;
    const symbolNode = symbolType ? (
      <Icon className="k-check-card-symbol-icon" type={symbolType} />
    ) : null;
    return (
      <div
        {...rest}
        ref={setRefs}
        className={clsx(
          "k-check-card",
          `k-check-card-${currentTheme}`,
          `k-check-card-${currentSize}`,
          `k-check-card-${currentShape}`,
          {
            "is-checked": isChecked,
            "is-disabled": isDisabled,
            "is-readonly": isReadOnly,
            "has-symbol": !!symbolNode,
          },
          className,
        )}
        role={grouped ? "radio" : "checkbox"}
        aria-checked={isChecked}
        aria-disabled={isDisabled}
        aria-readonly={isReadOnly || undefined}
        tabIndex={isDisabled ? -1 : isChecked || !grouped ? 0 : -1}
        onClick={select}
        onKeyDown={handleKeyDown}
      >
        {symbolNode ? <div className="k-check-card-symbol">{symbolNode}</div> : null}
        <div className="k-check-card-content">
          {title !== undefined ? <div className="k-check-card-title">{title}</div> : null}
          {description !== undefined ? (
            <div className="k-check-card-description">{description}</div>
          ) : null}
          {children}
        </div>
        {showIndicator ? (
          <span className="k-check-card-indicator" aria-hidden="true">
            {isChecked ? <Icon type={Check} /> : null}
          </span>
        ) : null}
      </div>
    );
  },
);

CheckCard.displayName = "CheckCard";
export default CheckCard;
