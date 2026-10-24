import { AutoComplete, Space } from "react-kui";
import { useState } from "react";
export default function App() {
  const [value, setValue] = useState("");
  return (
    <Space vertical block>
      <AutoComplete
        value={value}
        onChange={setValue}
        addonBefore="https://"
        addonAfter=".com"
        placeholder="Please input domain"
        options={["kui", "kui-pro", "kui-admin", "kui-docs"]}
      />
      <AutoComplete
        prefix="@"
        suffix=".cn"
        placeholder="Please input handle"
        options={["kui", "kui-pro", "kui-admin", "kui-docs"]}
      />
    </Space>
  );
}
