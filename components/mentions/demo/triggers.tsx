import { Mentions } from "react-kui";
import { useState } from "react";
export default function App() {
  const [value, setValue] = useState("");
  return (
    <Mentions
      value={value}
      onChange={setValue}
      triggers={["@", "#"]}
      options={["xiaobei", "前端", "组件库", "设计系统"]}
      placeholder="输入 @ 提及成员，输入 # 关联话题"
    />
  );
}
