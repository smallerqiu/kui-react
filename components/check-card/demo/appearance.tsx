import { useState } from "react";
import { CheckCardGroup, type CheckCardValue, type SurfaceThemeType } from "react-kui";

// A check card paints all five surface tiers, and its own default is `outline` rather than the `fill` the
// other cards start on — so the row is listed from `outline` and the tiers are shown side by side instead of
// behind a switch. The last row is the disabled state: the tier still decides the shape of the box, but the
// plate and the check mark both step back.
const tiers: SurfaceThemeType[] = ["outline", "fill", "plain", "solid", "dashed"];
const items = [
  { value: "basic", title: "Basic", description: "Essential features" },
  { value: "pro", title: "Pro", description: "Advanced capabilities" },
];

export default function App() {
  const [selected, setSelected] = useState<Record<string, CheckCardValue>>(
    Object.fromEntries(tiers.map((tier) => [tier, "basic"])),
  );
  const [disabled, setDisabled] = useState<CheckCardValue>("basic");

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {tiers.map((tier) => (
        <CheckCardGroup
          key={tier}
          value={selected[tier]}
          onChange={(next) => setSelected((prev) => ({ ...prev, [tier]: next }))}
          theme={tier}
          shape="square"
          size="small"
          options={items}
        />
      ))}
      <CheckCardGroup
        value={disabled}
        onChange={(next) => setDisabled(next)}
        theme="solid"
        shape="square"
        size="small"
        options={items}
        disabled
      />
    </div>
  );
}
