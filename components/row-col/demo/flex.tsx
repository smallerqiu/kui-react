import { Space, Col, Row, type RowProps } from "react-kui";
const values: NonNullable<RowProps["justify"]>[] = [
  "start",
  "center",
  "end",
  "space-around",
  "space-between",
];
export default function App() {
  return (
    <Space vertical block className="demo-grid">
      {values.map((justify) => (
        <div key={justify}>
          <code>{justify}</code>
          <Row justify={justify}>
            {Array.from({ length: 4 }, (_, i) => (
              <Col span={4} key={i}>
                <div>col-4</div>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </Space>
  );
}
