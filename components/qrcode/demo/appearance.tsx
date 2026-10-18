import { QRCode, Space, type SurfaceThemeType } from "react-kui";

// A code is a frame around a canvas, so its tiers read the same way an image's do, and its own look is
// `outline` — the ring it draws when nobody writes a theme. The modules inside stay the same ink in every
// tier; only the frame around them changes.
const tiers: SurfaceThemeType[] = ["outline", "fill", "plain", "solid", "dashed"];

export default function App() {
  return (
    <Space wrap size={16}>
      {tiers.map((tier) => (
        <div key={tier} style={{ display: "grid", gap: 8, justifyItems: "center" }}>
          <QRCode value="https://react.k-ui.cn" size={104} theme={tier} />
          <code>theme: {tier}</code>
        </div>
      ))}
    </Space>
  );
}
