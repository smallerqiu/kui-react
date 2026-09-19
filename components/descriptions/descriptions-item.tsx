import React from "react";
import type { DescriptionsItemProps } from "./descriptions";
export type { DescriptionsItemProps };

// DescriptionsItem is a data-bearing child read by Descriptions parent via props
const DescriptionsItem: React.FC<DescriptionsItemProps> = ({ children }) => {
  return <>{children}</>;
};

export default DescriptionsItem;
