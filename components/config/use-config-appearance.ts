import { useContext } from "react";
import { ConfigContext } from "./config-context";
import { FormContext } from "../form/form-context";
import type { ShapeType, ThemeType } from "../const/types";

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

/**
 * `theme="default"` means "listen to the component", so it has to resolve to the component's own
 * default tier — the same class it reaches when no `theme` is written at all. Every component that
 * paints theme classes resolves its value here instead of copying the comparison, because
 * `k-<component>-default` is a class no LESS rule can ever answer (the shared mixin has no
 * `default` arm on purpose) and shipping one is the silent bug this contract exists to end.
 */
export function resolveTheme(
  theme: ThemeType | undefined,
  fallback: Exclude<ThemeType, "default">,
): Exclude<ThemeType, "default"> {
  const value = theme ?? fallback;
  return value === "default" ? fallback : value;
}

/**
 * The other shape of "listen to the component": some components own no tier class for their default
 * look at all. Button's `k-btn-default` is a *type* class, and a tier the stylesheet never paints —
 * `k-btn-underlined`, since an underline only means something on a control you type into — is a dead
 * class. An unguarded `` [`k-<component>-${theme}`]: theme `` ships both, so a component in this shape
 * resolves through here: a value outside the tiers it actually paints yields `undefined`, emits no tier
 * class, and leaves the component's own look in place.
 */
export function resolvePaintedTheme<T extends ThemeType>(
  theme: ThemeType | undefined,
  painted: readonly T[],
): T | undefined {
  return painted.find((tier) => tier === theme);
}
