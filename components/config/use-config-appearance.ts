import { useContext } from "react";
import { ConfigContext } from "./config-context";
import { FormContext } from "../form/form-context";
import type { ShapeType, ThemeType } from "../const/types";

// Resolve inherited values separately so component props and defaults retain their priority.
/**
 * What a `ConfigProvider` says about everything under it. Form is deliberately absent: `Form`'s `size`,
 * `shape` and `theme` are documented as the appearance of its *child controls*, and a Card, Table or Alert
 * sitting inside a form is not one — inheriting there meant `<Form size="small">` shrank every panel around it.
 * Controls call `useFormAppearance` instead, which keeps the same three keys and layers Form on top.
 */
export function useConfigAppearance() {
  const config = useContext(ConfigContext);
  return {
    size: config.size,
    shape: config.shape,
    theme: config.theme,
  };
}

/** For the controls a `Form` wraps: what the form says, then what the provider says. */
export function useFormAppearance() {
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
 * Every component that paints tier classes resolves its value here instead of copying the comparison.
 * Writing no `theme` at all is how a caller says "listen to the component", and this returns the tier
 * that component was built to look like — the same class it reaches with no `theme`, so the two can
 * never drift. A component's own default differs (input-family is `fill`, `collapse` is `outline`,
 * `image` is `plain`), which is why the fallback is a parameter rather than a constant.
 */
export function resolveTheme(theme: ThemeType | undefined, fallback: ThemeType): ThemeType {
  return theme ?? fallback;
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
