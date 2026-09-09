import clsx from "clsx";
import { CircleX, Eye, EyeOff, Search } from "kui-icons";
import React, { useContext, useImperativeHandle, useRef, useState } from "react";
import { SizeContext } from "../config/size-context";
import type { ShapeType, SizeType, ThemeType } from "../const/types";
import Icon, { type IconType } from "../icon";
import { isEmpty } from "../utils/number";
import InputBox from "./input-box";
import InputGroup from "./input-group";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix" | "onChange"
> {
  clearable?: boolean;
  visiblePasswordIcon?: boolean;
  size?: SizeType;
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  icon?: IconType[];
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  theme?: ThemeType;
  shape?: ShapeType;
  inputType?: string;
  onSearch?: (value: string) => void;
  onIconClick?: (e: React.MouseEvent) => void;
  onClear?: () => void;
  onChange?: (value: string) => void;
  controls?: React.ReactNode;
}

export interface InputRef {
  focus: () => void;
  blur: () => void;
}

const Input = React.forwardRef<InputRef, InputProps>(
  (
    {
      clearable = true,
      visiblePasswordIcon = true,
      size,
      value,
      defaultValue = "",
      disabled = false,
      readOnly = false,
      type = "text",
      icon,
      suffix,
      prefix,
      addonBefore,
      addonAfter,
      theme = "fill",
      shape,
      inputType = "input",
      onSearch,
      onIconClick,
      onClear,
      onChange,
      className = "",
      style,
      onFocus,
      onBlur,
      onInput,
      controls,
      ...rest
    },
    ref,
  ) => {
    const parentSize = useContext(SizeContext);
    const currentSize = size || parentSize;

    const [innerValue, setInnerValue] = useState(defaultValue);
    const currentValue = value !== undefined ? value : innerValue;
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
    }));

    const handleClear = () => {
      if (disabled || readOnly) return;
      if (value === undefined) setInnerValue("");
      onClear?.();
      onChange?.("");
      inputRef.current?.focus();
    };

    const togglePassword = () => {
      if (disabled || readOnly) return;
      setShowPassword(!showPassword);
    };

    const hasPrefix = prefix !== null && prefix !== undefined && prefix !== "";
    const hasSuffix = suffix !== null && suffix !== undefined && suffix !== "";
    const useGroup = addonBefore !== undefined || addonAfter !== undefined;

    const getSuffix = () => {
      if (type === "password" && visiblePasswordIcon) {
        return (
          <Icon
            className="k-input-password-icon"
            type={!showPassword ? Eye : EyeOff}
            role="button"
            tabIndex={disabled || readOnly ? undefined : 0}
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={togglePassword}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                togglePassword();
              }
            }}
          />
        );
      } else if (onSearch) {
        return (
          <Icon
            type={Search}
            className="k-input-search-icon"
            role="button"
            tabIndex={disabled || readOnly ? undefined : 0}
            aria-label="Search"
            onClick={() => !disabled && !readOnly && onSearch(currentValue as string)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (!disabled && !readOnly) onSearch(currentValue as string);
              }
            }}
          />
        );
      }
      return hasSuffix ? <div className={`k-${inputType}-suffix`}>{suffix}</div> : null;
    };

    const clearableShow =
      clearable && !isEmpty(currentValue) && type !== "password" && !disabled && !readOnly;

    const multiple =
      (!!icon ||
        !!onSearch ||
        hasSuffix ||
        hasPrefix ||
        addonBefore !== undefined ||
        addonAfter !== undefined ||
        type === "password" ||
        clearable ||
        !!controls) &&
      type !== "hidden";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (value === undefined) {
        setInnerValue(v);
      }
      onChange?.(v);
    };

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    };

    const inputBoxProps = {
      ...rest,
      disabled,
      readOnly,
      multiple,
      type,
      size,
      theme,
      shape,
      inputRef,
      inputType,
      value: currentValue,
      showPassword,
      onChange: handleInputChange,
      onInput,
      onFocus: handleInputFocus,
      onBlur: handleInputBlur,
      className: !multiple ? className : undefined,
      style: !multiple ? style : undefined,
    };

    if (typeof currentSize === "string") {
      inputBoxProps.size = currentSize;
    }

    const textInput = <InputBox {...inputBoxProps} />;
    if (!multiple) return textInput;

    const rootClasses = clsx(
      `k-${inputType}`,
      {
        [`k-${inputType}-focus`]: focused,
        [`k-${inputType}-disabled`]: disabled,
        [`k-${inputType}-readonly`]: readOnly,
        [`k-${inputType}-has-clear`]: clearableShow,
        [`k-${inputType}-sm`]: currentSize === "small",
        [`k-${inputType}-lg`]: currentSize === "large",
        [`k-${inputType}-${theme}`]: theme && theme !== "outline",
        [`k-${inputType}-circle`]: shape === "circle",
        [`k-${inputType}-square`]: shape === "square",
      },
      !useGroup && className,
    );

    const innerChildren: React.ReactNode[] = [];
    if (icon) {
      innerChildren.push(
        <Icon
          key="input-icon"
          type={icon}
          className={`k-${inputType}-icon`}
          role={onIconClick ? "button" : undefined}
          tabIndex={onIconClick && !disabled && !readOnly ? 0 : undefined}
          onClick={(e) => !disabled && !readOnly && onIconClick?.(e)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.currentTarget.click();
            }
          }}
        />,
      );
    }
    if (hasPrefix) {
      innerChildren.push(
        <div key="input-prefix" className={`k-${inputType}-prefix`}>
          {prefix}
        </div>,
      );
    }
    innerChildren.push(React.cloneElement(textInput, { key: "input-box" }));

    if (clearable) {
      innerChildren.push(
        <Icon
          key="input-clear"
          type={CircleX}
          className={clsx(`k-${inputType}-clearable`, {
            [`k-${inputType}-clearable-hidden`]: !clearableShow,
          })}
          role="button"
          tabIndex={clearableShow ? 0 : undefined}
          aria-label="Clear"
          onPointerDown={(event) => event.preventDefault()}
          onClick={handleClear}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleClear();
            }
          }}
        />,
      );
    }
    const suffixNode = getSuffix();
    if (suffixNode) {
      innerChildren.push(<React.Fragment key="input-suffix-node">{suffixNode}</React.Fragment>);
    }
    if (controls) {
      innerChildren.push(<React.Fragment key="input-controls">{controls}</React.Fragment>);
    }

    if (useGroup) {
      const preChildren =
        addonBefore !== undefined ? (
          <div className="k-input-group-prefix">{addonBefore}</div>
        ) : null;
      const sufChildren =
        addonAfter !== undefined ? <div className="k-input-group-suffix">{addonAfter}</div> : null;

      return (
        <InputGroup size={currentSize} theme={theme} className={className} style={style}>
          {preChildren}
          <div className={rootClasses} data-multiple="">
            {innerChildren}
          </div>
          {sufChildren}
        </InputGroup>
      );
    }

    return (
      <div className={rootClasses} style={style} data-multiple="">
        {innerChildren}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
