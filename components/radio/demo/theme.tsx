import { useState } from "react";
import { RadioGroup, Space, type MarkThemeType, type SurfaceThemeType } from "react-kui";

// A radio dot paints the two tiers a mark has, and the tier lands on the dot rather than on the label: `fill`
// — what it does when nobody writes a theme — gives it a pale plate, `outline` puts a border on it instead.
// `type="button"` is a different surface entirely: the group renders buttons, so it paints the five tiers a
// button has, and writing no theme at all keeps the buttons' own type-driven look — the checked one primary,
// the rest outlined. Only `fill` changes how the buttons are joined; the others keep their adjacent borders.
const marks: MarkThemeType[] = ["fill", "outline"];
const buttons: (SurfaceThemeType | undefined)[] = [
  undefined,
  "fill",
  "outline",
  "plain",
  "solid",
  "dashed",
];
const fruits = ["Apple", "Orange", "Banana"].map((label) => ({
  label,
  value: label.toLowerCase(),
}));

export default function App() {
  const [dot, setDot] = useState("apple");
  const [button, setButton] = useState("apple");
  return (
    <Space vertical block>
      {marks.map((tier) => (
        <Space key={`dot-${tier}`} vertical>
          <code>theme: {tier}</code>
          <RadioGroup options={fruits} value={dot} onChange={setDot} theme={tier} />
        </Space>
      ))}
      {buttons.map((tier) => (
        <Space key={`button-${tier}`} vertical>
          <code>{tier ? `theme: ${tier}` : "no theme"}</code>
          <RadioGroup
            type="button"
            options={fruits}
            value={button}
            onChange={setButton}
            theme={tier}
          />
        </Space>
      ))}
    </Space>
  );
}
