import { useState } from "react";
import InputNumber from "../../input-number";
import { Col, Row } from "../../row-col";
import Slider from "../index";
export default function WithNumber() {
  const [n1, setN1] = useState(1),
    [n2, setN2] = useState(0);
  return (
    <div>
      <Row gutter={8}>
        <Col span={12}>
          <Slider value={n1} onChange={(v) => setN1(v as number)} min={1} max={20} />
        </Col>
        <Col span={7}>
          <InputNumber value={n1} onChange={setN1} min={1} max={20} />
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <Slider value={n2} onChange={(v) => setN2(v as number)} min={0} max={1} step={0.01} />
        </Col>
        <Col span={7}>
          <InputNumber value={n2} onChange={setN2} min={0} max={1} step={0.01} />
        </Col>
      </Row>
    </div>
  );
}
