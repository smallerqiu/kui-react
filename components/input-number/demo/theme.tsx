import { InputNumber, Space, type ThemeType } from "react-kui";

// A number input is a text control, so it paints all six tiers: `fill` — what it does when nobody writes a
// theme — plates the box, `outline` and `dashed` put a solid or dashed edge on it instead, `plain` leaves it
// bare, `solid` plates it on the primary and inverts the digits, the placeholder and the steppers, and
// `underlined` keeps only the bottom rule. The steppers are part of the box, so they follow the tier.
const tiers: ThemeType[] = ["fill", "outline", "plain", "solid", "dashed", "underlined"];

export default function App() {
  return (
    <Space vertical block style={{ width: 220, maxWidth: "100%" }}>
      {tiers.map((tier) => (
        <div key={tier} style={{ display: "grid", gap: 4, justifyItems: "start" }}>
          <code>theme: {tier}</code>
          <InputNumber theme={tier} value={42} />
        </div>
      ))}
    </Space>
  );
}
