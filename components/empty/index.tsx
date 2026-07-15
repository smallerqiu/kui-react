import React, { useContext } from "react";
import { Inbox } from "kui-icons";
import Icon from "../icon";
import zhCN from "../locale/zh-CN";
import { ConfigContext } from "../config";

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  description?: string | boolean | React.ReactNode;
  image?: string | React.ReactNode;
  imageStyle?: React.CSSProperties;
  children?: React.ReactNode;
}

const Empty: React.FC<EmptyProps> = ({
  description,
  image,
  imageStyle,
  children,
  className = "",
  ...rest
}) => {
  const config = useContext(ConfigContext);
  const locale = config?.locale || zhCN;

  const renderImage = () => {
    if (!image) {
      return <Icon type={Inbox} className="k-empty-icon" strokeWidth="0.01em" />;
    }
    if (React.isValidElement(image)) {
      return image;
    }
    return (
      <img
        src={image as string}
        className="k-empty-image"
        style={imageStyle}
        alt={typeof description === "string" ? description : locale?.k?.empty?.description || "Empty state image"}
      />
    );
  };

  const descriptionText = typeof description === "string" ? description : locale?.k?.empty?.description;
  const descriptionNode =
    description !== false ? (
      <p className="k-empty-description">
        {React.isValidElement(description) ? description : descriptionText}
      </p>
    ) : null;

  const footerNode = children ? <div className="k-empty-footer">{children}</div> : null;

  const classes = ["k-empty", className].filter(Boolean).join(" ");

  return (
    <div className={classes} {...rest}>
      <div className="k-empty-content">
        {renderImage()}
        {descriptionNode}
        {footerNode}
      </div>
    </div>
  );
};

export default Empty;
