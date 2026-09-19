import { useState } from "react";
import {
  ColorPicker,
  Input,
  Radio,
  RadioGroup,
  Col,
  Row,
  Slider,
  Space,
  Watermark,
  type WatermarkLayoutType,
} from "react-kui";
export default function App() {
  const [content, setContent] = useState("Kui React"),
    [color, setColor] = useState("rgba(100, 100, 100, 0.3)"),
    [fontSize, setFontSize] = useState(16),
    [rotate, setRotate] = useState(45),
    [gap, setGap] = useState<number[]>([16, 16]),
    [offset, setOffset] = useState<number[]>([8, 8]),
    [layout, setLayout] = useState<WatermarkLayoutType>("stagger");
  return (
    <Row>
      <Col span={18}>
        <div className="salary-card" style={{ width: "100%", height: 500 }}>
          <Watermark
            content={content}
            font={{ color, fontSize }}
            rotate={rotate}
            gap={gap as [number, number]}
            offset={offset as [number, number]}
            layout={layout}
          />
        </div>
      </Col>
      <Col span={6}>
        <Space vertical>
          Content:
          <Input value={content} maxLength={15} onChange={setContent} />
          Color:
          <ColorPicker value={color} onChange={setColor} />
          Font Size:
          <Slider value={fontSize} min={12} max={48} onChange={(v) => setFontSize(v as number)} />
          Rotate:
          <Slider value={rotate} min={0} max={360} onChange={(v) => setRotate(v as number)} />
          Gap:
          <Slider value={gap} range onChange={(v) => setGap(v as number[])} />
          Offset:
          <Slider value={offset} range onChange={(v) => setOffset(v as number[])} />
          Layout:
          <RadioGroup value={layout} onChange={(v) => setLayout(v as WatermarkLayoutType)}>
            <Radio value="stagger">Stagger</Radio>
            <Radio value="grid">Grid</Radio>
          </RadioGroup>
        </Space>
      </Col>
    </Row>
  );
}
