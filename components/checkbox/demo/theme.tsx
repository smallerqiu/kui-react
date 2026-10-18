import { useState } from "react";
import { Checkbox, CheckboxGroup, Space, type CheckboxOption, type MarkThemeType } from "react-kui";

// A check box paints two tiers, and both land on the square rather than on the label: `fill` — what it does
// when nobody writes a theme — gives the box a pale plate, `outline` puts a border on it instead. Whatever the
// tier, a checked box is still primary and a disabled one still reads as disabled, and a group hands its own
// tier to every item that did not write one.
const tiers: MarkThemeType[] = ["fill", "outline"];
const options: CheckboxOption[] = ["Apple", "Orange", "Banana"].map((label) => ({
  label,
  value: label.toLowerCase(),
}));

export default function App() {
  const [grouped, setGrouped] = useState<(string | number)[]>(["apple", "banana"]);
  const [single, setSingle] = useState(true);
  return (
    <Space vertical block>
      {tiers.map((tier) => (
        <Space key={tier} vertical>
          <code>theme: {tier}</code>
          <CheckboxGroup options={options} value={grouped} onChange={setGrouped} theme={tier} />
          <Space>
            <Checkbox
              label="Checked"
              checked={single}
              onChange={({ checked }) => setSingle(checked)}
              theme={tier}
            />
            <Checkbox label="Disabled" disabled theme={tier} />
          </Space>
        </Space>
      ))}
    </Space>
  );
}
