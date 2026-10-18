import { Button, FeedbackPanel, Space, type SurfaceThemeType } from "react-kui";

// A feedback panel paints all five tiers and starts on `outline`. The tier only decides how much of the panel
// shows: the four-pixel status stripe on the left and the `kind` colours stay put in every tier, while `solid`
// plates the panel itself on the primary and moves the heading and the actions onto the light ink of the plate.
const tiers: SurfaceThemeType[] = ["outline", "fill", "plain", "solid", "dashed"];

export default function App() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {tiers.map((tier) => (
        <FeedbackPanel
          key={tier}
          theme={tier}
          kind="positive"
          heading={`theme: ${tier}`}
          description="状态色带和图标不受档位影响，只有面板自己铺多少。"
          actions={
            <Space>
              <Button type="primary">继续</Button>
              <Button>查看设置</Button>
            </Space>
          }
        />
      ))}
    </div>
  );
}
