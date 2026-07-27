import Space from "../../space";
import { Col, Row } from "../index";
export default function Basic() {
  return (
    <Space block vertical className="demo-grid">
      <Row>
        <Col span={12}>col-12</Col>
        <Col span={12}>col-12</Col>
      </Row>
      <Row>
        {Array.from({ length: 3 }, (_, i) => (
          <Col span={8} key={i}>
            col-8
          </Col>
        ))}
      </Row>
      <Row>
        {Array.from({ length: 4 }, (_, i) => (
          <Col span={6} key={i}>
            col-6
          </Col>
        ))}
      </Row>
    </Space>
  );
}
