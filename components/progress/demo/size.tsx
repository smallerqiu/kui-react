import { Progress } from "react-kui";
export default function App() {
  return (
    <>
      Custom:
      <Progress strokeHeight={10} percent={50} />
      <Progress strokeHeight={3} percent={50} />
      <Progress strokeWidth={15} type="circle" width={80} percent={50} />
      <Progress strokeWidth={3} type="circle" width={80} percent={50} />
      <br />
      Small:
      <div style={{ width: 300, marginBottom: 30 }}>
        <Progress size="small" percent={50} />
        <Progress size="small" percent={70} status="exception" />
        <Progress size="small" percent={10} />
      </div>
      <Progress type="circle" width={80} percent={50} />
      <Progress type="circle" width={80} percent={70} status="exception" />
      <Progress type="circle" width={80} percent={100} />
    </>
  );
}
