import { useState } from "react";
import { CheckCardGroup } from "react-kui";

const options = [
  { value: "personal", title: "个人版", description: "适合个人项目和学习使用" },
  { value: "team", title: "团队版", description: "适合小型团队协作" },
  { value: "enterprise", title: "企业版", description: "提供企业级管理能力" },
];

export default function App() {
  const [type, setType] = useState("personal");
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <CheckCardGroup value={type} onChange={(next) => setType(String(next))} options={options} />
      <span style={{ color: "var(--kui-color-text-description)" }}>已选择：{type}</span>
    </div>
  );
}
