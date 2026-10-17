import type { colors } from "./var";

export type PlacementsType =
  | "top"
  | "top-left"
  | "top-right"
  | "bottom"
  | "bottom-left"
  | "bottom-right"
  | "left"
  | "left-bottom"
  | "left-top"
  | "right"
  | "right-top"
  | "right-bottom";
export type DrawerPlacementsType = "left" | "right" | "top" | "bottom";
export type DropPlacementsType =
  "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right";

export type ValueType = "string" | "number" | "boolean";
export type SizeType = "small" | "medium" | "large";
export type ShapeType = "circle" | "square" | "round" | "default";
/**
 * Shapes a surface (card / panel / stat card) can actually draw.
 *
 * `ShapeType` is the global vocabulary and keeps `circle` for controls that mean it
 * (Avatar, Badge). A surface rounds its corners instead: a circle would clip the
 * content, so `circle` — inherited from ConfigProvider or passed by an older caller —
 * is normalised to `round`, and `default` keeps the inherited card radius. Same subset
 * as the Vue build.
 */
export type SurfaceShapeType = "square" | "round";
export type BooleanType = boolean | undefined;

export type ButtonType = "primary" | "danger" | "warning" | "default" | "text" | "link";
export type ThemeType = "outline" | "fill" | "plain" | "underlined" | "solid" | "dashed";
/**
 * The five tiers a component that paints a *plate* actually draws: every surface (Card, Collapse,
 * Alert, Page, Kanban, Transfer, ListPanel, CheckCard, Image, QRCode, FeedbackPanel) plus Tag and
 * Button. `underlined` belongs to controls you type into — a card with one edge deleted is not an
 * appearance preset — so a surface never accepts it, and the runtime guard
 * (`resolvePaintedTheme(theme, PAINTED_THEMES)`) lands anything outside these five on the plate the
 * component was built to look like.
 *
 * `ThemeType` stays the wider vocabulary of `ConfigProvider` and `Form`: a provider can still say
 * `underlined`, and the component that cannot paint it decides what that means.
 */
export type SurfaceThemeType = "fill" | "outline" | "plain" | "solid" | "dashed";
/**
 * The two tiers a mark actually draws. A checkbox or radio box paints a shallow filled plate
 * (`fill`) or an outlined one (`outline`); the other four would either delete its border or flood
 * the tick, so the mark family — Checkbox, CheckboxGroup, Radio, RadioButton, RadioGroup — accepts
 * only these two, and the guard lands anything else on `fill`.
 */
export type MarkThemeType = "fill" | "outline";

export type RadioType = "radio" | "button";
export type DirectionType = "horizontal" | "vertical" | "inline";
export type AlignType = "start" | "center" | "end";
export type ColorType = (typeof colors)[number] | string;

export type UploadStatusType = "success" | "error" | "uploading" | "waiting";

export type SpinModeType = "bounce" | "flip" | "rotate" | "zoom";
export type QRCodeStatus = "active" | "loading" | "expired" | "scanned";
export type QRCodeErrorLevel = "L" | "M" | "Q" | "H";
export type TriggerType = "hover" | "click" | "contextmenu";

export type NoticeType = "info" | "success" | "warning" | "error" | "loading";
export type FeedbackPanelKind = "positive" | "negative" | "caution" | "neutral";
export type ResultStatus = "success" | "error" | "info" | "warning" | "403" | "404" | "500";
