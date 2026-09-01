import { useState } from "react";
import { Mentions, type MentionOption } from "react-kui";

const options = ["Alice", "Alex", "Bob", "Bella"];
const startsWith = (query: string, option: MentionOption) =>
  option.value.toLowerCase().startsWith(query.toLowerCase());

export default function App() {
  const [value, setValue] = useState("");
  return (
    <Mentions
      value={value}
      onChange={setValue}
      options={options}
      filterOption={startsWith}
      placeholder="输入 @ 后按名称开头过滤"
    />
  );
}
