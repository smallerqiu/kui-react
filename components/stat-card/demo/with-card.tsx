import { ArrowDown, ArrowUp } from "kui-icons";
import { useState } from "react";
import { Button, Card, Icon, Space, StatNumber } from "react-kui";
export default function App() {
  const [value, setValue] = useState(12345.67);
  return (
    <Space vertical className="demo-view-fill">
      <Card theme="plain">
        <StatNumber value={value} prefix="$" suffix="%" style={{ fontSize: "2em" }} />
      </Card>
      <Card theme="plain" title="Today's Trends">
        <StatNumber
          value={value}
          suffix="%"
          style={{ fontSize: "2em", color: "green" }}
          prefix={<Icon type={ArrowUp} />}
        />
      </Card>
      <Card theme="plain" title="Yesterday's Trend">
        <StatNumber
          value={value}
          suffix="%"
          style={{ fontSize: "2em", color: "red" }}
          type="rollup"
          prefix={<Icon type={ArrowDown} />}
        />
      </Card>
      <Button onClick={() => setValue(Math.random() * 100000)}>change</Button>
    </Space>
  );
}
