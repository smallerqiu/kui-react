import { useState } from "react";
import { Select } from "react-kui";
export default function App() {
  const [value, setValue] = useState<(string | number)[]>([]);
  return <Select multiple allowCreate filterable block value={value} options={[{ label: "React", value: "React" }, { label: "TypeScript", value: "TypeScript" }]} placeholder="输入内容后按回车创建" onChange={(next) => Array.isArray(next) && setValue(next)} />;
}
