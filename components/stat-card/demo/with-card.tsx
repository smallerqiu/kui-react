import { ArrowDown, ArrowUp } from "kui-icons";
import { useState } from "react";
import { Button, Card, Icon, Space, StatNumber } from "react-kui";
export default function WithCard() {
  const [value, setValue] = useState(Math.random() * 100000);
  return (
    <Space vertical className="demo-view-fill">
      <Card bordered={false}>
        <StatNumber value={value} prefix="$" suffix="%" style={{ fontSize: "2em" }} />
      </Card>
      <Card bordered={false} title="Today's Trends">
        <StatNumber
          value={value}
          suffix="%"
          style={{ fontSize: "2em", color: "green" }}
          prefix={<Icon type={ArrowUp} />}
        />
      </Card>
      <Card bordered={false} title="Yesterday's Trend">
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
