import { useState } from "react";
import { Space, Col, Row } from "react-kui";
export default function Gutter() {
  const [h, setH] = useState(8);
  const [v, setV] = useState(8);
  const [cols, setCols] = useState(4);
  return (
    <Space vertical block className="demo-grid">
      <label>
        Horizontal gutter: {h}
        <input
          type="range"
          min={8}
          max={40}
          step={8}
          value={h}
          onChange={(e) => setH(Number(e.target.value))}
        />
      </label>
      <label>
        Vertical gutter: {v}
        <input
          type="range"
          min={8}
          max={40}
          step={8}
          value={v}
          onChange={(e) => setV(Number(e.target.value))}
        />
      </label>
      <label>
        Column count: {cols}
        <input
          type="range"
          min={2}
          max={12}
          step={1}
          value={cols}
          onChange={(e) => setCols(Number(e.target.value))}
        />
      </label>
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
