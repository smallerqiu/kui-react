import { Progress } from "react-kui";
export default function Circle() {
  return (
    <>
      <Progress type="circle" percent={50} />
      <Progress type="circle" percent={70} status="exception" />
      <Progress type="circle" percent={100} />
      <Progress type="circle" percent={50}>
        <div>
          <h2 style={{ margin: 0, fontSize: 23 }}>13389</h2>
          <span style={{ fontSize: 14, color: "#999" }}>Steps</span>
        </div>
      </Progress>
    </>
  );
}
