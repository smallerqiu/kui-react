import { useState } from "react";
import { Col, Row, Slider, Space } from "react-kui";

const gutterMarks = { 8: "8", 16: "16", 24: "24", 32: "32", 40: "40" };
const columnMarks = { 2: "2", 3: "3", 4: "4", 6: "6", 8: "8", 12: "12" };

export default function App() {
  const [h, setH] = useState(8);
  const [v, setV] = useState(8);
  const [cols, setCols] = useState(4);
  return (
    <Space vertical block className="demo-grid">
      <code>gutter = 10</code>
      <Row gutter={10} className="row-gutter">
        <Col span={12}>
          <div>col-12</div>
        </Col>
        <Col span={12}>
          <div>col-12</div>
        </Col>
      </Row>
      <code>Horizontal Gutter (px): {h}</code>
      <div style={{ width: "55%", padding: "10,0" }}>
        <Slider
          min={8}
          max={40}
          step={null}
          marks={gutterMarks}
          value={h}
          onChange={(value) => setH(value as number)}
        />
      </div>
      <code>Vertical Gutter (px): {v}</code>
      <div style={{ width: "55%", padding: "10,0" }}>
        <Slider
          min={8}
          max={40}
          step={null}
          marks={gutterMarks}
          value={v}
          onChange={(value) => setV(value as number)}
        />
      </div>
      <code>Column Count: {cols}</code>
      <div style={{ width: "55%", padding: "10,0" }}>
        <Slider
          min={2}
          max={12}
          step={null}
          marks={columnMarks}
          value={cols}
          onChange={(value) => setCols(value as number)}
        />
      </div>
      <Row gutter={[h, v]}>
        {Array.from({ length: cols * 2 }, (_, i) => (
          <Col span={24 / cols} key={i}>
            <div>col-{cols}</div>
          </Col>
        ))}
      </Row>
    </Space>
  );
}
