import { Space, Tag, type SurfaceThemeType } from "react-kui";

// A tag paints the same five tiers as any other surface and starts on `fill`. `solid` is the tier that moves
// the text: the chip goes to the primary and the label and close button invert with it. A `color` written on
// the tag outranks the tier, which the colour demo shows, so this one leaves it out and keeps one chip per
// tier.
const tiers: SurfaceThemeType[] = ["fill", "outline", "plain", "solid", "dashed"];

export default function App() {
  return (
    <Space wrap size={16}>
      {tiers.map((tier) => (
        <Tag key={tier} theme={tier} closeable>
          theme: {tier}
        </Tag>
      ))}
    </Space>
  );
}
