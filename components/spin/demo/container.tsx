import { useState } from "react";
import { Switch, Spin } from "react-kui";
export default function App() {
  const [spinning, setSpinning] = useState(false);
  return (
    <div>
      <Spin spinning={spinning}>
        <div style={{ padding: "100px 50px" }}>
          See the light through the mist.
          <br />
          See the light through the mist.
        </div>
      </Spin>
      <br />
      <br />
      Loading state：
      <Switch checked={spinning} onChange={(value) => setSpinning(Boolean(value))} />
    </div>
  );
}
