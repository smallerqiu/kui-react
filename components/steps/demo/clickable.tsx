import { Space, Steps } from "react-kui";
import { useState } from "react";
export default function App() {
  const [current, setCurrent] = useState(0);
  return (
    <Space vertical block>
      <Steps
        current={current}
        onChange={setCurrent}
        items={[{ title: "购物车" }, { title: "确认订单" }, { title: "支付" }]}
      />
      <span>当前步骤：{current + 1}</span>
    </Space>
  );
}
