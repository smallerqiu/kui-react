import { Col, Row, Space, type RowProps } from "react-kui";
import { Fragment } from "react/jsx-runtime";
const heights = [96, 64, 128, 72];
const values: NonNullable<RowProps["align"]>[] = ["top", "middle", "bottom"];
export default function App() {
  return (
    <Space block vertical className="demo-grid">
      {values.map((align) => (
        <Fragment key={align}>
          <code>Align {align}</code>
          <Row align={align} justify="space-around" className="demo-back">
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
