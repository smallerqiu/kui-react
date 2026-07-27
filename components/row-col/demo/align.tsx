import Space from "../../space"; import { Col, Row, type RowProps } from "../index";
const heights=[96,64,128,72]; const values:NonNullable<RowProps["align"]>[]=["top","middle","bottom"];
export default function Align(){return <Space block vertical className="demo-grid">{values.map(align=><div key={align}><code>Align {align}</code><Row align={align} justify="space-around" style={{background:"var(--kui-color-bg-2)"}}>{heights.map((height,i)=><Col span={4} key={height}><div style={{height,background:"var(--kui-color-bg-4)",padding:8}}>col-4</div></Col>)}</Row></div>)}</Space>}
