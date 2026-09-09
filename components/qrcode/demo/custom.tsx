import { useState } from "react";
import {
  ColorPicker,
  QRCode,
  Segmented,
  Slider,
  Space,
  Switch,
  type QRCodeErrorLevel,
} from "react-kui";
export default function App() {
  const [color, setColor] = useState("#4CAF50"),
    [size, setSize] = useState(100),
    [margin, setMargin] = useState(0),
    [level, setLevel] = useState<QRCodeErrorLevel>("L"),
    [bordered, setBordered] = useState(true);
  return (
    <Space vertical block>
      <QRCode
        value="https://react.k-ui.cn"
        size={size}
        colorDark={color}
        errorLevel={level}
        bordered={bordered}
        margin={margin}
      />
      <Space>
        Color: <ColorPicker value={color} onChange={setColor} />
      </Space>
      <Space>
        Size:{" "}
        <Slider
          value={size}
          min={100}
          max={150}
          style={{ width: 200 }}
          onChange={(v) => setSize(v as number)}
        />
      </Space>
      <Space>
        Margin:{" "}
        <Slider
          value={margin}
          max={10}
          style={{ width: 200 }}
          onChange={(v) => setMargin(v as number)}
        />
      </Space>
      <Space>
        ErrorLevel:
        <Segmented
          value={level}
          options={(["L", "M", "Q", "H"] as QRCodeErrorLevel[]).map((value) => ({ label: value, value }))}
          onChange={(v) => setLevel(v as QRCodeErrorLevel)}
        />
      </Space>
      <Space>
        Border: <Switch checked={bordered} onChange={(v) => setBordered(Boolean(v))} />
      </Space>
    </Space>
  );
}
