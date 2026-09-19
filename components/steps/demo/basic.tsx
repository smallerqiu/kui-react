import { useState } from "react";
import { Steps } from "react-kui";
export default function App() {
  const [current, setCurrent] = useState(1);
  return (
    <Steps
      current={current}
      onChange={setCurrent}
      items={[
        { title: "填写信息", description: "完善基本资料" },
        { title: "确认内容", description: "检查提交内容" },
        { title: "完成" },
      ]}
    />
  );
}
