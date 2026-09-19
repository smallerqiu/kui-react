import { Col, Row, Space, type RowProps } from "react-kui";
import { Fragment } from "react/jsx-runtime";
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
        <Fragment key={justify}>
          <code>{justify}</code>
          <Row justify={justify} className="demo-back">
            {Array.from({ length: 4 }, (_, i) => (
              <Col span={4} key={i}>
                <div>col-4</div>
              </Col>
            ))}
          </Row>
        </Fragment>
      ))}
    </Space>
  );
}
