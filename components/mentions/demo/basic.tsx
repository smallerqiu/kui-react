import { Mentions } from "react-kui";
import { useState } from "react";
export default function App() {
  const [value, setValue] = useState("");
  return (
    <Mentions
      value={value}
      onChange={setValue}
      clearable
      placeholder="输入 @ 提及成员"
      options={["小北", "设计团队", "开发团队"]}
    />
  );
}
