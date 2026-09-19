import { Col, Row, Space } from "react-kui";

export default function App() {
  return (
    <Space block vertical className="demo-grid">
      <code>xs: 24 · sm: 12 · md: 8 · lg: 6</code>
      <Row gutter={[12, 12]}>
        {Array.from({ length: 4 }, (_, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <div>{index + 1}</div>
          </Col>
        ))}
      </Row>

      <code>Responsive object</code>
      <Row gutter={12}>
        <Col xs={{ span: 20, offset: 2 }} md={{ span: 12, offset: 0 }}>
          <div>xs: 20 / offset 2 · md: 12</div>
        </Col>
        <Col xs={{ span: 20, offset: 2 }} md={{ span: 12, offset: 0 }}>
          <div>xs: 20 / offset 2 · md: 12</div>
        </Col>
      </Row>
    </Space>
  );
}
