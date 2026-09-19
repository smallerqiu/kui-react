import { useState } from "react";
import { Space, Input, TextArea } from "react-kui";
export default function App() {
  const [value, setValue] = useState("");
  return (
    <Space vertical block>
      <code>value: {value}</code>
      <Input
        placeholder="Please input"
        onBlur={() => console.log("blur")}
        onFocus={() => console.log("focus")}
        value={value}
        onChange={setValue}
      />
      <Input placeholder="clearable=false" clearable={false} />
      <Input placeholder="Disabled" disabled />
      <Input placeholder="Readonly" readOnly value={value} />
      <TextArea value={value} onChange={setValue} placeholder="TextArea" />
    </Space>
  );
}
