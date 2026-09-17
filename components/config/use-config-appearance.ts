import { useContext } from "react";
import { ConfigContext } from "./config-context";
import { FormContext } from "../form/form-context";
import type { ShapeType } from "../const/types";

// Resolve inherited values separately so component props and defaults retain their priority.
export function useConfigAppearance() {
  const config = useContext(ConfigContext);
  const form = useContext(FormContext);
  return {
    size: form?.size ?? config.size,
    shape: form?.shape ?? config.shape,
    theme: form?.theme ?? config.theme,
  };
}

export function normalizeSurfaceShape(shape: ShapeType | undefined) {
  return shape === "circle" ? "round" : shape;
}
