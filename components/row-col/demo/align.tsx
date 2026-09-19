import { Col, Row, Space, type RowProps } from "react-kui";
import { Fragment } from "react/jsx-runtime";
const heights = [96, 64, 128, 72];
const values: Array<{ value: NonNullable<RowProps["align"]>; label: string }> = [
  { value: "top", label: "Top" },
  { value: "middle", label: "Middle" },
  { value: "bottom", label: "Bottom" },
];
export default function App() {
  return (
    <Space block vertical className="demo-grid">
      {values.map(({ value, label }) => (
        <Fragment key={value}>
          <code>Align {label}</code>
          <Row align={value} justify="space-around" className="demo-back">
            {heights.map((height) => (
              <Col span={4} key={height}>
                <div className={`h-${height}`}>col-4</div>
              </Col>
            ))}
          </Row>
        </Fragment>
      ))}
    </Space>
  );
}
