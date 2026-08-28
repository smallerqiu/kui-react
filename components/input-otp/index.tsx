import clsx from "clsx";
import {
  Fragment,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type ClipboardEvent,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import type { ShapeType, SizeType, ThemeType } from "../const/types";

export type InputOTPValidator = (value: string) => boolean;
export interface InputOTPRef {
  focus: (index?: number) => void;
  blur: () => void;
}
export interface InputOTPProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string | number;
  defaultValue?: string | number;
  length?: number;
  type?: "number" | "text";
  size?: SizeType;
  disabled?: boolean;
  readOnly?: boolean;
  mask?: boolean;
  autoFocus?: boolean;
  separator?: ReactNode;
  validator?: InputOTPValidator;
  theme?: ThemeType;
  shape?: ShapeType;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

const InputOTP = forwardRef<InputOTPRef, InputOTPProps>(function InputOTP(
  {
    value,
    defaultValue = "",
    length = 6,
    type = "number",
    size,
    disabled = false,
    readOnly = false,
    mask = false,
    autoFocus = false,
    separator,
    validator,
    theme = "fill",
    shape,
    onChange,
    onComplete,
    onFocus,
    onBlur,
    className,
    ...rest
  },
  ref,
) {
  const normalize = useCallback(
    (source: unknown) =>
      Array.from(String(source ?? ""))
        .filter((character) => (type === "number" ? /\d/.test(character) : true))
        .filter((character) => (validator ? validator(character) : true))
        .join("")
        .slice(0, Math.max(0, length)),
    [length, type, validator],
  );
  const [innerValue, setInnerValue] = useState(() => normalize(defaultValue));
  const currentValue = normalize(value ?? innerValue);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const focusedIndex = useRef(-1);
  const chars = Array.from({ length: Math.max(0, length) }, (_, index) =>
    currentValue.charAt(index),
  );

  const focus = useCallback(
    (index = Math.min(currentValue.length, length - 1)) => {
      if (disabled || length <= 0) return;
      inputs.current[Math.max(0, Math.min(index, length - 1))]?.focus();
    },
    [currentValue.length, disabled, length],
  );
  const blur = useCallback(() => inputs.current[focusedIndex.current]?.blur(), []);
  useImperativeHandle(ref, () => ({ focus, blur }), [blur, focus]);

  const updateValue = (source: string) => {
    const nextValue = normalize(source);
    if (nextValue === currentValue) return;
    if (value === undefined) setInnerValue(nextValue);
    onChange?.(nextValue);
    if (nextValue.length === length) onComplete?.(nextValue);
  };
  const insert = (text: string, index: number) => {
    if (disabled || readOnly) return;
    const inserted = normalize(text);
    if (!inserted) return;
    const start = Math.min(index, currentValue.length);
    const source = currentValue.split("");
    inserted.split("").forEach((character, offset) => {
      if (start + offset < length) source[start + offset] = character;
    });
    updateValue(source.join("").slice(0, length));
    requestAnimationFrame(() => focus(Math.min(start + inserted.length, length - 1)));
  };
  const keyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      focus(index + (event.key === "ArrowLeft" ? -1 : 1));
    } else if (event.key === "Backspace" || event.key === "Delete") {
      if (readOnly) return;
      event.preventDefault();
      const target = event.key === "Backspace" && !chars[index] ? Math.max(0, index - 1) : index;
      const source = currentValue.split("");
      source.splice(target, 1);
      updateValue(source.join(""));
      requestAnimationFrame(() => focus(target));
    }
  };
  const paste = (event: ClipboardEvent<HTMLInputElement>, index: number) => {
    event.preventDefault();
    insert(event.clipboardData.getData("text"), index);
  };

  return (
    <div
      {...rest}
      className={clsx(
        "k-input-otp",
        {
          "k-input-otp-sm": size === "small",
          "k-input-otp-lg": size === "large",
          "k-input-otp-disabled": disabled,
          "k-input-otp-readonly": readOnly,
          [`k-input-otp-${theme}`]: theme,
          [`k-input-otp-${shape}`]: shape,
        },
        className,
      )}
      role="group"
      aria-disabled={disabled || undefined}
    >
      {chars.map((character, index) => (
        <Fragment key={index}>
          {index > 0 && separator !== undefined && (
            <span className="k-input-otp-separator">{separator}</span>
          )}
          <input
            ref={(element) => {
              inputs.current[index] = element;
            }}
            className="k-input-otp-item"
            value={character}
            type={mask ? "password" : "text"}
            inputMode={type === "number" ? "numeric" : "text"}
            pattern={type === "number" ? "[0-9]*" : undefined}
            maxLength={length}
            disabled={disabled}
            readOnly={readOnly}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`${index + 1} / ${length}`}
            autoFocus={autoFocus && index === 0}
            onChange={(event) => insert(event.target.value, index)}
            onKeyDown={(event) => keyDown(event, index)}
            onPaste={(event) => paste(event, index)}
            onFocus={(event) => {
              focusedIndex.current = index;
              event.currentTarget.select();
              onFocus?.(event);
            }}
            onBlur={(event) => {
              focusedIndex.current = -1;
              onBlur?.(event);
            }}
          />
        </Fragment>
      ))}
    </div>
  );
});

export default InputOTP;
