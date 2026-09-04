import clsx from "clsx";
import React, { useCallback, useMemo, useState } from "react";
import CheckCard from "./check-card";
import { CheckCardGroupContext } from "./context";
import type { CheckCardGroupProps, CheckCardValue } from "./types";

const CheckCardGroup = React.forwardRef<HTMLDivElement, CheckCardGroupProps>(
  (
    {
      value,
      defaultValue,
      options,
      disabled = false,
      readOnly = false,
      direction = "horizontal",
      theme = "outline",
      size = "medium",
      shape = "round",
      onChange,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const [localValue, setLocalValue] = useState(defaultValue);
    const registry = React.useRef(
      new Map<CheckCardValue, { element: HTMLDivElement; disabled: boolean }>(),
    ).current;
    const currentValue = value ?? localValue;
    const select = useCallback(
      (nextValue: CheckCardValue) => {
        if (disabled || readOnly || currentValue === nextValue) return;
        if (value === undefined) setLocalValue(nextValue);
        onChange?.(nextValue);
      },
      [currentValue, disabled, onChange, readOnly, value],
    );
    const context = useMemo(
      () => ({
        value: currentValue,
        disabled,
        readOnly,
        theme,
        size,
        shape,
        select,
        register: (key: CheckCardValue, element: HTMLDivElement, itemDisabled: boolean) =>
          registry.set(key, { element, disabled: itemDisabled }),
        unregister: (key: CheckCardValue) => registry.delete(key),
        selectRelative: (key: CheckCardValue, offset: number) => {
          const entries = [...registry.entries()].filter(([, item]) => !item.disabled);
          const index = entries.findIndex(([entryKey]) => entryKey === key);
          if (!entries.length || readOnly) return;
          const next = entries[(Math.max(index, 0) + offset + entries.length) % entries.length];
          if (next) {
            select(next[0]);
            next[1].element.focus();
          }
        },
      }),
      [currentValue, disabled, readOnly, registry, select, shape, size, theme],
    );
    return (
      <CheckCardGroupContext.Provider value={context}>
        <div
          {...rest}
          ref={ref}
          className={clsx("k-check-card-group", `k-check-card-group-${direction}`, className)}
          role="radiogroup"
          aria-readonly={readOnly || undefined}
        >
          {options?.map((option) => <CheckCard key={option.value} {...option} />) ?? children}
        </div>
      </CheckCardGroupContext.Provider>
    );
  },
);

CheckCardGroup.displayName = "CheckCardGroup";
export default CheckCardGroup;
