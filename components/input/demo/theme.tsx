import { Search } from "kui-icons";
import { useState } from "react";
import {
  Checkbox,
  Input,
  message,
  Space,
  TextArea,
  type ShapeType,
  type ThemeType,
} from "react-kui";

// An input paints all six tiers, and the tier lands on the box itself: `fill` — what it does when nobody
// writes a theme — plates it, `outline` and `dashed` put a solid or dashed edge on it instead, `plain` leaves
// it bare, `solid` plates it on the primary and inverts the typed text, the placeholder and the icons, and
// `underlined` keeps only the bottom rule. A text area and an input with an addon are drawn from the same
// arms, so they take the same tiers. The addon is the group's own surface: a group that is not `fill` borders
// the addon it wraps, which is why the second row of each pair reads differently from the first.
const tiers: ThemeType[] = ["fill", "outline", "plain", "solid", "dashed", "underlined"];

export default function App() {
  const [circle, setCircle] = useState(false);
  const shape: ShapeType | undefined = circle ? "circle" : undefined;
  const search = (value: string) => {
    message.info("This is search event");
    console.log(value);
  };
  return (
    <Space vertical block>
      <Checkbox checked={circle} label="Circle" onChange={(event) => setCircle(event.checked)} />
      <Input placeholder="Please input" shape={shape} />
      <Input placeholder="Disabled" disabled shape={shape} />
      <Input placeholder="Please input" icon={Search} shape={shape} />
      <Input placeholder="Please input" clearable={false} shape={shape} onSearch={search} />
      <br />
      {tiers.map((tier) => (
        <div key={tier} style={{ display: "grid", gap: 4 }}>
          <code>theme: {tier}</code>
          <TextArea theme={tier} rows={2} placeholder="Please input" />
          <Input theme={tier} prefix="https://" placeholder="Please input" />
        </div>
      ))}
    </Space>
  );
}
