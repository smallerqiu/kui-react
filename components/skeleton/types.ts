import type { ShapeType, SizeType } from "../const/types";

export interface SkeletonBaseProps {
  animated?: boolean;
  radius?: number;
  loading?: boolean;
  block?: boolean;
  width?: number;
  delay?: number;
  shape?: ShapeType;
  size?: number | SizeType | number[];
  title?: number;
  rows?: number;
  avatar?: boolean | { size?: SizeType; shape?: ShapeType };
}
