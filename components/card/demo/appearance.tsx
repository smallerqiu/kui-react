import type { SurfaceShapeType, SurfaceThemeType } from "react-kui";
import { Card, Space } from "react-kui";

const shapes: SurfaceShapeType[] = ["round", "square"];
const themes: SurfaceThemeType[] = ["fill", "outline", "plain", "solid", "dashed"];

export default function Demo() {
  return (
    <Space vertical block>
      <Space>
        {shapes.map((shape) => (
          <Card key={shape} shape={shape} style={{ width: 180 }}>
            shape: {shape}
          </Card>
        ))}
      </Space>
      <Space>
        {themes.map((theme) => (
          <Card key={theme} theme={theme} shape="square" style={{ width: 180 }}>
            theme: {theme}
          </Card>
        ))}
      </Space>
    </Space>
  );
}
