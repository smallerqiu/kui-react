import { useValue } from "../utils/use-value";
import { useConfigAppearance } from "../config/use-config-appearance";
import clsx from "clsx";
import { createFormFieldComponent } from "../form/field-context";
import { Check } from "kui-icons";
import React, { useContext, useEffect, useRef } from "react";
import Icon from "../icon";
import { CheckCardGroupContext } from "./context";
import type { CheckCardProps } from "./types";

const CheckCard = React.forwardRef<HTMLDivElement, CheckCardProps>(
  (
    {
      checked,
      value,
      title,
      description,
      symbol,
      checkedSymbol,
      showIndicator = true,
      disabled = false,
      readOnly = false,
      theme: themeProp,
      size: sizeProp,
      shape: shapeProp,
      onChange,
      className,
      children,
      ...rest
    },
    forwardedRef,
  ) => {
    const inheritedAppearance = useConfigAppearance();
    const theme = themeProp ?? inheritedAppearance.theme ?? "outline";
    const size = sizeProp ?? inheritedAppearance.size ?? "medium";
    const shape = shapeProp ?? inheritedAppearance.shape ?? "round";
    const group = useContext(CheckCardGroupContext);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [localChecked, setLocalChecked] = useValue(checked, (next) => next ?? false);
    const grouped = !!group && value !== undefined;
    const isChecked = grouped ? group.value === value : localChecked;
    const isDisabled = disabled || !!group?.disabled;
    const isReadOnly = readOnly || !!group?.readOnly;
    const currentTheme = themeProp ?? group?.theme ?? theme;
    const currentSize = sizeProp ?? group?.size ?? size;
    const currentShape = shapeProp ?? group?.shape ?? shape;

    useEffect(() => {
      if (grouped && value !== undefined && rootRef.current) {
        group?.register(value, rootRef.current, isDisabled || isReadOnly);
        return () => group.unregister(value);
      }
    }, [group, grouped, isDisabled, isReadOnly, value]);

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
      setLocalChecked(next);
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
export default createFormFieldComponent(CheckCard, {
  valueProp: "checked",
  getFieldValue: (value) => value === true || value === 1 || value === "1",
  getChangeValue: (event) => (event as import("./types").CheckCardChangeEvent).checked,
});
