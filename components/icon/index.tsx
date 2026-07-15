import React from "react";
import type { BooleanType } from "../const/types";

const parseStyle = (styleString: string) => {
  const styles: any = {};
  if (!styleString) return styles;

  styleString.split(";").forEach((rule) => {
    const [property, value] = rule.split(":");
    if (property && value) {
      const propName = property.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      styles[propName] = value.trim();
    }
  });

  return styles;
};

export interface IconType {
  d: string;
  s?: string;
}

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  type?: IconType[];
  size?: string | number;
  color?: string;
  spin?: boolean;
  strokeWidth?: string | number;
  reverseFill?: boolean;
}

const Icon: React.FC<IconProps> = ({
  type = [],
  size,
  color,
  spin = false,
  strokeWidth = 2,
  reverseFill = false,
  onClick,
  className = "",
  style,
  ...attrs
}) => {
  const renderPaths = () => {
    const paths = Array.isArray(type) ? type : [];
    return paths.map((i, index) => {
      const styleObj = parseStyle(i.s || "");
      if (
        reverseFill &&
        styleObj["stroke"] === "currentcolor" &&
        styleObj["fill"] === "none"
      ) {
        styleObj["fill"] = "currentColor";
        styleObj["stroke"] = "none";
      }
      if (strokeWidth !== undefined) {
        styleObj.strokeWidth = strokeWidth;
      }
      // Convert key names in style to React style properties if needed
      const pathProps = {
        d: i.d,
        style: styleObj,
      };
      return <path key={index} {...pathProps} />;
    });
  };

  const styles: React.CSSProperties = {
    color,
    ...style,
  };

  if (size) {
    styles.fontSize = `${size}px`;
  }

  const classes = ["k-icon", spin ? "k-load-loop" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <i {...attrs} className={classes} style={styles} onClick={onClick}>
      <svg viewBox="0 0 24 24" width="1em" height="1em">
        {renderPaths()}
      </svg>
    </i>
  );
};

export default Icon;
