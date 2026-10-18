import { KImage, Space, type SurfaceThemeType } from "react-kui";

// An image is a frame around a picture, so the tier lands on the frame: `fill` gives it a plate, `outline` and
// `dashed` put a solid or dashed edge around it, `solid` plates the frame on the primary, and `plain` — the
// image's own look — leaves the picture alone. Listed from `plain` because that is what an image does when
// nobody tells it otherwise.
const tiers: SurfaceThemeType[] = ["plain", "fill", "outline", "solid", "dashed"];

export default function App() {
  return (
    <Space wrap size={16}>
      {tiers.map((tier) => (
        <div key={tier} style={{ display: "grid", gap: 8, justifyItems: "center" }}>
          <KImage
            width={104}
            height={104}
            theme={tier}
            src="https://cdn.chuchur.com/upload/demo/test_300.jpg"
          />
          <code>theme: {tier}</code>
        </div>
      ))}
    </Space>
  );
}
