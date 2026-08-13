import clsx from "clsx";
import { CircleX, Eye, EyeOff, Search } from "kui-icons";
import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
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
      type = "text",
      icon,
      suffix,
      prefix,
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
    ref
  ) => {
    const parentSize = useContext(SizeContext);
    const currentSize = size || parentSize;

    const [currentValue, setCurrentValue] = useState(value !== undefined ? value : defaultValue);
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (value !== undefined) {
        setCurrentValue(value);
      }
    }, [value]);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
    }));

    const handleClear = () => {
      if (value === undefined) setCurrentValue("");
      onClear?.();
      onChange?.("");
      inputRef.current?.focus();
    };

    const togglePassword = () => {
      if (disabled) return;
      setShowPassword(!showPassword);
    };

    const isInlineAffix = (node: React.ReactNode) =>
      typeof node === "string" || typeof node === "number";
    const hasPrefix = prefix !== null && prefix !== undefined && prefix !== "";
    const hasSuffix = suffix !== null && suffix !== undefined && suffix !== "";
    const prefixIsGroup = hasPrefix && !isInlineAffix(prefix);
    const suffixIsGroup = hasSuffix && !isInlineAffix(suffix);
    const useGroup = prefixIsGroup || suffixIsGroup;
    const inlinePrefix = hasPrefix && !prefixIsGroup ? prefix : null;
    const inlineSuffix = hasSuffix && !suffixIsGroup ? suffix : null;

    const getSuffix = () => {
      if (type === "password" && visiblePasswordIcon) {
        return (
          <Icon
            className="k-input-password-icon"
            type={!showPassword ? Eye : EyeOff}
            onClick={togglePassword}
          />
        );
      } else if (onSearch) {
        return (
          <Icon
            type={Search}
            className="k-input-search-icon"
            onClick={() => onSearch(currentValue as string)}
          />
        );
      }
      return inlineSuffix ? <div className={`k-${inputType}-suffix`}>{inlineSuffix}</div> : null;
    };

    const clearableShow =
      clearable && !isEmpty(currentValue) && type !== "password" && !rest.readOnly;

    const multiple =
      (!!icon ||
        !!onSearch ||
        hasSuffix ||
        hasPrefix ||
        type === "password" ||
        clearable ||
        !!controls) &&
      type !== "hidden";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (value === undefined) {
        setCurrentValue(v);
      }
      onChange?.(v);
      onInput?.(e as unknown as React.InputEvent<HTMLInputElement>);
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
        [`k-${inputType}-has-clear`]: clearableShow,
        [`k-${inputType}-sm`]: currentSize === "small",
        [`k-${inputType}-lg`]: currentSize === "large",
        [`k-${inputType}-${theme}`]: theme && theme !== "outline",
        [`k-${inputType}-circle`]: shape === "circle",
        [`k-${inputType}-square`]: shape === "square",
      },
      !useGroup && className
    );

    const innerChildren: React.ReactNode[] = [];
    if (icon) {
      innerChildren.push(
        <Icon
          key="input-icon"
          type={icon}
          className={`k-${inputType}-icon`}
          onClick={(e) => !disabled && onIconClick?.(e)}
        />
      );
    }
    if (inlinePrefix) {
      innerChildren.push(
        <div key="input-prefix" className={`k-${inputType}-prefix`}>
          {inlinePrefix}
        </div>
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
          onClick={handleClear}
        />
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
      const preChildren = prefixIsGroup ? (
        <div className="k-input-group-prefix">{prefix}</div>
      ) : null;
      const sufChildren = suffixIsGroup ? (
        <div className="k-input-group-suffix">{suffix}</div>
      ) : null;

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
  }
);

Input.displayName = "Input";

export default Input;
